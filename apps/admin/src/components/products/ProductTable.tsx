"use client";

import Link from "next/link";
import type { ProductListItem } from "@/types/admin.types";

interface ProductTableProps {
    products: ProductListItem[];
    onStockClick: (product: ProductListItem) => void;
    onDeleteClick: (product: ProductListItem) => void;
}

/**
 * Product data table for the listing page.
 * Shows image, name, SKU, category, brand, price, stock, status, actions.
 */
export function ProductTable({ products, onStockClick, onDeleteClick }: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#6b7280",
                    fontSize: 14,
                    background: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                }}
            >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#374151" }}>No products found</div>
                <div style={{ marginTop: 4 }}>Try adjusting your search or filters</div>
            </div>
        );
    }

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
            }}
        >
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 14,
                        minWidth: 850,
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderBottom: "1px solid #e5e7eb",
                                background: "#f9fafb",
                            }}
                        >
                            <th style={thStyle}>Product</th>
                            <th style={thStyle}>SKU</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Brand</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>Price</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Stock</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                style={{
                                    borderBottom: "1px solid #f3f4f6",
                                    transition: "background 150ms ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                {/* Product Name + Image */}
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                background: "#f3f4f6",
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = "none";
                                                        (e.target as HTMLImageElement).parentElement!.textContent = "📷";
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: 18, color: "#9ca3af" }}>📷</span>
                                            )}
                                        </div>
                                        <div style={{ fontWeight: 600, color: "#111827" }}>{product.name}</div>
                                    </div>
                                </td>

                                {/* SKU */}
                                <td style={tdStyle}>
                                    <code
                                        style={{
                                            fontSize: 12,
                                            background: "#f3f4f6",
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            color: "#4b5563",
                                        }}
                                    >
                                        {product.sku}
                                    </code>
                                </td>

                                {/* Category */}
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 500,
                                            background: "#eff6ff",
                                            color: "#1d4ed8",
                                            padding: "3px 10px",
                                            borderRadius: 20,
                                        }}
                                    >
                                        {product.categoryName}
                                    </span>
                                </td>

                                {/* Brand */}
                                <td style={tdStyle}>
                                    {product.brandName ? (
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background: "#f0fdf4",
                                                color: "#166534",
                                                padding: "3px 10px",
                                                borderRadius: 20,
                                            }}
                                        >
                                            {product.brandName}
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: 12, color: "#d1d5db" }}>—</span>
                                    )}
                                </td>

                                {/* Price */}
                                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>
                                    ₹{product.price.toLocaleString("en-IN")}
                                </td>

                                {/* Stock — clickable for quick update */}
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <button
                                        onClick={() => onStockClick(product)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 4,
                                            padding: "4px 12px",
                                            borderRadius: 6,
                                            border: "1px solid #e5e7eb",
                                            background: product.stock <= 5 ? "#fef2f2" : "#f0fdf4",
                                            color: product.stock <= 5 ? "#991b1b" : "#166534",
                                            fontWeight: 600,
                                            fontSize: 13,
                                            cursor: "pointer",
                                            transition: "all 150ms ease",
                                        }}
                                        title="Click to update stock"
                                    >
                                        {product.stock}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </td>

                                {/* Status Badge */}
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: "3px 10px",
                                            borderRadius: 20,
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                            ...(product.isActive
                                                ? { background: "#f0fdf4", color: "#166534" }
                                                : { background: "#f3f4f6", color: "#6b7280" }),
                                        }}
                                    >
                                        {product.isActive ? "Active" : "Archived"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            style={actionBtnStyle}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => onDeleteClick(product)}
                                            style={{
                                                ...actionBtnStyle,
                                                color: "#ef4444",
                                                borderColor: "#fecaca",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    whiteSpace: "nowrap",
};

const actionBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#374151",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 150ms ease",
};
