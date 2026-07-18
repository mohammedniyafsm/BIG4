import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import type { AccessTokenPayload, RefreshTokenPayload } from "@/types/auth.types";

/**
 * Generate a short-lived access token.
 * Contains user id and email for quick verification.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRY as any,
    });
}

/**
 * Generate a long-lived refresh token.
 * Contains only user id — minimal data for security.
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRY as any,
    });
}

/**
 * Verify and decode an access token.
 * Returns the decoded payload or null if invalid/expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    } catch {
        return null;
    }
}

/**
 * Verify and decode a refresh token.
 * Returns the decoded payload or null if invalid/expired.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch {
        return null;
    }
}
