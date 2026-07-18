import { z } from "zod/v4";

/**
 * Category validation schemas.
 */
export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
