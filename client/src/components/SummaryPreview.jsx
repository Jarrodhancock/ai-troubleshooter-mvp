import React from "react";

export default function SummaryPreview({ summaryText }) {
  return (
    <>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>Summary preview</div>
      <div className="summaryBox">{summaryText}</div>
      <div className="small" style={{ marginTop: 8 }}>
        This summary will be sent to the AI as the authoritative context.
      </div>
    </>
  );
}
