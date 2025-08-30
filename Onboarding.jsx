import React from "react";

export default function Onboarding({ API, jobId, onStarted }) {
  const start = async () => {
    if (!jobId) return alert("Create job first");
    const r = await fetch(`${API}/api/jobs/${jobId}/onboarding/start`, {
      method: "POST",
    });
    const j = await r.json();
    if (j.ok) {
      onStarted?.();
      alert("Onboarding started");
    }
  };
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e9ee",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <h3>5) Onboarding</h3>
      <button
        onClick={start}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "0",
          background: "#b58d5b",
          color: "#072432",
          fontWeight: 800,
        }}
      >
        Start Onboarding
      </button>
    </div>
  );
}