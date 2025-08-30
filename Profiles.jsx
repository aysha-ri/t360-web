import React, { useState } from "react";

export default function Profiles({ API, jobId, onFetched }) {
  const [profiles, setProfiles] = useState([]);
  const [code, setCode] = useState("REVIEW-123");
  const preview = async () => {
    if (!jobId) return alert("Create job first");
    const res = await fetch(`${API}/api/jobs/${jobId}/profiles`);
    const j = await res.json();
    if (res.ok) {
      setProfiles(j.profiles);
      onFetched?.();
    } else alert(j.error || "Error");
  };
  const unlock = async () => {
    if (!jobId) return alert("Create job first");
    const res = await fetch(`${API}/api/jobs/${jobId}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment2: true, reviewer: code }),
    });
    const j = await res.json();
    if (res.ok) {
      preview();
    } else alert(j.error || "Error");
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
      <h3>3) Talent Match Preview</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={preview}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "0",
            background: "#b58d5b",
            color: "#072432",
            fontWeight: 800,
          }}
        >
          Get Profiles
        </button>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e6e9ee",
            borderRadius: 10,
          }}
        />
        <button
          onClick={unlock}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #b58d5b",
            background: "#fff",
          }}
        >
          Unlock
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(3,1fr)",
        }}
      >
        {profiles.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e6e9ee",
              borderRadius: 12,
              padding: 10,
            }}
          >
            <div style={{ fontWeight: 800 }}>{p.name}</div>
            <div>{p.role}</div>
            <div style={{ opacity: 0.7 }}>
              Skill: {p.skill} · Score {p.score}
            </div>
            {p.masked && (
              <div
                style={{
                  marginTop: 6,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #f39c1244",
                  background: "#f39c120f",
                }}
              >
                Masked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}