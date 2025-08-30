import React from "react";

export default function Stepper({ step = 1 }) {
  const items = [
    "Create Job",
    "Approvals",
    "Talent Match",
    "Interviews & Offers",
    "Onboarding",
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        margin: "8px 0",
      }}
    >
      {items.map((t, i) => (
        <div
          key={i}
          style={{
            padding: "8px 10px",
            border: "1px solid #e6e9ee",
            borderRadius: 12,
            background: i < step ? "#fff8f0" : "#fff",
            borderColor: i < step ? "#b58d5b" : "#e6e9ee",
          }}
        >
          {i + 1}. {t}
        </div>
      ))}
    </div>
  );
}