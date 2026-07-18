import { categoryRepository } from "@/repositories/category.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/validations/category.validation";
import type { ActionResult } from "@/types/admin.types";

/**
 * Category service — business logic for category management.
 */
export const categoryService = {
    /**
     * Get all categories with product counts.
     */
    async getAll() {
        return categoryRepository.findAll();
    },

    /**
     * Create a new category.
     */
    async create(input: CreateCategoryInput): Promise<ActionResult> {
        // Check name uniqueness
        const exists = await categoryRepository.nameExists(input.name);
        if (exists) {
            return { success: false, message: "A category with this name already exists", data: null };
        }

        const slug = await generateUniqueSlug(input.name, (s) =>
            categoryRepository.slugExists(s)
        );

        await categoryRepository.create({ name: input.name, slug });
        return { success: true, message: "Category created successfully", data: null };
    },

    /**
     * Update a category.
     */
    async update(id: string, input: UpdateCategoryInput): Promise<ActionResult> {
        const existing = await categoryRepository.findById(id);
        if (!existing) {
            return { success: false, message: "Category not found", data: null };
        }

        // Check name uniqueness (exclude self)
        const nameExists = await categoryRepository.nameExists(input.name, id);
        if (nameExists) {
            return { success: false, message: "A category with this name already exists", data: null };
        }

        const slug = await generateUniqueSlug(input.name, async (s) => {
            if (s === existing.slug) return false;
            return categoryRepository.slugExists(s);
        });

        await categoryRepository.update(id, { name: input.name, slug });
        return { success: true, message: "Category updated successfully", data: null };
    },

    /**
     * Delete a category (blocks if products exist).
     */
    async delete(id: string): Promise<ActionResult> {
        const existing = await categoryRepository.findById(id);
        if (!existing) {
            return { success: false, message: "Category not found", data: null };
        }

        const productCount = await categoryRepository.productCount(id);
        if (productCount > 0) {
            return {
                success: false,
                message: `Cannot delete "${existing.name}" — ${productCount} product(s) are assigned to this category. Reassign them first.`,
                data: null,
            };
        }

        await categoryRepository.delete(id);
        return { success: true, message: "Category deleted successfully", data: null };
    },
};
