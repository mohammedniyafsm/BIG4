"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { forgotPasswordSchema } from "@/validations/auth.validation";

/**
 * /forgot-password — Admin forgot password page.
 *
 * Calls POST /api/auth/forgot-password to trigger a reset email via Nodemailer.
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setErrors({});

        const parsed = forgotPasswordSchema.safeParse({ email });
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
            document.getElementById("email")?.focus();
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({ email: parsed.data.email }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Failed to process request. Please try again.");
                setLoading(false);
                return;
            }

            setSuccessMessage(
                data.message ||
                    "If an account exists with that email, a password reset link has been sent."
            );
            setLoading(false);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

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
                            width: 140,
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                            margin: "0 auto 16px auto",
                        }}
                    />
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Forgot Password?
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.4 }}>
                        Enter your registered email address and we&apos;ll send you instructions to reset your password.
                    </p>
                </div>

                {/* Error Alert */}
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

                {/* Success Alert */}
                {successMessage ? (
                    <div>
                        <div
                            style={{
                                padding: "14px 16px",
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
                                width="28"
                                height="28"
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
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 24 }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    marginBottom: 6,
                                }}
                            >
                                Admin Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@big4.com"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    border: `1px solid ${errors.email ? "var(--danger)" : "var(--border-default)"}`,
                                    borderRadius: "var(--radius-md)",
                                    fontSize: 14,
                                    outline: "none",
                                    transition: "var(--transition-fast)",
                                    background: "var(--bg-input)",
                                    color: "var(--text-primary)",
                                }}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && (
                                <span
                                    id="email-error"
                                    style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}
                                >
                                    {errors.email[0]}
                                </span>
                            )}
                        </div>

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            style={{ width: "100%", marginBottom: 16 }}
                        >
                            Send Reset Instructions
                        </LoadingButton>

                        <div style={{ textAlign: "center" }}>
                            <Link
                                href="/login"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--text-secondary)",
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
