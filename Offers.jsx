import React, { useState } from "react";

export default function Offers({ API, jobId, onSelected }) {
  const [offers, setOffers] = useState([]);
  const [idx, setIdx] = useState("");
  const schedule = async () => {
    if (!jobId) return alert("Create job first");
    await fetch(`${API}/api/jobs/${jobId}/interviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 3 }),
    });
  };
  const genOffers = async () => {
    if (!jobId) return alert("Create job first");
    const r = await fetch(`${API}/api/jobs/${jobId}/offers`);
    const j = await r.json();
    if (r.ok) {
      setOffers(j.offers);
    } else alert(j.error || "Error");
  };
  const select = async () => {
    if (idx === "") return alert("Pick an offer index");
    const r = await fetch(`${API}/api/jobs/${jobId}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: Number(idx) }),
    });
    const j = await r.json();
    if (r.ok) {
      onSelected?.();
      alert("Offer sent to " + j.selected.employer);
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
      <h3>4) Interviews & Offers</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={schedule}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #b58d5b",
            background: "#fff",
          }}
        >
          Schedule Interviews
        </button>
        <button
          onClick={genOffers}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "0",
            background: "#b58d5b",
            color: "#072432",
            fontWeight: 800,
          }}
        >
          Generate Offers
        </button>
        <select
          value={idx}
          onChange={(e) => setIdx(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e6e9ee",
            borderRadius: 10,
          }}
        >
          <option value="">Select offer #</option>
          {offers.map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <button
          onClick={select}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #b58d5b",
            background: "#fff",
          }}
        >
          Send Offer
        </button>
      </div>
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Employer</th>
              <th>Base (€)</th>
              <th>Bonus</th>
              <th>Benefits</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{o.employer}</td>
                <td>{o.base}</td>
                <td>{o.bonus}</td>
                <td>{o.benefits}</td>
                <td>{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}