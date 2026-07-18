import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Category repository — all database queries related to categories.
 */
export const categoryRepository = {
    /**
     * Get all categories, ordered by name.
     */
    async findAll() {
        return prisma.category.findMany({
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
     * Find a category by ID.
     */
    async findById(id: string) {
        return prisma.category.findUnique({
            where: { id },
        });
    },

    /**
     * Find a category by slug.
     */
    async findBySlug(slug: string) {
        return prisma.category.findUnique({
            where: { slug },
        });
    },

    /**
     * Check if a slug already exists.
     */
    async slugExists(slug: string): Promise<boolean> {
        const cat = await prisma.category.findUnique({
            where: { slug },
            select: { id: true },
        });
        return !!cat;
    },

    /**
     * Check if a name already exists.
     */
    async nameExists(name: string, excludeId?: string): Promise<boolean> {
        const cat = await prisma.category.findFirst({
            where: {
                name: { equals: name, mode: "insensitive" },
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            select: { id: true },
        });
        return !!cat;
    },

    /**
     * Create a new category.
     */
    async create(data: Prisma.CategoryCreateInput) {
        return prisma.category.create({ data });
    },

    /**
     * Update a category.
     */
    async update(id: string, data: Prisma.CategoryUpdateInput) {
        return prisma.category.update({
            where: { id },
            data,
        });
    },

    /**
     * Delete a category by ID.
     */
    async delete(id: string) {
        return prisma.category.delete({
            where: { id },
        });
    },

    /**
     * Count products in a category.
     */
    async productCount(id: string): Promise<number> {
        return prisma.product.count({
            where: { categoryId: id },
        });
    },
};
