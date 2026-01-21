import React from "react";

function PillGroup({ value, options, onChange }) {
  return (
    <div className="pills">
      {options.map((opt) => (
        <div
          key={opt}
          className={"pill " + (value === opt ? "active" : "")}
          onClick={() => onChange(opt)}
          role="button"
          tabIndex={0}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

function Field({ field, answers, setAnswer }) {
  if (field.showWhen && !field.showWhen(answers)) return null;

  const v = answers[field.key] ?? "";

  if (field.type === "pill") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <PillGroup value={v} options={field.options} onChange={(opt) => setAnswer(field.key, opt)} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select value={v} onChange={(e) => setAnswer(field.key, e.target.value)}>
          <option value="" disabled>Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <input
          type="text"
          value={v}
          onChange={(e) => setAnswer(field.key, e.target.value)}
          placeholder="Type here…"
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <textarea
          value={v}
          onChange={(e) => setAnswer(field.key, e.target.value)}
          placeholder="Type here…"
        />
      </div>
    );
  }

  return null;
}

export default function DecisionTree({ tree, answers, setAnswer, visibleSteps, currentStepIndex }) {
  return (
    <>
      {visibleSteps.slice(0, currentStepIndex + 1).map((step) => (
        <div className="step" key={step.id}>
          <div className="stepTitle">{step.title}</div>

          {step.fields.map((field) => (
            <Field key={field.key} field={field} answers={answers} setAnswer={setAnswer} />
          ))}

          {Array.isArray(step.subSteps) && step.subSteps.map((ss, idx) => (
            ss.when(answers) ? (
              <div key={idx} className="row" style={{ marginTop: 10 }}>
                {ss.fields.map((field) => (
                  <div key={field.key}>
                    <Field field={field} answers={answers} setAnswer={setAnswer} />
                  </div>
                ))}
              </div>
            ) : null
          ))}
        </div>
      ))}
    </>
  );
}
