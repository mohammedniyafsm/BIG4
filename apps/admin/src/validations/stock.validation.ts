import { z } from "zod/v4";

/**
 * Stock update validation schema.
 */
export const updateStockSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
