"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", backgroundColor: "#000000", color: "#ffffff", fontFamily: "sans-serif", margin: 0 }}>
        <div style={{ maxWidth: "420px", width: "100%" }}>
          <h1 style={{ fontSize: "6rem", fontWeight: 900, color: "#333333", margin: "0 0 8px", lineHeight: 1 }}>500</h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px", color: "#ffffff" }}>Something Went Wrong</h2>
          <p style={{ fontSize: "0.875rem", color: "#888888", marginBottom: "32px", lineHeight: 1.5 }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 32px", borderRadius: "9999px", background: "#ffffff", color: "#000000", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
