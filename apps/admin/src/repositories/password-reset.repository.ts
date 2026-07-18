import { prisma } from "@/lib/prisma";

/**
 * Password reset token repository — data access for reset tokens.
 */
export const passwordResetRepository = {
    /**
     * Create a new password reset token.
     */
    async create(data: {
        tokenHash: string;
        userId: string;
        expiresAt: Date;
    }) {
        return prisma.passwordResetToken.create({ data });
    },

    /**
     * Find a valid (unused + not expired) token by hash.
     */
    async findValidToken(tokenHash: string) {
        return prisma.passwordResetToken.findFirst({
            where: {
                tokenHash,
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
    },

    /**
     * Mark a token as used.
     */
    async markAsUsed(id: string): Promise<void> {
        await prisma.passwordResetToken.update({
            where: { id },
            data: { usedAt: new Date() },
        });
    },

    /**
     * Delete all expired or used tokens (cleanup utility).
     */
    async deleteExpired(): Promise<void> {
        await prisma.passwordResetToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { usedAt: { not: null } },
                ],
            },
        });
    },
};
