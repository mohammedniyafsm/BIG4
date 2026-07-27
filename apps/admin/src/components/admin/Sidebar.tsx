"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PromptModal } from "@/components/prompts/PromptModal";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/products", label: "Products", icon: ProductIcon },
    { href: "/admin/brands", label: "Brands", icon: BrandIcon },
    { href: "/admin/categories", label: "Categories", icon: CategoryIcon },
    { href: "/admin/offers", label: "Offers", icon: OfferIcon },
    { href: "/admin/change-password", label: "Change Password", icon: KeyIcon },
];

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [promptCategory, setPromptCategory] = useState<string | null>(null);
    const [promptExpanded, setPromptExpanded] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { Origin: window.location.origin },
                credentials: "include",
            });
            router.push("/login");
            router.refresh();
        } catch {
            setLoggingOut(false);
        }
    };

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
                        background: "var(--overlay-heavy)",
                        zIndex: 39,
                    }}
                />
            )}

            <aside className="admin-sidebar"
                style={{
                    width: "var(--sidebar-width)",
                    background: "var(--bg-card)",
                    borderRight: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    zIndex: 40,
                    overflowY: "auto",
                    transform: isVisible ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 250ms ease",
                }}
            >
                {/* Brand Logo Header */}
                <div style={{ height: 64, minHeight: 64, maxHeight: 64, padding: "0 20px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--border-default)", boxSizing: "border-box", flexShrink: 0 }}>
                    <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src="/logo2.png"
                            alt="Big4 Logo"
                            className="light-logo"
                            style={{ height: 28, width: "auto", objectFit: "contain" }}
                        />
                        <img
                            src="/logo3.png"
                            alt="Big4 Logo"
                            className="dark-logo"
                            style={{ height: 32, width: "auto", objectFit: "contain" }}
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ padding: "12px 8px", flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.2, padding: "8px 12px", marginBottom: 4 }}>
                        Menu
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true}
                                onClick={isMobile ? onClose : undefined}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 12px",
                                    borderRadius: "var(--radius-md)",
                                    color: isActive ? "var(--hero-text)" : "var(--text-secondary)",
                                    background: isActive ? "var(--hero-bg)" : "transparent",
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 500,
                                    marginBottom: 2,
                                    transition: "var(--transition-fast)",
                                }}
                            >
                                <item.icon active={isActive} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Prompt Area Accordion */}
                <div style={{ padding: "0 8px 12px", flexShrink: 0 }}>
                    <button
                        onClick={() => setPromptExpanded(!promptExpanded)}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            borderRadius: "var(--radius-md)",
                            transition: "var(--transition-fast)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = "var(--text-muted)";
                        }}
                    >
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
                            Prompts
                        </span>
                        <ChevronIcon expanded={promptExpanded} />
                    </button>
                    
                    {promptExpanded && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "4px 0 0 12px" }}>
                            {[
                                { id: "bedroom", label: "Bedroom", icon: BedDoubleIcon },
                                { id: "office", label: "Office", icon: BriefcaseIcon },
                                { id: "bathroom", label: "Bathroom", icon: BathIcon },
                                { id: "kitchen", label: "Kitchen", icon: ChefHatIcon }
                            ].map((btn) => {
                                const isActive = promptCategory === btn.id;
                                return (
                                    <button
                                        key={btn.id}
                                        onClick={() => setPromptCategory(btn.id)}
                                        aria-label={`Open ${btn.label} prompt`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: "8px 12px",
                                            borderRadius: "var(--radius-md)",
                                            background: isActive ? "var(--hero-bg)" : "transparent",
                                            color: isActive ? "var(--hero-text)" : "var(--text-secondary)",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 500,
                                            transition: "var(--transition-fast)",
                                            outlineOffset: 2,
                                            textAlign: "left",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = "var(--bg-hover)";
                                                e.currentTarget.style.color = "var(--text-primary)";
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "var(--text-secondary)";
                                            }
                                        }}
                                    >
                                        <btn.icon active={isActive} />
                                        {btn.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px",
                        borderTop: "1px solid var(--border-default)",
                    }}
                >
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "10px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--danger)",
                            background: "transparent",
                            border: "1px solid var(--border-strong)",
                            borderRadius: "var(--radius-md)",
                            cursor: loggingOut ? "not-allowed" : "pointer",
                            opacity: loggingOut ? 0.6 : 1,
                            transition: "all var(--transition-fast)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "var(--bg-hover)";
                            e.currentTarget.style.borderColor = "var(--danger)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "var(--border-strong)";
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            <PromptModal
                category={promptCategory}
                onClose={() => setPromptCategory(null)}
            />
        </>
    );
}

// ─── Icons ──────────────────────────────────────────────

function DashboardIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function ProductIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function CategoryIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function OfferIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
            <path d="M11 11h2v2h-2z" />
        </svg>
    );
}

function BrandIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );
}

function KeyIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 2-2 2m-1.5 1.5L16 7v2h2v2h2v2h2v-2l1.5-1.5M15 2 7.5 9.5a5 5 0 1 0 7 7L22 9V2h-7z" />
            <circle cx="7.5" cy="16.5" r="1.5" />
        </svg>
    );
}

function BedDoubleIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
            <path d="M12 4v6" />
            <path d="M2 18h20" />
        </svg>
    );
}

function BriefcaseIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function BathIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <line x1="10" y1="5" x2="8" y2="7" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="7" y1="19" x2="7" y2="21" />
            <line x1="17" y1="19" x2="17" y2="21" />
        </svg>
    );
}

function ChefHatIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
    );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}
