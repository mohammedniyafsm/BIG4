import { brandRepository } from "@/repositories/brand.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import type { CreateBrandInput, UpdateBrandInput } from "@/validations/brand.validation";
import type { ActionResult } from "@/types/admin.types";

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

        await brandRepository.create({ name: input.name, slug });
        return { success: true, message: "Brand created successfully", data: null };
    },

    /**
     * Update a brand.
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

        await brandRepository.update(id, { name: input.name, slug });
        return { success: true, message: "Brand updated successfully", data: null };
    },

    /**
     * Delete a brand (blocks if products exist).
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
        return { success: true, message: "Brand deleted successfully", data: null };
    },
};
