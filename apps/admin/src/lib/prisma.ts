import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton with Neon adapter.
 *
 * In development, Next.js hot-reloads modules on every change,
 * which would create a new PrismaClient on each reload and
 * exhaust database connections. This pattern stores the client
 * on `globalThis` to reuse it across reloads.
 */

function createPrismaClient() {
    return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
    prisma_v3: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma_v3 ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma_v3 = prisma;
}
