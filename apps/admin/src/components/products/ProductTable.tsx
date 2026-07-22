"use client";

import Link from "next/link";
import type { ProductListItem } from "@/types/admin.types";

interface ProductTableProps {
    products: ProductListItem[];
    onStockClick: (product: ProductListItem) => void;
    onDeleteClick: (product: ProductListItem) => void;
    onFeatureToggle: (product: ProductListItem) => void;
}

export function ProductTable({ products, onStockClick, onDeleteClick, onFeatureToggle }: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="saas-card" style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>No products found</div>
                <div style={{ marginTop: 4, color: "var(--text-secondary)", fontSize: 14 }}>Try adjusting your search or filters</div>
            </div>
        );
    }

    return (
        <div className="saas-card saas-table-container" style={{ padding: 0, overflow: "hidden" }}>
            <div className="hide-on-mobile" style={{ overflowX: "auto" }}>
                <table className="saas-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th style={{ textAlign: "right" }}>Price</th>
                            <th style={{ textAlign: "center" }}>Stock</th>
                            <th style={{ textAlign: "center" }}>Status</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "var(--radius-sm)",
                                                background: "var(--skeleton-base)",
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
                                                <span style={{ fontSize: 20, color: "var(--text-muted)" }}>📷</span>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>
                                                {product.name}
                                                {product.featured && <span style={{ color: "var(--warning)", marginLeft: 6 }} title="Featured on homepage">★</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                                    {product.sku}
                                </td>

                                <td>
                                    <span className="badge badge-category">
                                        {product.categoryName}
                                    </span>
                                </td>

                                <td>
                                    {product.brandName ? (
                                        <span className="badge badge-category">
                                            {product.brandName}
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
                                    )}
                                </td>

                                <td style={{ textAlign: "right", fontWeight: 600, color: "var(--text-primary)" }}>
                                    ₹{product.price.toLocaleString("en-IN")}
                                </td>

                                <td style={{ textAlign: "center" }}>
                                    <button
                                        onClick={() => onStockClick(product)}
                                        className={`badge ${product.stock <= 5 ? "badge-danger" : "badge-success"}`}
                                        style={{
                                            border: "none",
                                            cursor: "pointer",
                                            gap: 4,
                                            padding: "6px 12px"
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

                                <td style={{ textAlign: "center" }}>
                                    <span className={`badge ${product.isActive ? "badge-active" : "badge-archived"}`}>
                                        {product.isActive ? "Active" : "Archived"}
                                    </span>
                                </td>

                                <td>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <button
                                            onClick={() => onFeatureToggle(product)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "var(--radius-pill)",
                                                border: "1px solid var(--border-default)",
                                                background: "var(--bg-canvas)",
                                                color: product.featured ? "var(--warning)" : "var(--text-secondary)",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                            title={product.featured ? "Remove from featured" : "Feature on homepage"}
                                        >
                                            {product.featured ? "Unfeature" : "Feature"}
                                        </button>
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            style={{
                                                padding: "6px 16px",
                                                borderRadius: "var(--radius-pill)",
                                                border: "1px solid var(--border-default)",
                                                background: "var(--bg-card)",
                                                color: "var(--text-primary)",
                                                textDecoration: "none",
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => onDeleteClick(product)}
                                            style={{
                                                padding: "6px 16px",
                                                borderRadius: "var(--radius-pill)",
                                                border: "1px solid var(--danger-soft)",
                                                background: "var(--danger-soft)",
                                                color: "var(--danger)",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: "pointer",
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

            {/* Mobile Cards */}
            <div className="mobile-only">
                {products.map((product, i) => (
                    <div key={product.id} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderTop: i > 0 ? "1px solid var(--border-default)" : "none" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: "var(--skeleton-base)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span style={{ fontSize: 20, color: "var(--text-muted)" }}>📷</span>
                                )}
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>
                                        {product.name}
                                        {product.featured && <span style={{ color: "var(--warning)", marginLeft: 4 }} title="Featured on homepage">★</span>}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>₹{product.price.toLocaleString("en-IN")}</div>
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{product.sku}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                            <span className="badge badge-category">{product.categoryName}</span>
                            <button onClick={() => onStockClick(product)} className={`badge ${product.stock <= 5 ? "badge-danger" : "badge-success"}`} style={{ border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                {product.stock} in stock
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <span className={`badge ${product.isActive ? "badge-active" : "badge-archived"}`}>{product.isActive ? "Active" : "Archived"}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button onClick={() => onFeatureToggle(product)} style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-default)", background: "var(--bg-canvas)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: product.featured ? "var(--warning)" : "var(--text-secondary)" }}>{product.featured ? "Unfeature" : "Feature"}</button>
                            <Link href={`/admin/products/${product.id}`} style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-default)", background: "var(--bg-card)", fontSize: 13, fontWeight: 600, textDecoration: "none", color: "var(--text-primary)" }}>Edit</Link>
                            <button onClick={() => onDeleteClick(product)} style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-pill)", border: "1px solid var(--danger-soft)", color: "var(--danger)", background: "var(--danger-soft)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
