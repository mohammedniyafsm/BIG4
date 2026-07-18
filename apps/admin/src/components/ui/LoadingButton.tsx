"use client";

import { type ReactNode } from "react";

interface LoadingButtonProps {
    children: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    type?: "button" | "submit";
    onClick?: () => void;
    style?: React.CSSProperties;
}

const VARIANT_STYLES = {
    primary: {
        background: "var(--brand-600)",
        color: "white",
        border: "none",
    },
    secondary: {
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
    },
    danger: {
        background: "var(--danger)",
        color: "white",
        border: "none",
    },
};

export function LoadingButton({
    children,
    loading = false,
    disabled = false,
    variant = "primary",
    type = "button",
    onClick,
    style,
}: LoadingButtonProps) {
    const isDisabled = loading || disabled;
    const variantStyle = VARIANT_STYLES[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            style={{
                ...variantStyle,
                padding: "10px 20px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: 600,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minWidth: 100,
                transition: "var(--transition-fast)",
                ...style,
            }}
        >
            {loading && <Spinner />}
            {children}
        </button>
    );
}

function Spinner() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ animation: "spin 0.8s linear infinite" }}
        >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
