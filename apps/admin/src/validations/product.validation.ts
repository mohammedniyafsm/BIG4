import { z } from "zod/v4";

/**
 * Product-related validation schemas.
 */

/** Reusable price validator */
const priceSchema = z.number().min(0, "Price must be 0 or greater");

/** Image entry schema */
const productImageSchema = z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
    displayOrder: z.number().int().min(0).optional(),
});

/** Create product schema */
export const createProductSchema = z.object({
    name: z.string().min(1, "Product name is required").max(200),
    sku: z.string().min(1, "SKU is required").max(50),
    description: z.string().max(2000).optional(),
    brandId: z.string().optional().or(z.literal("")),
    price: priceSchema,
    costPrice: priceSchema,
    stock: z.number().int().min(0, "Stock must be 0 or greater"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).max(8).optional(),
    categoryId: z.string().min(1, "Category is required"),
});

/** Update product schema (all fields optional except id) */
export const updateProductSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    sku: z.string().min(1).max(50).optional(),
    description: z.string().max(2000).optional(),
    brandId: z.string().optional().or(z.literal("")),
    price: priceSchema.optional(),
    costPrice: priceSchema.optional(),
    stock: z.number().int().min(0).optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).max(8).optional(),
    categoryId: z.string().min(1).optional(),
});

/** Inferred types */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
