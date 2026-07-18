"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";

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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
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
                background: "var(--bg-secondary)",
                padding: 16,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 400,
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-xl)",
                    boxShadow: "var(--shadow-lg)",
                    padding: 32,
                }}
            >
                {/* Branding */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: "var(--radius-lg)",
                            background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 800,
                            fontSize: 20,
                            marginBottom: 16,
                        }}
                    >
                        B4
                    </div>
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
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "var(--radius-md)",
                            color: "#991b1b",
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
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                transition: "var(--transition-fast)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: 6,
                            }}
                        >
                            Password
                        </label>
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
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                transition: "var(--transition-fast)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                            }}
                        />
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
