"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";

interface AdminShellProps {
    children: React.ReactNode;
    userEmail: string;
    userName: string;
}

/**
 * Client-side admin shell — manages mobile sidebar toggle state.
 * Uses window resize to toggle between desktop sidebar and mobile drawer.
 */
export function AdminShell({ children, userEmail, userName }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isMobile={isMobile}
            />

            <div
                style={{
                    flex: 1,
                    marginLeft: isMobile ? 0 : 260,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    transition: "margin-left 250ms ease",
                }}
            >
                <Header
                    userEmail={userEmail}
                    userName={userName}
                    onMenuClick={() => setSidebarOpen(true)}
                    showMenuButton={isMobile}
                />

                <main
                    style={{
                        flex: 1,
                        padding: isMobile ? 16 : 24,
                        maxWidth: 1400,
                        width: "100%",
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
