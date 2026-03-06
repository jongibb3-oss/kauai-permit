"use client";
import { useState } from "react";

export default function Test() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "What permits might be needed for this address in Kauai: " + address }]
        })
      });
      const data = await res.json();
      setResult(JSON.stringify(data));
    } catch (e) {
      setResult("ERROR: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Kauai Permit Test</h1>
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter address" style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }} />
      <button onClick={submit} style={{ padding: "0.5rem 1rem", background: "green", color: "white", border: "none", cursor: "pointer" }}>Submit</button>
      {loading && <p>Loading...</p>}
      {result && <pre style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem", whiteSpace: "pre-wrap" }}>{result}</pre>}
    </div>
  );
}
