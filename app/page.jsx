import { useState } from "react";

const PERMIT_TYPES = [
  "Building Permit (New Construction)",
  "Building Permit (Addition/Alteration)",
  "Grading & Grubbing Permit",
  "Special Management Area (SMA) Use Permit",
  "Shoreline Setback Variance",
  "Zoning Variance",
  "Use Permit (Special Use)",
  "Flood Zone Development Permit",
  "Demolition Permit",
  "Electrical Permit",
  "Plumbing Permit",
  "Other / Not Sure",
];

const ZONES = [
  "Residential (R-1 through R-20)",
  "Agricultural (A-1 or A-2)",
  "Open (O)",
  "Conservation (C)",
  "Commercial (C-1 through C-3)",
  "Industrial (I or M)",
  "Tourism (T or V)",
  "Special Treatment (ST)",
  "Not Sure",
];

const INITIAL_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  tmk: "", address: "", district: "", zone: "",
  permitType: "", projectDescription: "", sqft: "",
  stories: "", estimatedCost: "", inSMA: "",
  inFloodZone: "", historicProperty: "", nearStream: "", additionalInfo: "",
};

const DISTRICTS = ["Lihue", "Hanalei", "Koloa", "Waimea", "Kawaihau", "Not Sure"];

function FieldGroup({ label, children, required }) {
  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7c59", marginBottom: "0.45rem", fontFamily: "'DM Mono', monospace" }}>
        {label}{required && <span style={{ color: "#c0392b", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "0.65rem 0.85rem", border: "1.5px solid #c8dfc7", borderRadius: "6px", fontSize: "0.93rem", color: "#1a2e1c", background: "#fafdfa", fontFamily: "'Lora', Georgia, serif", outline: "none", transition: "border 0.2s", boxSizing: "border-box" };

function Input({ value, onChange, placeholder, type = "text" }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = "#4a7c59"} onBlur={e => e.target.style.borderColor = "#c8dfc7"} />;
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange} style={{ ...inputStyle, appearance: "none", cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234a7c59' stroke-width='2' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 12px) center", paddingRight: "2rem" }} onFocus={e => e.target.style.borderColor = "#4a7c59"} onBlur={e => e.target.style.borderColor = "#c8dfc7"}>
      <option value="">{placeholder || "Select..."}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = "#4a7c59"} onBlur={e => e.target.style.borderColor = "#c8dfc7"} />;
}

function RadioGroup({ value, onChange, name }) {
  return (
    <div style={{ display: "flex", gap: "1.5rem" }}>
      {["Yes", "No", "Unsure"].map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.92rem", color: "#2d4a30", fontFamily: "'Lora', serif" }}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} style={{ accentColor: "#4a7c59" }} />
          {opt}
        </label>
      ))}
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < total - 1 ? 1 : "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: i < current ? "#4a7c59" : i === current ? "#2d6a3f" : "#ddeedd", color: i <= current ? "#fff" : "#7aab82", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, fontFamily: "'DM Mono', monospace", border: i === current ? "2.5px solid #1a5c2a" : "none", flexShrink: 0 }}>
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && <div style={{ flex: 1, height: 2, background: i < current ? "#4a7c59" : "#ddeedd", margin: "0 4px" }} />}
        </div>
      ))}
    </div>
  );
}

const STEP_TITLES = ["Applicant Info", "Property Details", "Project Scope", "Site Conditions", "AI Review"];

function AIReviewPanel({ form }) {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  const runReview = async () => {
    setStatus("loading");
    setResult(null);
    const prompt = `You are an expert permit reviewer for Kauai County, Hawaii. Analyze this permit prescreen application and provide:
1. Preliminary Eligibility Assessment
2. Applicable Permit Types
3. Key Regulatory Considerations (cite Kauai County Code chapters)
4. Potential Red Flags
5. Recommended Next Steps
6. Estimated Review Timeline

APPLICATION:
- Applicant: ${form.firstName} ${form.lastName}
- Address: ${form.address}, ${form.district} District
- TMK: ${form.tmk || "Not provided"}
- Zoning: ${form.zone}
- Permit Type: ${form.permitType}
- Description: ${form.projectDescription}
- Sq Ft: ${form.sqft || "Not specified"}
- Stories: ${form.stories || "Not specified"}
- Est Cost: ${form.estimatedCost ? "$" + form.estimatedCost : "Not specified"}
- In SMA: ${form.inSMA}
- In Flood Zone: ${form.inFloodZone}
- Historic Property: ${form.historicProperty}
- Near Waterway: ${form.nearStream}
- Additional Info: ${form.additionalInfo || "None"}`;

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      setResult(data.content?.map(b => b.text || "").join("") || "");
      setStatus("done");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #eaf5eb, #f0f8f0)", border: "1.5px solid #b5d9b8", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "1.5rem" }}>🌺</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1a3320", fontWeight: 700 }}>AI Permit Pre-Screening</div>
            <div style={{ fontSize: "0.8rem", color: "#5a7a5c", fontFamily: "'DM Mono', monospace" }}>Powered by Anthropic Claude</div>
          </div>
        </div>
        <p style={{ fontSize: "0.88rem", color: "#3d5c40", fontFamily: "'Lora', serif", lineHeight: 1.6, margin: 0 }}>Preliminary assessment only — not an official determination. Always verify with Kauai County Planning Division.</p>
      </div>
      {status === "idle" && <button onClick={runReview} style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #2d6a3f, #4a7c59)", color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 700, fontFamily: "'DM Mono', monospace", cursor: "pointer", boxShadow: "0 4px 16px rgba(45,106,63,0.3)" }}>✦ Run AI Permit Review</button>}
      {status === "loading" && <div style={{ textAlign: "center", padding: "3rem 1rem" }}><div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌿</div><div style={{ fontFamily: "'Lora', serif", color: "#4a7c59" }}>Analyzing your application...</div><div style={{ fontFamily: "'DM Mono', monospace", color: "#7aab82", fontSize: "0.78rem", marginTop: "0.5rem" }}>This usually takes 10–20 seconds</div></div>}
      {status === "error" && <div style={{ background: "#fff5f5", border: "1.5px solid #f5c6c6", borderRadius: 8, padding: "1.2rem", color: "#8b2020" }}>Connection error. Please try again.<button onClick={runReview} style={{ marginTop: "0.75rem", display: "block", padding: "0.5rem 1.2rem", background: "#c0392b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Retry</button></div>}
      {status === "done" && result && (
        <div>
          <div style={{ background: "#fff", border: "1.5px solid #b5d9b8", borderRadius: 12, padding: "1.5rem" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#1a3320", fontWeight: 700, marginBottom: "1rem" }}>📋 AI Review Results</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "0.92rem", color: "#2a3d2c", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{result}</div>
          </div>
          <div style={{ background: "#fffbea", border: "1.5px solid #f0dc82", borderRadius: 8, padding: "1rem", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.82rem", color: "#5c4f10", fontFamily: "'Lora', serif", margin: 0 }}>⚠ This is informational only. Always confirm with Kauai County Planning Division at (808) 241-4050.</p>
          </div>
          <button onClick={() => { setStatus("idle"); setResult(null); }} style={{ marginTop: "1rem", width: "100%", padding: "0.7rem", background: "transparent", color: "#4a7c59", border: "1.5px solid #4a7c59", borderRadius: 8, fontFamily: "'DM Mono', monospace", cursor: "pointer" }}>↺ Run New Review</button>
        </div>
      )}
    </div>
  );
}

export default function KauaiPermitPrescreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const canProceed = () => {
    if (step === 0) return form.firstName && form.lastName && form.email;
    if (step === 1) return form.address && form.district && form.zone;
    if (step === 2) return form.permitType && form.projectDescription;
    if (step === 3) return form.inSMA && form.inFloodZone && form.historicProperty && form.nearStream;
    return true;
  };

  const steps = [
    <div key={0}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a3320", marginBottom: "0.3rem" }}>Applicant Information</h2>
      <p style={{ color: "#5a7a5c", fontSize: "0.88rem", fontFamily: "'Lora', serif", marginBottom: "2rem" }}>Tell us about the person applying.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.2rem" }}>
        <FieldGroup label="First Name" required><Input value={form.firstName} onChange={set("firstName")} placeholder="Kalani" /></FieldGroup>
        <FieldGroup label="Last Name" required><Input value={form.lastName} onChange={set("lastName")} placeholder="Akana" /></FieldGroup>
      </div>
      <FieldGroup label="Email Address" required><Input type="email" value={form.email} onChange={set("email")} placeholder="kalani@example.com" /></FieldGroup>
      <FieldGroup label="Phone Number"><Input type="tel" value={form.phone} onChange={set("phone")} placeholder="(808) 555-0100" /></FieldGroup>
    </div>,
    <div key={1}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a3320", marginBottom: "0.3rem" }}>Property Details</h2>
      <p style={{ color: "#5a7a5c", fontSize: "0.88rem", fontFamily: "'Lora', serif", marginBottom: "2rem" }}>Information about the subject property.</p>
      <FieldGroup label="Property Address" required><Input value={form.address} onChange={set("address")} placeholder="4444 Rice St, Lihue, HI 96766" /></FieldGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.2rem" }}>
        <FieldGroup label="Tax Map Key (TMK)"><Input value={form.tmk} onChange={set("tmk")} placeholder="e.g. 3-5-003:001" /></FieldGroup>
        <FieldGroup label="District" required><Select value={form.district} onChange={set("district")} options={DISTRICTS} placeholder="Select district..." /></FieldGroup>
      </div>
      <FieldGroup label="Zoning Classification" required><Select value={form.zone} onChange={set("zone")} options={ZONES} placeholder="Select zoning..." /></FieldGroup>
    </div>,
    <div key={2}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a3320", marginBottom: "0.3rem" }}>Project Scope</h2>
      <p style={{ color: "#5a7a5c", fontSize: "0.88rem", fontFamily: "'Lora', serif", marginBottom: "2rem" }}>Describe what you intend to build.</p>
      <FieldGroup label="Permit Type Requested" required><Select value={form.permitType} onChange={set("permitType")} options={PERMIT_TYPES} placeholder="Select permit type..." /></FieldGroup>
      <FieldGroup label="Project Description" required><Textarea value={form.projectDescription} onChange={set("projectDescription")} placeholder="Describe your project in detail..." rows={5} /></FieldGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 1rem" }}>
        <FieldGroup label="Floor Area (sq ft)"><Input type="number" value={form.sqft} onChange={set("sqft")} placeholder="1200" /></FieldGroup>
        <FieldGroup label="Stories"><Input type="number" value={form.stories} onChange={set("stories")} placeholder="2" /></FieldGroup>
        <FieldGroup label="Est. Cost ($)"><Input type="number" value={form.estimatedCost} onChange={set("estimatedCost")} placeholder="150000" /></FieldGroup>
      </div>
    </div>,
    <div key={3}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a3320", marginBottom: "0.3rem" }}>Site Conditions</h2>
      <p style={{ color: "#5a7a5c", fontSize: "0.88rem", fontFamily: "'Lora', serif", marginBottom: "2rem" }}>Answer yes/no about your property.</p>
      <FieldGroup label="Is the property within the Special Management Area (SMA)?" required><RadioGroup value={form.inSMA} onChange={set("inSMA")} name="inSMA" /></FieldGroup>
      <FieldGroup label="Is the property in a FEMA Flood Zone?" required><RadioGroup value={form.inFloodZone} onChange={set("inFloodZone")} name="inFloodZone" /></FieldGroup>
      <FieldGroup label="Is the property on a historic register?" required><RadioGroup value={form.historicProperty} onChange={set("historicProperty")} name="historicProperty" /></FieldGroup>
      <FieldGroup label="Is the property within 50 feet of a stream or waterway?" required><RadioGroup value={form.nearStream} onChange={set("nearStream")} name="nearStream" /></FieldGroup>
      <FieldGroup label="Additional Information"><Textarea value={form.additionalInfo} onChange={set("additionalInfo")} placeholder="Any other details..." rows={3} /></FieldGroup>
    </div>,
    <div key={4}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a3320", marginBottom: "0.3rem" }}>AI Permit Review</h2>
      <p style={{ color: "#5a7a5c", fontSize: "0.88rem", fontFamily: "'Lora', serif", marginBottom: "2rem" }}>Click below to get your preliminary review.</p>
      <AIReviewPanel form={form} />
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f9f1, #e8f4e8, #f4f9f0)", fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;600&family=DM+Mono:wght@400;700&display=swap'); * { box-sizing: border-box; } body { margin: 0; }`}</style>
      <div style={{ background: "linear-gradient(135deg, #1a3320, #2d4a30)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: "2.5rem" }}>🌺</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#f0f9f1", fontWeight: 700 }}>County of Kauaʻi</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#7aab82", letterSpacing: "0.12em", textTransform: "uppercase" }}>Permit Pre-Screen Program</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#5a8a62", textAlign: "right" }}>
          <div>Planning Division</div>
          <div style={{ color: "#7aab82" }}>(808) 241-4050</div>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "2.5rem auto", padding: "0 1.5rem 4rem" }}>
        <StepIndicator current={step} total={STEP_TITLES.length} />
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #c8dfc7", padding: "2.5rem 2.5rem 2rem", boxShadow: "0 4px 30px rgba(45,74,48,0.08)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#7aab82", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step]}</div>
          {steps[step]}
          {step < 4 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e8f0e8" }}>
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ padding: "0.7rem 1.5rem", background: "transparent", color: step === 0 ? "#b5d9b8" : "#4a7c59", border: "1.5px solid " + (step === 0 ? "#ddeedd" : "#4a7c59"), borderRadius: 7, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", cursor: step === 0 ? "default" : "pointer" }}>← Back</button>
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} style={{ padding: "0.7rem 2rem", background: canProceed() ? "linear-gradient(135deg, #2d6a3f, #4a7c59)" : "#ddeedd", color: canProceed() ? "#fff" : "#8ab88c", border: "none", borderRadius: 7, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", cursor: canProceed() ? "pointer" : "default", fontWeight: 700 }}>{step === 3 ? "Submit for Review →" : "Continue →"}</button>
            </div>
          )}
        </div>
        <p style={{ textAlign: "center", color: "#8aab8c", fontSize: "0.78rem", fontFamily: "'DM Mono', monospace", marginTop: "1.5rem" }}>This tool does not submit a formal permit application · For official submissions visit kauai.gov</p>
      </div>
    </div>
  );
}
