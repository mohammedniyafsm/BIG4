"use client";

import React from "react";

export default function ProductNotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", backgroundColor: "#ffffff", color: "#000000", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <h1 style={{ fontSize: "6rem", fontWeight: 900, color: "#e5e5e5", margin: "0 0 8px", lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px", color: "#111111" }}>Product Not Found</h2>
        <p style={{ fontSize: "0.875rem", color: "#666666", marginBottom: "32px", lineHeight: 1.5 }}>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/products"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 32px", borderRadius: "9999px", background: "#000000", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}
        >
          Browse All Products
        </a>
      </div>
    </div>
  );
}
