"use client";

import { useState } from "react";
import { ThemeSelector } from "@/components/ThemeSelector";

interface HeaderProps {
    userEmail: string;
    userName: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function Header({ userEmail, userName, onMenuClick, showMenuButton }: HeaderProps) {
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="admin-header"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                height: 64,
                minHeight: 64,
                maxHeight: 64,
                padding: "0 24px",
                borderBottom: "1px solid var(--border-default)",
                background: "var(--bg-card)",
                boxSizing: "border-box",
            }}
        >
            {/* Left Side: Mobile Menu Button */}
            {showMenuButton && (
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
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User Info & Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* User Info */}
                <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                            {userName}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                            {userEmail}
                        </div>
                    </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="hide-on-mobile">
                        <ThemeSelector />
                    </div>
                    
                    <img
                        src="/logo1.png"
                        alt="Admin Logo"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid var(--border-default)",
                        }}
                    />

                </div>
            </div>
        </header>
    );
}
