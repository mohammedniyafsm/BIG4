"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";

// ─── Types ──────────────────────────────────────────────

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    exiting?: boolean;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

// ─── Context ────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

// ─── Provider ───────────────────────────────────────────

const TOAST_DURATION = 3500;
const EXIT_DURATION = 200;

const ICONS: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
    success: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
    error: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Start exit animation, then remove
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, EXIT_DURATION);
        }, TOAST_DURATION);
    }, []);

    return (
        <ToastContext value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div
                style={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    pointerEvents: "none",
                    maxWidth: 400,
                }}
            >
                {toasts.map((t) => {
                    const color = COLORS[t.type];
                    return (
                        <div
                            key={t.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "12px 16px",
                                background: color.bg,
                                borderLeft: `4px solid ${color.border}`,
                                borderRadius: "var(--radius-md)",
                                boxShadow: "var(--shadow-lg)",
                                color: color.text,
                                fontSize: 14,
                                fontWeight: 500,
                                pointerEvents: "auto",
                                animation: t.exiting
                                    ? `toast-out ${EXIT_DURATION}ms ease forwards`
                                    : `toast-in 250ms ease`,
                            }}
                        >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{ICONS[t.type]}</span>
                            <span>{t.message}</span>
                        </div>
                    );
                })}
            </div>
        </ToastContext>
    );
}
