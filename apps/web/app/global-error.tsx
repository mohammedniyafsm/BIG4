"use client";

import React from "react";

export const dynamic = "force-dynamic";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#ffffff", color: "#000000", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px" }}>Something went wrong!</h2>
          <button
            onClick={() => reset()}
            style={{ padding: "12px 24px", borderRadius: "9999px", background: "#000000", color: "#ffffff", border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
