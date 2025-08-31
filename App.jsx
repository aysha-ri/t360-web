import React, { useState } from "react";
import Stepper from "./components/Stepper.jsx";
import JobForm from "./components/JobForm.jsx";
import Approvals from "./components/Approvals.jsx";
import Profiles from "./components/Profiles.jsx";
import Offers from "./components/Offers.jsx";
import Onboarding from "./components/Onboarding.jsx";

// Use a single API constant with the correct env variable and a relative fallback
const API = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [jobId, setJobId] = useState(null);
  const [step, setStep] = useState(1);

  return (
    <div style={{ padding: "8px 0 22px" }}>
      <Stepper step={step} />
      <div style={{ display: "grid", gap: 12 }}>
        <JobForm
          API={API}
          onCreated={(id) => {
            setJobId(id);
            setStep(2);
          }}
        />
        <Approvals
          API={API}
          jobId={jobId}
          onApproved={() => setStep(3)}
        />
        <Profiles
          API={API}
          jobId={jobId}
          onFetched={() => setStep(4)}
        />
        <Offers
          API={API}
          jobId={jobId}
          onSelected={() => setStep(5)}
        />
        <Onboarding
          API={API}
          jobId={jobId}
          onStarted={() => setStep(6)}
        />
      </div>
    </div>
  );
}
