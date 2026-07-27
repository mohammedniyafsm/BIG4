"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { resetPasswordSchema } from "@/validations/auth.validation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Password criteria checklist
    const criteria = [
        { label: "At least 8 characters", met: newPassword.length >= 8 },
        { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(newPassword) },
        { label: "One lowercase letter (a-z)", met: /[a-z]/.test(newPassword) },
        { label: "One number (0-9)", met: /[0-9]/.test(newPassword) },
        { label: "One special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(newPassword) },
    ];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setErrors({});

        if (!token) {
            setError("Missing reset token. Please check the reset link sent to your email.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const parsed = resetPasswordSchema.safeParse({ token, newPassword });
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({
                    token: parsed.data.token,
                    newPassword: parsed.data.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Invalid or expired reset token.");
                setLoading(false);
                return;
            }

            setSuccessMessage(data.message || "Password reset successfully! You can now log in with your new password.");
            setLoading(false);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (!token && !successMessage) {
        return (
            <div>
                <div
                    style={{
                        padding: "16px",
                        background: "var(--danger-soft)",
                        border: "1px solid var(--danger)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--danger)",
                        fontSize: 14,
                        lineHeight: 1.5,
                        marginBottom: 24,
                        textAlign: "center",
                    }}
                >
                    Invalid or missing reset token. Please request a new password reset link.
                </div>

                <Link
                    href="/forgot-password"
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 16px",
                        background: "var(--hero-bg, #2563eb)",
                        color: "var(--hero-text, #ffffff)",
                        borderRadius: "var(--radius-md)",
                        textDecoration: "none",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                    }}
                >
                    Request New Reset Link
                </Link>
            </div>
        );
    }

    if (successMessage) {
        return (
            <div>
                <div
                    style={{
                        padding: "16px",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "var(--radius-md)",
                        color: "#10b981",
                        fontSize: 14,
                        lineHeight: 1.5,
                        marginBottom: 24,
                        textAlign: "center",
                    }}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ display: "block", margin: "0 auto 8px auto" }}
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {successMessage}
                </div>

                <Link
                    href="/login"
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 16px",
                        background: "var(--hero-bg, #2563eb)",
                        color: "var(--hero-text, #ffffff)",
                        borderRadius: "var(--radius-md)",
                        textDecoration: "none",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                    }}
                >
                    Proceed to Sign In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Error Banner */}
            {error && (
                <div
                    style={{
                        padding: "10px 14px",
                        background: "var(--danger-soft)",
                        border: "1px solid var(--danger)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--danger)",
                        fontSize: 13,
                        marginBottom: 20,
                    }}
                >
                    {error}
                </div>
            )}

            {/* New Password */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label
                        htmlFor="newPassword"
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                        }}
                    >
                        New Password
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                        }}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1px solid ${errors.newPassword ? "var(--danger)" : "var(--border-default)"}`,
                        borderRadius: "var(--radius-md)",
                        fontSize: 14,
                        outline: "none",
                        transition: "var(--transition-fast)",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                    }}
                />
                {errors.newPassword && (
                    <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>
                        {errors.newPassword[0]}
                    </span>
                )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 20 }}>
                <label
                    htmlFor="confirmPassword"
                    style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 6,
                    }}
                >
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1px solid ${newPassword && confirmPassword && newPassword !== confirmPassword ? "var(--danger)" : "var(--border-default)"}`,
                        borderRadius: "var(--radius-md)",
                        fontSize: 14,
                        outline: "none",
                        transition: "var(--transition-fast)",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                    }}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>
                        Passwords do not match
                    </span>
                )}
            </div>

            {/* Criteria Checklist */}
            <div
                style={{
                    padding: "12px",
                    background: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    marginBottom: 24,
                }}
            >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                    Password Requirements:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {criteria.map((c, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12,
                                color: c.met ? "#10b981" : "var(--text-muted)",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                {c.met ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="10" />}
                            </svg>
                            {c.label}
                        </div>
                    ))}
                </div>
            </div>

            <LoadingButton
                type="submit"
                loading={loading}
                style={{ width: "100%", marginBottom: 16 }}
            >
                Reset Password
            </LoadingButton>

            <div style={{ textAlign: "center" }}>
                <Link
                    href="/login"
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                    }}
                >
                    Back to Sign In
                </Link>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-canvas)",
                padding: 16,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 400,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-xl)",
                    boxShadow: "var(--shadow-drawer)",
                    padding: 32,
                }}
            >
                {/* Branding */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <img
                        src="/logo2.png"
                        alt="Big4 Logo"
                        className="light-logo"
                        style={{
                            width: 140,
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto 16px auto",
                        }}
                    />
                    <img
                        src="/logo3.png"
                        alt="Big4 Logo"
                        className="dark-logo"
                        style={{
                            width: 150,
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto 16px auto",
                        }}
                    />
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Set New Password
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
                        Create a strong password for your admin account.
                    </p>
                </div>

                <Suspense fallback={<div style={{ textAlign: "center", padding: 20, color: "var(--text-secondary)" }}>Loading reset form...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
