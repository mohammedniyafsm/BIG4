import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Brand repository — all database queries related to brands.
 */
export const brandRepository = {
    /**
     * Get all brands, ordered by name.
     */
    async findAll() {
        return prisma.brand.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { products: true },
                },
            },
        });
    },

    /**
     * Find a brand by ID.
     */
    async findById(id: string) {
        return prisma.brand.findUnique({
            where: { id },
        });
    },

    /**
     * Find a brand by slug.
     */
    async findBySlug(slug: string) {
        return prisma.brand.findUnique({
            where: { slug },
        });
    },

    /**
     * Check if a slug already exists.
     */
    async slugExists(slug: string): Promise<boolean> {
        const brand = await prisma.brand.findUnique({
            where: { slug },
            select: { id: true },
        });
        return !!brand;
    },

    /**
     * Check if a name already exists (case-insensitive).
     */
    async nameExists(name: string, excludeId?: string): Promise<boolean> {
        const brand = await prisma.brand.findFirst({
            where: {
                name: { equals: name, mode: "insensitive" },
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            select: { id: true },
        });
        return !!brand;
    },

    /**
     * Create a new brand.
     */
    async create(data: Prisma.BrandCreateInput) {
        return prisma.brand.create({ data });
    },

    /**
     * Update a brand.
     */
    async update(id: string, data: Prisma.BrandUpdateInput) {
        return prisma.brand.update({
            where: { id },
            data,
        });
    },

    /**
     * Delete a brand by ID.
     */
    async delete(id: string) {
        return prisma.brand.delete({
            where: { id },
        });
    },

    /**
     * Count products in a brand.
     */
    async productCount(id: string): Promise<number> {
        return prisma.product.count({
            where: { brandId: id },
        });
    },
};
