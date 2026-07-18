"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
    userEmail: string;
    userName: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function Header({ userEmail, userName, onMenuClick, showMenuButton }: HeaderProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

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

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header
            style={{
                height: "var(--header-height)",
                background: "var(--bg-primary)",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                gap: 16,
            }}
        >
            {/* Hamburger — visible only on mobile */}
            {showMenuButton ? (
                <button
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    style={{
                        padding: 8,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        display: "flex",
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            ) : (
                <div />
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {userName}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                        {userEmail}
                    </div>
                </div>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--danger)",
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    cursor: loggingOut ? "not-allowed" : "pointer",
                    opacity: loggingOut ? 0.6 : 1,
                    transition: "var(--transition-fast)",
                }}
            >
                {loggingOut ? "Logging out…" : "Logout"}
            </button>
        </header>
    );
}
