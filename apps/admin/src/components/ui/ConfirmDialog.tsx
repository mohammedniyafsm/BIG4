"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { LoadingButton } from "./LoadingButton";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "primary";
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    if (!open) return null;

    return (
        <dialog
            ref={dialogRef}
            onClose={onCancel}
            style={{
                position: "fixed",
                inset: 0,
                border: "none",
                background: "transparent",
                padding: 0,
                maxWidth: "none",
                maxHeight: "none",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
            onClick={(e) => {
                if (e.target === dialogRef.current) onCancel();
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    animation: "fade-in 200ms ease",
                }}
            />

            {/* Dialog Box */}
            <div
                style={{
                    position: "relative",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-lg)",
                    padding: 24,
                    width: "100%",
                    maxWidth: 420,
                    boxShadow: "var(--shadow-lg)",
                    animation: "slide-up 250ms ease",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                    }}
                >
                    {title}
                </h3>
                <p
                    style={{
                        margin: "12px 0 24px",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                    }}
                >
                    {message}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <LoadingButton variant="secondary" onClick={onCancel}>
                        {cancelLabel}
                    </LoadingButton>
                    <LoadingButton variant={variant} loading={loading} onClick={onConfirm}>
                        {confirmLabel}
                    </LoadingButton>
                </div>
            </div>
        </dialog>
    );
}
