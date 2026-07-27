import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is missing");
    }
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
    prisma_web: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma_web ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma_web = prisma;
}
