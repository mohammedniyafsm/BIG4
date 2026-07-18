import type { Metadata } from "next";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";

export const metadata: Metadata = {
    title: "Dashboard — Big4 Admin",
    description: "Big4 Tiles & Sanitary admin dashboard",
};

/**
 * /admin — Dashboard page with live statistics.
 */
export default async function DashboardPage() {
    const stats = await dashboardService.getStats();

    const cards = [
        { label: "Total Products", value: stats.totalProducts, color: "#2563eb", icon: "📦", href: "/admin/products" },
        { label: "Active Products", value: stats.activeProducts, color: "#16a34a", icon: "✅", href: "/admin/products?status=active" },
        { label: "Low Stock", value: stats.lowStockProducts, color: stats.lowStockProducts > 0 ? "#f59e0b" : "#16a34a", icon: "⚠️", href: "/admin/products?sort=stock-asc" },
        { label: "Categories", value: stats.totalCategories, color: "#8b5cf6", icon: "📂", href: "/admin/categories" },
        { label: "Brands", value: stats.totalBrands, color: "#ec4899", icon: "🏷️", href: "/admin/brands" },
    ];

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                Dashboard
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
                Welcome to the Big4 Admin Panel
            </p>

            {/* Stat Cards */}
            <div className="dashboard-cards">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        style={{
                            textDecoration: "none",
                            display: "block",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 12,
                            padding: 20,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            transition: "all 200ms ease",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6b7280",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {card.label}
                            </div>
                            <span style={{ fontSize: 20 }}>{card.icon}</span>
                        </div>
                        <div
                            style={{
                                fontSize: 36,
                                fontWeight: 800,
                                color: card.color,
                                marginTop: 8,
                            }}
                        >
                            {card.value}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-bottom">
                {/* Recent Products */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 20,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#111827" }}>
                            Recent Products
                        </h2>
                        <Link
                            href="/admin/products"
                            style={{
                                fontSize: 13,
                                color: "#2563eb",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            View all →
                        </Link>
                    </div>

                    {stats.recentProducts.length === 0 ? (
                        <div style={{ padding: "20px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                            No products yet.{" "}
                            <Link href="/admin/products/new" style={{ color: "#2563eb" }}>
                                Add your first product
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {stats.recentProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        borderBottom: "1px solid #f3f4f6",
                                        textDecoration: "none",
                                        color: "#111827",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                            {product.category.name}
                                            {product.brand?.name ? ` · ${product.brand.name}` : ""}
                                            {" · "}
                                            {product.sku}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: product.stock <= 5 ? "#ef4444" : "#16a34a",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Stock: {product.stock}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions Panel */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 20,
                    }}
                >
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Add New Product", href: "/admin/products/new", icon: "➕", desc: "Create a new product entry" },
                            { label: "Manage Categories", href: "/admin/categories", icon: "📂", desc: "Add, rename, or delete categories" },
                            { label: "Manage Brands", href: "/admin/brands", icon: "🏷️", desc: "Add, rename, or delete brands" },
                            { label: "View Low Stock", href: "/admin/products?sort=stock-asc", icon: "⚠️", desc: "Products with stock ≤ 5" },
                            { label: "Archived Products", href: "/admin/products?status=archived", icon: "📁", desc: "View and restore archived items" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #f3f4f6",
                                    textDecoration: "none",
                                    color: "#111827",
                                    transition: "all 150ms ease",
                                    background: "#fafafa",
                                }}
                            >
                                <span style={{ fontSize: 22 }}>{action.icon}</span>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{action.label}</div>
                                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{action.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
