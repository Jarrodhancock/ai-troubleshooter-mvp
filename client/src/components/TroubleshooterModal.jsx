import React, { useMemo, useState } from "react";
import Modal from "./Modal.jsx";
import DecisionTree from "./DecisionTree.jsx";
import SummaryPreview from "./SummaryPreview.jsx";
import ChatPanel from "./ChatPanel.jsx";

import { DECISION_TREE } from "../decisionTree.js";
import { impliesGraphics, impliesNetwork } from "../utils/heuristics.js";
import { buildSummary } from "../utils/summary.js";
import { uploadScreenshot } from "../api.js";

export default function TroubleshooterModal({ open, onClose, sessionId }) {
  const [answers, setAnswers] = useState({});
  const [uploaded, setUploaded] = useState([]); // [{fileId, originalName, mimeType, size}]
  const [uploadErr, setUploadErr] = useState("");
  const [uploading, setUploading] = useState(false);

  const [chatStarted, setChatStarted] = useState(false);

  function setAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function resetAll() {
    setAnswers({});
    setUploaded([]);
    setUploadErr("");
    setUploading(false);
    setChatStarted(false);
  }

  // Combine text to decide conditional steps (graphics/network)
  const allTextForHeuristics = useMemo(() => {
    const parts = [
      answers.problemApp,
      answers.problemAppOther,
      answers.beforeIssue,
      answers.errorMessage
    ].filter(Boolean);
    return parts.join(" | ");
  }, [answers]);

  const showGraphics = impliesGraphics(allTextForHeuristics);
  const showNetwork = impliesNetwork(allTextForHeuristics);

  const visibleSteps = useMemo(() => {
    return DECISION_TREE.filter((s) => {
      if (s.conditionalKey === "showGraphics") return showGraphics;
      if (s.conditionalKey === "showNetwork") return showNetwork;
      return true;
    });
  }, [showGraphics, showNetwork]);

  // Progressive reveal: advance only when current step is "complete enough"
  const currentStepIndex = useMemo(() => {
    // Find first step that isn't completed
    for (let i = 0; i < visibleSteps.length; i++) {
      const step = visibleSteps[i];
      if (step.id === "step8") return i; // summary always last & visible

      // For step completeness: require all visible fields to be filled with non-empty values.
      // (Not sure counts as filled.)
      const requiredFields = step.fields.filter((f) => !f.showWhen || f.showWhen(answers));
      const baseComplete = requiredFields.every((f) => {
        const v = answers[f.key];
        return typeof v === "string" ? v.trim().length > 0 : v != null;
      });

      // Also require substep fields if substep is active
      const subComplete = (step.subSteps || []).every((ss) => {
        if (!ss.when(answers)) return true;
        return ss.fields.every((f) => {
          const v = answers[f.key];
          return typeof v === "string" ? v.trim().length > 0 : v != null;
        });
      });

      // Step 7 also expects screenshot upload optional, so no requirement there
      if (!baseComplete || !subComplete) return Math.max(0, i);
    }
    return visibleSteps.length - 1;
  }, [visibleSteps, answers]);

  const summaryText = useMemo(() => buildSummary(answers, uploaded), [answers, uploaded]);

  async function onFilePicked(file) {
    setUploadErr("");
    if (!file) return;

    try {
      setUploading(true);
      const meta = await uploadScreenshot(file);
      setUploaded((prev) => [...prev, meta]);
    } catch (e) {
      setUploadErr(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const atSummaryStep = visibleSteps[currentStepIndex]?.id === "step8";

  return (
    <Modal open={open} title="AI Troubleshooter" onClose={onClose}>
      <div className="modalBody">
        <div className="panel">
          <div className="hint" style={{ marginBottom: 12 }}>
            Answer each step. Some steps appear only if needed (Graphics / Network). “Not sure” is always OK.
          </div>

          <DecisionTree
            tree={DECISION_TREE}
            answers={answers}
            setAnswer={setAnswer}
            visibleSteps={visibleSteps}
            currentStepIndex={currentStepIndex}
          />

          {/* Screenshot upload is part of Step 7 per your tree */}
          {/* Only show upload UI once Step 7 is visible */}
          {visibleSteps.slice(0, currentStepIndex + 1).some(s => s.id === "step7") ? (
            <div className="step">
              <div className="stepTitle">Screenshot upload (STEP 7)</div>
              <div className="hint">
                Upload PNG/JPG (max 5MB). This demo stores files temporarily and does not persist them.
              </div>
              <div className="field" style={{ marginTop: 10 }}>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => onFilePicked(e.target.files?.[0])}
                  disabled={uploading}
                />
              </div>
              {uploading ? <div className="small">Uploading…</div> : null}
              {uploadErr ? <div className="small" style={{ color: "crimson" }}>{uploadErr}</div> : null}
              {uploaded.length ? (
                <div className="small" style={{ marginTop: 8 }}>
                  Uploaded: {uploaded.map(f => f.originalName).join(", ")}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="footerActions">
            <button className="secondary" onClick={resetAll}>Start Over</button>
          </div>
        </div>

        <div className="panel">
          <SummaryPreview summaryText={summaryText} />
          <hr className="sep" />
          <ChatPanel
            sessionId={sessionId}
            summaryText={summaryText}
            started={chatStarted}
            onStart={() => setChatStarted(true)}
            onReset={resetAll}
          />
          {!atSummaryStep ? (
            <div className="small" style={{ marginTop: 10 }}>
              Tip: Complete the form to unlock the best AI guidance. You can still submit early if you want.
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
