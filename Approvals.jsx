import React, { useState } from "react";

export default function Approvals({ API, jobId, onApproved }) {
  const [policy, setPolicy] = useState(false);
  const [internal, setInternal] = useState(false);
  const update = async (field) => {
    if (!jobId) return alert("Create job first");
    const body = {};
    body[field] = true;
    const res = await fetch(`${API}/api/jobs/${jobId}/approvals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      field === "policy" ? setPolicy(true) : setInternal(true);
      if (field === "policy") onApproved?.();
    } else {
      const j = await res.json();
      alert(j.error || "Error");
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
      <h3>2) Approvals</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #e6e9ee",
            background: policy ? "#2ecc700f" : "#fff",
          }}
        >
          Policy: {policy ? "Approved" : "Pending"}
        </span>
        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #e6e9ee",
            background: internal ? "#2ecc700f" : "#fff",
          }}
        >
          Internal: {internal ? "Closed" : "Pending"}
        </span>
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={() => update("policy")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #b58d5b",
            background: "#fff",
          }}
        >
          Mark Policy Approved
        </button>
        <button
          onClick={() => update("internal")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #b58d5b",
            background: "#fff",
          }}
        >
          Mark Internal Closed
        </button>
      </div>
    </div>
  );
}