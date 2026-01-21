import React, { useMemo, useState } from "react";
import { sendChat } from "../api.js";

export default function ChatPanel({ sessionId, summaryText, started, onStart, onReset }) {
  const [messages, setMessages] = useState([]); // only user/assistant turns after submit
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSend = draft.trim().length > 0 && !loading;

  async function submitInitial() {
    setErr("");
    setLoading(true);
    try {
      // Initial assistant response: client sends empty history; server injects summary deterministically
      const res = await sendChat({ sessionId, summaryText, messages: [] });
      setMessages([{ role: "assistant", content: res.assistant }]);
      onStart?.();
    } catch (e) {
      setErr(e.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    setErr("");
    const userMsg = { role: "user", content: draft.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setDraft("");
    setLoading(true);
    try {
      const res = await sendChat({ sessionId, summaryText, messages: next });
      setMessages([...next, { role: "assistant", content: res.assistant }]);
    } catch (e) {
      setErr(e.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>AI assistant</div>

      {!started ? (
        <>
          <div className="hint">
            When you click <b>Submit to AI</b>, the assistant will use the summary and give step-by-step actions.
          </div>
          <div className="footerActions">
            <button className="secondary" onClick={onReset}>Start Over</button>
            <button onClick={submitInitial} disabled={loading}>
              {loading ? "Starting…" : "Submit to AI"}
            </button>
          </div>
          {err ? <div className="small" style={{ color: "crimson", marginTop: 10 }}>{err}</div> : null}
        </>
      ) : (
        <>
          <div className="chatBox">
            {messages.map((m, idx) => (
              <div key={idx} className={"msg " + m.role}>
                {m.content}
              </div>
            ))}
            {loading ? <div className="small">AI is responding…</div> : null}
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label>Continue troubleshooting</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Answer the AI's question or describe what happened after a step…"
            />
          </div>

          <div className="footerActions">
            <button className="secondary" onClick={onReset}>Start Over</button>
            <button onClick={send} disabled={!canSend}>
              Send
            </button>
          </div>

          {err ? <div className="small" style={{ color: "crimson", marginTop: 10 }}>{err}</div> : null}
        </>
      )}
    </div>
  );
}
