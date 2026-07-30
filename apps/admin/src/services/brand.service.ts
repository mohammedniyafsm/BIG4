import { prisma } from "@/lib/prisma";
import { brandRepository } from "@/repositories/brand.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import { deleteImage } from "@/lib/cloudinary";
import type { CreateBrandInput, UpdateBrandInput } from "@/validations/brand.validation";
import type { ActionResult, BrandListParams } from "@/types/admin.types";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Brand service — business logic for brand management.
 */
export const brandService = {
    /**
     * Get all brands with product counts.
     */
    async getAll() {
        const brands = await brandRepository.findAll();
        const needsNormalization = brands.some((b) => !b.displayOrder || b.displayOrder <= 0);
        if (needsNormalization && brands.length > 0) {
            const updates = brands.map((b, idx) => ({ id: b.id, displayOrder: idx + 1 }));
            await prisma.$transaction(
                updates.map((u) =>
                    prisma.brand.update({
                        where: { id: u.id },
                        data: { displayOrder: u.displayOrder },
                    })
                )
            );
            return brandRepository.findAll();
        }
        return brands;
    },

    /**
     * Get paginated brands.
     */
    async list(params: BrandListParams) {
        const page = Math.max(1, params.page ?? 1);
        const pageSize = Math.min(50, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
        const skip = (page - 1) * pageSize;

        const [items, total] = await Promise.all([
            brandRepository.findPaginated(skip, pageSize),
            brandRepository.count(),
        ]);

        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    },

    /**
     * Reorder brands by updating displayOrders in a single transaction.
     */
    async reorder(updates: { id: string; displayOrder: number }[]): Promise<ActionResult> {
        try {
            await prisma.$transaction(
                updates.map((u) =>
                    prisma.brand.update({
                        where: { id: u.id },
                        data: { displayOrder: u.displayOrder },
                    })
                )
            );
            return { success: true, message: "Brand order updated successfully", data: null };
        } catch (error: any) {
            console.error("brandService.reorder error:", error);
            return { success: false, message: "Failed to reorder brands", data: null };
        }
    },

    /**
     * Create a new brand.
     */
    async create(input: CreateBrandInput): Promise<ActionResult> {
        const exists = await brandRepository.nameExists(input.name);
        if (exists) {
            return { success: false, message: "A brand with this name already exists", data: null };
        }

        const slug = await generateUniqueSlug(input.name, (s) =>
            brandRepository.slugExists(s)
        );

        const requestedOrder = Math.max(1, input.displayOrder ?? 1);

        // Fetch existing brands ordered by current displayOrder
        const existingBrands = await prisma.brand.findMany({
            orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
            select: { id: true, displayOrder: true },
        });

        // Calculate shifted orders for existing brands to make room for requested position
        const updatedOrders: { id: string; displayOrder: number }[] = [];
        let currentPos = 1;
        for (const brand of existingBrands) {
            if (currentPos === requestedOrder) {
                currentPos++;
            }
            if (brand.displayOrder !== currentPos) {
                updatedOrders.push({ id: brand.id, displayOrder: currentPos });
            }
            currentPos++;
        }

        await brandRepository.create({
            name: input.name,
            slug,
            imageUrl: input.imageUrl || null,
            imagePublicId: input.imagePublicId || null,
            displayOrder: requestedOrder,
            isActive: input.isActive ?? true,
        });

        if (updatedOrders.length > 0) {
            await prisma.$transaction(
                updatedOrders.map((u) =>
                    prisma.brand.update({
                        where: { id: u.id },
                        data: { displayOrder: u.displayOrder },
                    })
                )
            );
        }

        return { success: true, message: "Brand created successfully", data: null };
    },

    /**
     * Update a brand.
     * Upload-then-delete sequence: updates DB first; if old image was replaced, deletes old Cloudinary asset afterward.
     */
    async update(id: string, input: UpdateBrandInput): Promise<ActionResult> {
        const existing = await brandRepository.findById(id);
        if (!existing) {
            return { success: false, message: "Brand not found", data: null };
        }

        const nameExists = await brandRepository.nameExists(input.name, id);
        if (nameExists) {
            return { success: false, message: "A brand with this name already exists", data: null };
        }

        const slug = await generateUniqueSlug(input.name, async (s) => {
            if (s === existing.slug) return false;
            return brandRepository.slugExists(s);
        });

        const oldImagePublicId = existing.imagePublicId;
        const requestedOrder = Math.max(1, input.displayOrder ?? 1);

        // Shift existing other brands if position changed
        const otherBrands = await prisma.brand.findMany({
            where: { id: { not: id } },
            orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
            select: { id: true, displayOrder: true },
        });

        const updatedOrders: { id: string; displayOrder: number }[] = [];
        let currentPos = 1;
        for (const brand of otherBrands) {
            if (currentPos === requestedOrder) {
                currentPos++;
            }
            if (brand.displayOrder !== currentPos) {
                updatedOrders.push({ id: brand.id, displayOrder: currentPos });
            }
            currentPos++;
        }

        await brandRepository.update(id, {
            name: input.name,
            slug,
            imageUrl: input.imageUrl ?? null,
            imagePublicId: input.imagePublicId ?? null,
            displayOrder: requestedOrder,
            isActive: input.isActive ?? true,
        });

        if (updatedOrders.length > 0) {
            await prisma.$transaction(
                updatedOrders.map((u) =>
                    prisma.brand.update({
                        where: { id: u.id },
                        data: { displayOrder: u.displayOrder },
                    })
                )
            );
        }

        // Delete old image asset from Cloudinary ONLY after DB update succeeds
        if (oldImagePublicId && oldImagePublicId !== input.imagePublicId) {
            deleteImage(oldImagePublicId).catch((err) =>
                console.error("Failed to delete old brand image from Cloudinary:", err)
            );
        }

        return { success: true, message: "Brand updated successfully", data: null };
    },

    /**
     * Delete a brand (blocks if products exist, deletes Cloudinary image after DB row deletion).
     */
    async delete(id: string): Promise<ActionResult> {
        const existing = await brandRepository.findById(id);
        if (!existing) {
            return { success: false, message: "Brand not found", data: null };
        }

        const productCount = await brandRepository.productCount(id);
        if (productCount > 0) {
            return {
                success: false,
                message: `Cannot delete "${existing.name}" — ${productCount} product(s) are assigned to this brand. Reassign them first.`,
                data: null,
            };
        }

        await brandRepository.delete(id);

        if (existing.imagePublicId) {
            deleteImage(existing.imagePublicId).catch((err) =>
                console.error("Failed to delete brand image from Cloudinary:", err)
            );
        }

        return { success: true, message: "Brand deleted successfully", data: null };
    },
};
