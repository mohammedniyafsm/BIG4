import { userRepository } from "@/repositories/user.repository";
import {
    refreshTokenRepository,
    hashRefreshToken,
} from "@/repositories/refresh-token.repository";
import { passwordResetRepository } from "@/repositories/password-reset.repository";
import { comparePassword, hashPassword } from "@/lib/password";
import { HTTP_STATUS } from "@/constants";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "@/lib/auth";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookies";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import type {
    LoginInput,
    ChangePasswordInput,
    ForgotPasswordInput,
    ResetPasswordInput,
} from "@/validations/auth.validation";

/** Max failed login attempts before account lockout */
const MAX_FAILED_ATTEMPTS = 5;

/** Lockout duration in milliseconds (30 minutes) */
const LOCKOUT_DURATION_MS = 30 * 60 * 1000;

/** Password reset token expiry (1 hour) */
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

/**
 * Auth service — all authentication business logic.
 * Route handlers call this service; this service calls repositories.
 */
export const authService = {
    /**
     * Login: Validate credentials → Generate tokens → Set cookies.
     */
    async login(input: LoginInput) {
        const user = await userRepository.findByEmail(input.email);
        if (!user) {
            return { error: "Invalid email or password", status: 401 };
        }

        if (!user.isActive) {
            return { error: "Account is deactivated, contact administrator", status: 422 };
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingMinutes = Math.ceil(
                (user.lockedUntil.getTime() - Date.now()) / 60000
            );
            return {
                error: `Account is locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s)`,
                status: HTTP_STATUS.LOCKED,
            };
        }

        const isValid = await comparePassword(input.password, user.password);
        if (!isValid) {
            const attempts = await userRepository.incrementFailedAttempts(user.id);

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
                await userRepository.lockAccount(user.id, lockedUntil);
                return {
                    error: "Account locked due to too many failed attempts. Try again in 30 minutes",
                    status: HTTP_STATUS.LOCKED,
                };
            }

            const remaining = MAX_FAILED_ATTEMPTS - attempts;
            return {
                error: `Invalid email or password. ${remaining} attempt(s) remaining`,
                status: 401,
            };
        }

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
        });

        const tokenHash = await hashRefreshToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await refreshTokenRepository.create({
            tokenHash,
            userId: user.id,
            expiresAt,
        });

        await setAuthCookies(accessToken, refreshToken);
        await userRepository.updateLastLogin(user.id);

        return {
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastLoginAt: new Date(),
            },
        };
    },

    /**
     * Logout: Clear cookies and delete all refresh tokens for the user.
     */
    async logout(userId: string) {
        await refreshTokenRepository.deleteAllForUser(userId);
        await clearAuthCookies();
    },

    /**
     * Refresh: Verify refresh token → Rotate tokens → Set new cookies.
     */
    async refresh(oldRefreshToken: string) {
        const payload = verifyRefreshToken(oldRefreshToken);
        if (!payload) {
            return { error: "Session expired, please login again", status: 401 };
        }

        const userTokens = await refreshTokenRepository.findAllForUser(payload.userId);

        let matchedTokenHash: string | null = null;
        for (const storedToken of userTokens) {
            const isMatch = await comparePassword(oldRefreshToken, storedToken.tokenHash);
            if (isMatch) {
                matchedTokenHash = storedToken.tokenHash;
                break;
            }
        }

        if (!matchedTokenHash) {
            await refreshTokenRepository.deleteAllForUser(payload.userId);
            return { error: "Session expired, please login again", status: 401 };
        }

        const user = await userRepository.findById(payload.userId);
        if (!user || !user.isActive) {
            await refreshTokenRepository.deleteAllForUser(payload.userId);
            return { error: "Account is deactivated, contact administrator", status: 422 };
        }

        await refreshTokenRepository.deleteByTokenHash(matchedTokenHash);

        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        const newRefreshToken = generateRefreshToken({
            userId: user.id,
        });

        const newTokenHash = await hashRefreshToken(newRefreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await refreshTokenRepository.create({
            tokenHash: newTokenHash,
            userId: user.id,
            expiresAt,
        });

        await setAuthCookies(newAccessToken, newRefreshToken);

        return {
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    },

    /**
     * Change password: Verify current → Hash new → Update → Revoke sessions.
     */
    async changePassword(userId: string, input: ChangePasswordInput) {
        const user = await userRepository.findById(userId);
        if (!user) {
            return { error: "User not found", status: 404 };
        }

        const isValid = await comparePassword(input.currentPassword, user.password);
        if (!isValid) {
            return { error: "Current password is incorrect", status: 401 };
        }

        const isSame = await comparePassword(input.newPassword, user.password);
        if (isSame) {
            return { error: "New password must be different from current password", status: 400 };
        }

        const hashedPassword = await hashPassword(input.newPassword);
        await userRepository.updatePassword(userId, hashedPassword);
        await refreshTokenRepository.deleteAllForUser(userId);

        return { data: { message: "Password changed successfully" } };
    },

    /**
     * Forgot password: Generate reset token → Send email.
     * Always returns success to prevent email enumeration.
     */
    async forgotPassword(input: ForgotPasswordInput) {
        const user = await userRepository.findByEmail(input.email);

        if (!user || !user.isActive) {
            return { data: { message: "If the email exists, a password reset link has been sent" } };
        }

        // Generate a cryptographically random token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // Hash with SHA-256 for storage (no bcrypt needed — token is already random)
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
        await passwordResetRepository.create({
            tokenHash,
            userId: user.id,
            expiresAt,
        });

        // Send email (don't leak errors to client)
        try {
            await sendPasswordResetEmail(user.email, rawToken);
        } catch (err) {
            console.error("Failed to send password reset email:", err);
        }

        return { data: { message: "If the email exists, a password reset link has been sent" } };
    },

    /**
     * Reset password: Validate token → Update password → Revoke sessions.
     */
    async resetPassword(input: ResetPasswordInput) {
        // Hash the incoming token to look it up
        const tokenHash = crypto.createHash("sha256").update(input.token).digest("hex");

        const resetToken = await passwordResetRepository.findValidToken(tokenHash);
        if (!resetToken) {
            return { error: "Invalid or expired reset token", status: 400 };
        }

        if (!resetToken.user.isActive) {
            return { error: "Account is deactivated, contact administrator", status: 422 };
        }

        const hashedPassword = await hashPassword(input.newPassword);
        await userRepository.updatePassword(resetToken.userId, hashedPassword);
        await passwordResetRepository.markAsUsed(resetToken.id);
        await refreshTokenRepository.deleteAllForUser(resetToken.userId);
        await userRepository.updateLastLogin(resetToken.userId);

        return { data: { message: "Password reset successfully" } };
    },

    /**
     * Get current authenticated user's profile.
     */
    async me(userId: string) {
        const user = await userRepository.findByIdSafe(userId);
        if (!user) {
            return { error: "User not found", status: 404 };
        }
        return { data: user };
    },
};
