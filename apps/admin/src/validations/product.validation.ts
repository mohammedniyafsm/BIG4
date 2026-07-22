import { z } from "zod/v4";

const PriceUnitEnum = z.enum(["PER_SQM", "PER_PIECE", "PER_SET", "PER_BOX"]);

/**
 * Product-related validation schemas.
 */

/** Reusable price validator */
const priceSchema = z.number({ message: "Price must be a number" })
    .positive("Price must be greater than 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: "Price can only have up to 2 decimal places"
    });

/** Image entry schema */
const productImageSchema = z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
    displayOrder: z.number().int().min(0).optional(),
});

/** Create product schema */
export const createProductSchema = z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120, "Product name cannot exceed 120 characters"),
    sku: z.string().trim().min(1, "SKU is required").max(50),
    description: z.string().max(2000).optional(),
    brandId: z.string().min(1, "Please select a brand"),
    price: priceSchema,
    costPrice: priceSchema,
    stock: z.number({ message: "Stock must be a number" }).int("Stock must be a whole number").min(0, "Stock must be 0 or greater"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).min(1, "At least one image is required").max(8, "Cannot exceed 8 images"),
    categoryId: z.string().min(1, "Please select a category"),
    priceUnit: PriceUnitEnum.default("PER_PIECE"),
    salePrice: priceSchema.optional(),
    color: z.string().trim().max(100).optional(),
    material: z.string().trim().max(100).optional(),
    finish: z.string().trim().max(100).optional(),
    size: z.string().trim().max(100).optional(),
    coveragePerBox: z.number().positive("Coverage per box must be greater than 0").optional(),
    highlights: z.array(
        z.string().trim().min(1, "Highlight cannot be empty").max(120, "Highlight max 120 characters")
    ).max(10, "Cannot exceed 10 highlights").default([]),
    featured: z.boolean().default(false),
}).superRefine((data, ctx) => {
    if (data.salePrice !== undefined && data.salePrice >= data.price) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Sale price must be less than the selling price",
            path: ["salePrice"]
        });
    }
});

/** Update product schema (all fields optional except id) */
export const updateProductSchema = z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120, "Product name cannot exceed 120 characters").optional(),
    sku: z.string().trim().min(1, "SKU is required").max(50).optional(),
    description: z.string().max(2000).optional(),
    brandId: z.string().min(1, "Please select a brand").optional(),
    price: priceSchema.optional(),
    costPrice: priceSchema.optional(),
    stock: z.number({ message: "Stock must be a number" }).int("Stock must be a whole number").min(0, "Stock must be 0 or greater").optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).max(8).optional(),
    categoryId: z.string().min(1, "Please select a category").optional(),
    priceUnit: PriceUnitEnum.optional(),
    salePrice: priceSchema.optional().nullable(),
    color: z.string().trim().max(100).optional().nullable(),
    material: z.string().trim().max(100).optional().nullable(),
    finish: z.string().trim().max(100).optional().nullable(),
    size: z.string().trim().max(100).optional().nullable(),
    coveragePerBox: z.number().positive("Coverage per box must be greater than 0").optional().nullable(),
    highlights: z.array(
        z.string().trim().min(1, "Highlight cannot be empty").max(120, "Highlight max 120 characters")
    ).max(10, "Cannot exceed 10 highlights").optional(),
    featured: z.boolean().optional(),
}).superRefine((data, ctx) => {
    // If salePrice is set, we need to make sure we have a price to compare to, or at least it's less than existing price
    // But since it's an update payload, price might not be provided in the payload if it hasn't changed.
    // The server will do the final DB check if needed, but we can do a partial check if both are in payload.
    if (data.salePrice !== undefined && data.salePrice !== null && data.price !== undefined) {
        if (data.salePrice >= data.price) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Sale price must be less than the selling price",
                path: ["salePrice"]
            });
        }
    }
});

/** Inferred types */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
