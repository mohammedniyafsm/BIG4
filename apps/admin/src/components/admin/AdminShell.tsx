"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { BottomNav } from "@/components/admin/BottomNav";

interface AdminShellProps {
    children: React.ReactNode;
    userEmail: string;
    userName: string;
}

/**
 * Client-side admin shell — manages mobile sidebar toggle state and desktop layout.
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
        <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
            {/* Sidebar on left */}
            <Sidebar
                open={isMobile ? sidebarOpen : true}
                onClose={() => setSidebarOpen(false)}
                isMobile={isMobile}
            />

            {/* Right main area: Header on top, main content below */}
            <div className="admin-main-content" style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto" }}>
                <Header
                    userEmail={userEmail}
                    userName={userName}
                    showMenuButton={isMobile}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main
                    style={{
                        flex: 1,
                        padding: isMobile ? "16px 16px calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 16px)" : 24,
                        maxWidth: 1400,
                        width: "100%",
                        margin: "0 auto",
                    }}
                >
                    {children}
                </main>

                {isMobile && <BottomNav userEmail={userEmail} userName={userName} />}
            </div>
        </div>
    );
}
