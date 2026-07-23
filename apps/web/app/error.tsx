"use client";

import React from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", backgroundColor: "#ffffff", color: "#000000", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <h1 style={{ fontSize: "6rem", fontWeight: 900, color: "#e5e5e5", margin: "0 0 8px", lineHeight: 1 }}>500</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px", color: "#111111" }}>Something went wrong</h2>
        <p style={{ fontSize: "0.875rem", color: "#666666", marginBottom: "32px", lineHeight: 1.5 }}>
          An unexpected error occurred while loading this page.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 28px", borderRadius: "9999px", background: "#000000", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 28px", borderRadius: "9999px", background: "transparent", color: "#000000", border: "1px solid #cccccc", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}
          >
            Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
