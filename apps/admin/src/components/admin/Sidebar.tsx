"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/products", label: "Products", icon: ProductIcon },
    { href: "/admin/brands", label: "Brands", icon: BrandIcon },
    { href: "/admin/categories", label: "Categories", icon: CategoryIcon },
];

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
    const pathname = usePathname();

    // On desktop, sidebar is always visible. On mobile, it's a drawer.
    const isVisible = !isMobile || open;

    return (
        <>
            {/* Overlay for mobile */}
            {isMobile && open && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        zIndex: 39,
                    }}
                />
            )}

            <aside
                style={{
                    width: 260,
                    minHeight: "100vh",
                    background: "#111827",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 40,
                    overflowY: "auto",
                    transform: isVisible ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 250ms ease",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: "24px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }} onClick={isMobile ? onClose : undefined}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "var(--radius-md)",
                                    background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 16,
                                }}
                            >
                                B4
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>
                                    Big4 Admin
                                </div>
                                <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 1 }}>
                                    Tiles & Sanitary
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ padding: "12px 8px", flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: 1.2, padding: "8px 12px", marginBottom: 4 }}>
                        Menu
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={isMobile ? onClose : undefined}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 12px",
                                    borderRadius: "var(--radius-md)",
                                    color: isActive ? "var(--text-inverse)" : "var(--gray-400)",
                                    background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                    marginBottom: 2,
                                    transition: "var(--transition-fast)",
                                }}
                            >
                                <item.icon active={isActive} />
                                {item.label}
                                {isActive && (
                                    <div
                                        style={{
                                            width: 3,
                                            height: 20,
                                            borderRadius: 2,
                                            background: "var(--brand-500)",
                                            marginLeft: "auto",
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        fontSize: 11,
                        color: "var(--gray-500)",
                    }}
                >
                    © 2024 Big4 Admin
                </div>
            </aside>
        </>
    );
}

// ─── Icons ──────────────────────────────────────────────

function DashboardIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function ProductIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function CategoryIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function BrandIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );
}
