"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { loginSchema } from "@/validations/auth.validation";

/**
 * /login — Admin login page.
 *
 * Calls the existing POST /api/auth/login endpoint.
 * On success, redirects to /admin.
 */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setErrors({});
        
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
            if (parsed.error.flatten().fieldErrors.email) {
                document.getElementById("email")?.focus();
            } else if (parsed.error.flatten().fieldErrors.password) {
                document.getElementById("password")?.focus();
            }
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Login failed");
                setLoading(false);
                return;
            }

            router.push("/admin");
            router.refresh();
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
                            width: 130,
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
                        Welcome back
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                        Sign in to the Big4 Admin Panel
                    </p>
                </div>

                {/* Error */}
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
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
                            Email
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
                        {errors.email && <span id="email-error" style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>{errors.email[0]}</span>}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <label
                                htmlFor="password"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                }}
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--accent)",
                                    textDecoration: "none",
                                    transition: "var(--transition-fast)",
                                }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                border: `1px solid ${errors.password ? "var(--danger)" : "var(--border-default)"}`,
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                transition: "var(--transition-fast)",
                                background: "var(--bg-input)",
                                color: "var(--text-primary)",
                            }}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        {errors.password && <span id="password-error" style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>{errors.password[0]}</span>}
                    </div>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        style={{ width: "100%" }}
                    >
                        Sign In
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
}
