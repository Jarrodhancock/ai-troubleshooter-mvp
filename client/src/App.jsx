import React, { useMemo, useState } from "react";
import TroubleshooterModal from "./components/TroubleshooterModal.jsx";
import { getOrCreateSessionId } from "./utils/uuid.js";

export default function App() {
  const sessionId = useMemo(() => getOrCreateSessionId(), []);
  const [open, setOpen] = useState(false);

  return (
    <div className="page">
      <div className="header">
        <div>
          <div style={{ fontSize: 26, fontWeight: 950 }}>AI Troubleshooting Demo (MVP)</div>
          <div className="hint">Single-page app → click button → modal opens → guided decision tree → summary → AI steps → chat.</div>
        </div>
        <button onClick={() => setOpen(true)}>AI Troubleshooter</button>
      </div>

      <div style={{ marginTop: 18 }} className="hint">
        Session: <span style={{ fontFamily: "ui-monospace, monospace" }}>{sessionId}</span>
      </div>

      <TroubleshooterModal open={open} onClose={() => setOpen(false)} sessionId={sessionId} />
    </div>
  );
}
