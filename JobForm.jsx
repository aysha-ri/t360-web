import React, { useState } from "react";

export default function JobForm({ API, onCreated }) {
  const [title, setTitle] = useState("Senior HR Operations");
  const [budget, setBudget] = useState(68000);
  const [type, setType] = useState("Full-time");
  const [location, setLocation] = useState("Frankfurt (Hybrid)");
  const create = async () => {
    if (!title) return alert("Enter job title");
    const res = await fetch(API + "/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, budget, type, location }),
    });
    const j = await res.json();
    if (res.ok) {
      onCreated(j.id);
    } else alert(j.error || "Failed");
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
      <h3>1) Create Job</h3>
      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(2,1fr)",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
        />
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          type="number"
          placeholder="Budget"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <button
          onClick={create}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "0",
            background: "#b58d5b",
            color: "#072432",
            fontWeight: 800,
          }}
        >
          Create Job
        </button>
      </div>
    </div>
  );
}