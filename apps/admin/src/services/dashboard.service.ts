import { productRepository } from "@/repositories/product.repository";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard statistics service.
 * Aggregates data for the admin dashboard.
 */
export const dashboardService = {
    async getStats() {
        const [
            totalProducts,
            activeProducts,
            archivedProducts,
            totalCategories,
            totalBrands,
            lowStockProducts,
            recentProducts,
        ] = await Promise.all([
            productRepository.count(),
            productRepository.count({ isActive: true }),
            productRepository.count({ isActive: false }),
            prisma.category.count(),
            prisma.brand.count(),
            productRepository.count({ stock: { lte: 5 }, isActive: true }),
            prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    stock: true,
                    price: true,
                    isActive: true,
                    createdAt: true,
                    category: { select: { name: true } },
                    brand: { select: { name: true } },
                },
            }),
        ]);

        return {
            totalProducts,
            activeProducts,
            archivedProducts,
            totalCategories,
            totalBrands,
            lowStockProducts,
            recentProducts,
        };
    },
};
