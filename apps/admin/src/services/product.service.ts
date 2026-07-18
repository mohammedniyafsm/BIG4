import { productRepository } from "@/repositories/product.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import type { ProductListParams, PaginatedResult, ProductListItem } from "@/types/admin.types";
import type { CreateProductInput, UpdateProductInput } from "@/validations/product.validation";
import type { Prisma } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 12;

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
        };

        // Connect brand if provided
        if (input.brandId) {
            createData.brand = { connect: { id: input.brandId } };
        }

        const product = await productRepository.create(createData);

        // Create product images if provided
        if (input.images && input.images.length > 0) {
            await productRepository.createImages(
                product.id,
                input.images.map((img, i) => ({
                    url: img.url,
                    publicId: img.publicId,
                    displayOrder: img.displayOrder ?? i,
                }))
            );
            // Set first image as thumbnail if no imageUrl provided
            if (!input.imageUrl && input.images.length > 0) {
                await productRepository.update(product.id, { imageUrl: input.images[0].url });
            }
        }

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

        const product = await productRepository.update(id, data);

        // Handle images: replace all images if provided
        if (input.images !== undefined) {
            await productRepository.deleteImages(id);
            if (input.images.length > 0) {
                await productRepository.createImages(
                    id,
                    input.images.map((img, i) => ({
                        url: img.url,
                        publicId: img.publicId,
                        displayOrder: img.displayOrder ?? i,
                    }))
                );
                // Update thumbnail to first image
                if (!input.imageUrl) {
                    await productRepository.update(id, { imageUrl: input.images[0].url });
                }
            }
        }

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
     * Archive a product (soft delete).
     */
    async archive(id: string) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            return { success: false as const, message: "Product not found", data: null };
        }

        await productRepository.archive(id);
        return { success: true as const, message: "Product archived successfully", data: null };
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
        return { success: true as const, message: "Product restored successfully", data: null };
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
        return { success: true as const, message: "Product deleted successfully", data: null };
    },
};
