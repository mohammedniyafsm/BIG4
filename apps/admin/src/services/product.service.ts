import { productRepository } from "@/repositories/product.repository";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slugify";
import type { ProductListParams, PaginatedResult, ProductListItem } from "@/types/admin.types";
import type { CreateProductInput, UpdateProductInput } from "@/validations/product.validation";
import type { Prisma } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 6;

/**
 * Product service — business logic for product management.
 */
export const productService = {
    /**
     * Get paginated product list with search, filters, and sorting.
     * Never returns costPrice to the listing view.
     */
    async list(params: ProductListParams): Promise<PaginatedResult<ProductListItem>> {
        const page = Math.max(1, params.page ?? 1);
        const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
        const skip = (page - 1) * pageSize;

        // Build where clause
        const where: Prisma.ProductWhereInput = {};

        // Status filter
        if (params.status === "active") {
            where.isActive = true;
        } else if (params.status === "archived") {
            where.isActive = false;
        }

        // Category filter
        if (params.categoryId) {
            where.categoryId = params.categoryId;
        }

        // Brand filter
        if (params.brandId) {
            where.brandId = params.brandId;
        }

        // Search (name or SKU)
        if (params.search?.trim()) {
            const term = params.search.trim();
            where.OR = [
                { name: { contains: term, mode: "insensitive" } },
                { sku: { contains: term, mode: "insensitive" } },
            ];
        }

        // Sort
        const sortBy = params.sortBy ?? "createdAt";
        const sortOrder = params.sortOrder ?? "desc";
        const orderBy: Prisma.ProductOrderByWithRelationInput = { [sortBy]: sortOrder };

        // Query
        const [items, total] = await Promise.all([
            productRepository.findMany({ where, orderBy, skip, take: pageSize }),
            productRepository.count(where),
        ]);

        const mapped: ProductListItem[] = items.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            brandId: p.brandId,
            brandName: p.brand?.name ?? null,
            price: p.price,
            stock: p.stock,
            imageUrl: p.imageUrl,
            images: p.images,
            isActive: p.isActive,
            categoryId: p.categoryId,
            categoryName: p.category.name,
            featured: p.featured,
            createdAt: p.createdAt,
        }));

        return {
            items: mapped,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    },

    /**
     * Get a single product by ID (includes costPrice for admin forms).
     */
    async getById(id: string) {
        const product = await productRepository.findById(id);
        if (!product) return null;
        return product;
    },

    /**
     * Create a new product with auto-generated slug.
     */
    async create(input: CreateProductInput) {
        // Check for duplicate SKU
        const existingSku = await productRepository.findBySku(input.sku);
        if (existingSku) {
            return { success: false as const, message: "A product with this SKU already exists", data: null };
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(input.name, (s) =>
            productRepository.slugExists(s)
        );

        const createData: Prisma.ProductCreateInput = {
            name: input.name,
            slug,
            sku: input.sku,
            description: input.description ?? null,
            price: input.price,
            costPrice: input.costPrice,
            stock: input.stock,
            imageUrl: input.imageUrl || null,
            category: { connect: { id: input.categoryId } },
            priceUnit: input.priceUnit,
            salePrice: input.salePrice ?? null,
            color: input.color ?? null,
            material: input.material ?? null,
            finish: input.finish ?? null,
            size: input.size ?? null,
            coveragePerBox: input.coveragePerBox ?? null,
            highlights: input.highlights ?? [],
            featured: input.featured ?? false,
        };

        // Connect brand if provided
        if (input.brandId) {
            createData.brand = { connect: { id: input.brandId } };
        }

        const product = await prisma.$transaction(async (tx) => {
            const created = await tx.product.create({ data: createData });

            if (input.images && input.images.length > 0) {
                await tx.productImage.createMany({
                    data: input.images.map((img, i) => ({
                        productId: created.id,
                        url: img.url,
                        publicId: img.publicId,
                        displayOrder: img.displayOrder ?? i,
                    })),
                });
                if (!input.imageUrl) {
                    await tx.product.update({
                        where: { id: created.id },
                        data: { imageUrl: input.images[0].url },
                    });
                }
            }
            return created;
        });

        return { success: true as const, message: "Product created successfully", data: product };
    },

    /**
     * Update an existing product.
     */
    async update(id: string, input: UpdateProductInput) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        // Check SKU uniqueness if changed
        if (input.sku && input.sku !== existing.sku) {
            const dup = await productRepository.findBySku(input.sku);
            if (dup) {
                return { success: false as const, message: "A product with this SKU already exists", data: null };
            }
        }

        // Build update data
        const data: Prisma.ProductUpdateInput = {};
        if (input.name !== undefined) {
            data.name = input.name;
            data.slug = await generateUniqueSlug(input.name, async (s) => {
                if (s === existing.slug) return false;
                return productRepository.slugExists(s);
            });
        }
        if (input.sku !== undefined) data.sku = input.sku;
        if (input.description !== undefined) data.description = input.description || null;
        if (input.price !== undefined) data.price = input.price;
        if (input.costPrice !== undefined) data.costPrice = input.costPrice;
        if (input.stock !== undefined) data.stock = input.stock;
        if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl || null;
        if (input.priceUnit !== undefined) data.priceUnit = input.priceUnit;
        if (input.salePrice !== undefined) data.salePrice = input.salePrice;
        if (input.color !== undefined) data.color = input.color;
        if (input.material !== undefined) data.material = input.material;
        if (input.finish !== undefined) data.finish = input.finish;
        if (input.size !== undefined) data.size = input.size;
        if (input.coveragePerBox !== undefined) data.coveragePerBox = input.coveragePerBox;
        if (input.highlights !== undefined) data.highlights = input.highlights;
        if (input.featured !== undefined) data.featured = input.featured;

        // Handle brand connection/disconnection
        if (input.brandId !== undefined) {
            if (input.brandId) {
                data.brand = { connect: { id: input.brandId } };
            } else {
                // Disconnect brand if empty string
                if (existing.brandId) {
                    data.brand = { disconnect: true };
                }
            }
        }

        if (input.categoryId !== undefined) {
            data.category = { connect: { id: input.categoryId } };
        }

        const product = await prisma.$transaction(async (tx) => {
            const updated = await tx.product.update({
                where: { id },
                data,
            });

            if (input.images !== undefined) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                if (input.images.length > 0) {
                    await tx.productImage.createMany({
                        data: input.images.map((img, i) => ({
                            productId: id,
                            url: img.url,
                            publicId: img.publicId,
                            displayOrder: img.displayOrder ?? i,
                        })),
                    });
                    if (!input.imageUrl) {
                        await tx.product.update({
                            where: { id },
                            data: { imageUrl: input.images[0].url },
                        });
                    }
                }
            }
            return updated;
        });

        return { success: true as const, message: "Product updated successfully", data: product };
    },

    /**
     * Update stock only (optimized).
     */
    async updateStock(id: string, stock: number) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        const updated = await productRepository.updateStock(id, stock);
        return { success: true as const, message: "Stock updated successfully", data: updated };
    },

    /**
     * Toggle featured status of a product.
     */
    async toggleFeatured(id: string) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        const updated = await productRepository.update(id, { featured: !existing.featured });
        return { success: true as const, message: updated.featured ? "Product featured" : "Product unfeatured", data: updated };
    },

    /**
     * Archive a product (soft delete).
     */
    async archive(id: string) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        await productRepository.archive(id);
        return { success: true as const, message: "Product archived successfully", data: existing };
    },

    /**
     * Restore an archived product.
     */
    async restore(id: string) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        await productRepository.restore(id);
        return { success: true as const, message: "Product restored successfully", data: existing };
    },

    /**
     * Delete a product permanently.
     */
    async delete(id: string) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        // Images cascade-delete via Prisma schema
        await productRepository.delete(id);
        return { success: true as const, message: "Product deleted successfully", data: existing };
    },
};
