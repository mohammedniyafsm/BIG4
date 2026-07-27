import { z } from "zod/v4";

/**
 * Brand validation schemas.
 */
export const createBrandSchema = z.object({
    name: z.string().trim().min(2, "Brand name must be at least 2 characters").max(60, "Brand name cannot exceed 60 characters"),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    imagePublicId: z.string().nullable().optional(),
    displayOrder: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});

export const updateBrandSchema = z.object({
    name: z.string().trim().min(2, "Brand name must be at least 2 characters").max(60, "Brand name cannot exceed 60 characters"),
    imageUrl: z.string().url("Invalid image URL").nullable().optional(),
    imagePublicId: z.string().nullable().optional(),
    displayOrder: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

