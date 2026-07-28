import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
    return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
    prisma_web_v2: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma_web_v2 ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma_web_v2 = prisma;
}
