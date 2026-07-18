import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma Client singleton with Neon adapter.
 *
 * In development, Next.js hot-reloads modules on every change,
 * which would create a new PrismaClient on each reload and
 * exhaust database connections. This pattern stores the client
 * on `globalThis` to reuse it across reloads.
 */

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
