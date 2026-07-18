import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Product repository — all database queries related to products.
 * No business logic here, just clean data access.
 */
export const productRepository = {
    /**
     * Find products with filters, search, pagination, and sorting.
     * Includes brand + images relations.
     */
    async findMany(params: {
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
        skip?: number;
        take?: number;
    }) {
        return prisma.product.findMany({
            where: params.where,
            orderBy: params.orderBy ?? { createdAt: "desc" },
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                brandId: true,
                price: true,
                stock: true,
                imageUrl: true,
                isActive: true,
                categoryId: true,
                createdAt: true,
                category: {
                    select: { name: true },
                },
                brand: {
                    select: { name: true },
                },
                images: {
                    orderBy: { displayOrder: "asc" },
                    select: { id: true, url: true, publicId: true, displayOrder: true },
                },
            },
        });
    },

    /**
     * Count products matching a filter.
     */
    async count(where?: Prisma.ProductWhereInput): Promise<number> {
        return prisma.product.count({ where });
    },

    /**
     * Find a single product by ID (full details including costPrice).
     */
    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
                brand: { select: { name: true } },
                images: {
                    orderBy: { displayOrder: "asc" },
                    select: { id: true, url: true, publicId: true, displayOrder: true },
                },
            },
        });
    },

    /**
     * Find a product by slug.
     */
    async findBySlug(slug: string) {
        return prisma.product.findUnique({
            where: { slug },
        });
    },

    /**
     * Find a product by SKU.
     */
    async findBySku(sku: string) {
        return prisma.product.findUnique({
            where: { sku },
        });
    },

    /**
     * Check if a slug already exists.
     */
    async slugExists(slug: string): Promise<boolean> {
        const product = await prisma.product.findUnique({
            where: { slug },
            select: { id: true },
        });
        return !!product;
    },

    /**
     * Create a new product.
     */
    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({ data });
    },

    /**
     * Update a product.
     */
    async update(id: string, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({
            where: { id },
            data,
        });
    },

    /**
     * Update stock for a product (optimized single-field update).
     */
    async updateStock(id: string, stock: number) {
        return prisma.product.update({
            where: { id },
            data: { stock },
            select: { id: true, name: true, stock: true },
        });
    },

    /**
     * Archive a product (soft delete).
     */
    async archive(id: string) {
        return prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    },

    /**
     * Restore an archived product.
     */
    async restore(id: string) {
        return prisma.product.update({
            where: { id },
            data: { isActive: true },
        });
    },

    /**
     * Delete a product permanently.
     */
    async delete(id: string) {
        return prisma.product.delete({
            where: { id },
        });
    },

    /**
     * Count products by category (for delete protection).
     */
    async countByCategory(categoryId: string): Promise<number> {
        return prisma.product.count({
            where: { categoryId },
        });
    },

    /**
     * Delete all images for a product.
     */
    async deleteImages(productId: string) {
        return prisma.productImage.deleteMany({
            where: { productId },
        });
    },

    /**
     * Create images for a product.
     */
    async createImages(productId: string, images: { url: string; publicId: string; displayOrder: number }[]) {
        if (images.length === 0) return;
        return prisma.productImage.createMany({
            data: images.map((img) => ({ ...img, productId })),
        });
    },
};
