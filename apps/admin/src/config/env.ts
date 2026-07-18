import { z } from "zod/v4";

/**
 * Typed environment variable access.
 * Validates all required env vars at startup to fail fast
 * if any are missing.
 */
const envSchema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters — use a cryptographically random string"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters — use a cryptographically random string"),
    ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
    SMTP_HOST: z.string().default("smtp.gmail.com"),
    SMTP_PORT: z.string().default("587"),
    SMTP_USER: z.string().default(""),
    SMTP_PASS: z.string().default(""),
    APP_URL: z.string().default("http://localhost:3000"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

function getEnv() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        const errors = z.prettifyError(parsed.error);
        console.error("❌ Invalid environment variables:", errors);
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}

export const env = getEnv();
