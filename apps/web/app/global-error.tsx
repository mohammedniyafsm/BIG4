"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif", backgroundColor: "#ffffff", color: "#000000" }}>
        <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: "5rem", fontWeight: 900, color: "#e5e5e5", margin: "0 0 8px" }}>500</h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px" }}>Something Went Wrong</h2>
          <p style={{ fontSize: "0.875rem", color: "#666666", marginBottom: "24px" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: "12px 24px", borderRadius: "9999px", background: "#000000", color: "#ffffff", border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
