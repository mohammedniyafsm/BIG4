import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

/**
 * Refresh token repository — database operations for token management.
 * Tokens are stored as bcrypt hashes for security.
 */
export const refreshTokenRepository = {
    /**
     * Store a hashed refresh token for a user.
     */
    async create(data: {
        tokenHash: string;
        userId: string;
        expiresAt: Date;
    }) {
        return prisma.refreshToken.create({ data });
    },

    /**
     * Find a refresh token record by its hash.
     */
    async findByTokenHash(tokenHash: string) {
        return prisma.refreshToken.findUnique({
            where: { tokenHash },
        });
    },

    /**
     * Delete a specific refresh token by hash.
     * Used during token rotation (old token is deleted).
     */
    async deleteByTokenHash(tokenHash: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { tokenHash },
        });
    },

    /**
     * Find all refresh tokens for a user.
     * Used during token rotation to compare the incoming token.
     */
    async findAllForUser(userId: string) {
        return prisma.refreshToken.findMany({
            where: { userId },
        });
    },

    /**
     * Delete ALL refresh tokens for a user.
     * Used when:
     * - A stolen token is detected (security measure)
     * - User logs out from all devices
     */
    async deleteAllForUser(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    },

    /**
     * Clean up expired tokens.
     * Call this periodically to keep the table clean.
     */
    async deleteExpired(): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
    },
};

/**
 * Hash a refresh token for storage.
 * We reuse bcrypt for consistency.
 */
export async function hashRefreshToken(token: string): Promise<string> {
    return hashPassword(token);
}
