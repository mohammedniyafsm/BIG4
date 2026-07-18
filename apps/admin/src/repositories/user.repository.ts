import { prisma } from "@/lib/prisma";

/**
 * User repository — all database queries related to users.
 * No business logic here, just clean data access.
 */
export const userRepository = {
    /**
     * Find a user by email.
     */
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    /**
     * Find a user by ID.
     */
    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    /**
     * Find a user by ID, excluding the password field.
     * Use this when returning user data to the client.
     */
    async findByIdSafe(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });
    },

    /**
     * Update the last login timestamp and reset failed login attempts.
     */
    async updateLastLogin(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
    },

    /**
     * Increment failed login attempts.
     * Returns the updated count.
     */
    async incrementFailedAttempts(id: string): Promise<number> {
        const user = await prisma.user.update({
            where: { id },
            data: {
                failedLoginAttempts: { increment: 1 },
            },
            select: { failedLoginAttempts: true },
        });
        return user.failedLoginAttempts;
    },

    /**
     * Lock a user account until the specified date.
     */
    async lockAccount(id: string, lockedUntil: Date): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { lockedUntil },
        });
    },

    /**
     * Update a user's password hash.
     */
    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    },

    /**
     * Create a new user.
     */
    async create(data: {
        email: string;
        password: string;
        name: string;
    }) {
        return prisma.user.create({ data });
    },
};
