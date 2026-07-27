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
        return brandRepository.findAll();
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

        await brandRepository.create({
            name: input.name,
            slug,
            imageUrl: input.imageUrl || null,
            imagePublicId: input.imagePublicId || null,
            displayOrder: input.displayOrder ?? 0,
            isActive: input.isActive ?? true,
        });

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

        await brandRepository.update(id, {
            name: input.name,
            slug,
            imageUrl: input.imageUrl ?? null,
            imagePublicId: input.imagePublicId ?? null,
            displayOrder: input.displayOrder ?? 0,
            isActive: input.isActive ?? true,
        });

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
