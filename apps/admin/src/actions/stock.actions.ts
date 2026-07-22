"use server";

import { requireAuth } from "@/lib/auth-guard";
import { productService } from "@/services/product.service";
import { updateStockSchema } from "@/validations/stock.validation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin.types";
import { triggerStorefrontRevalidation } from "@/lib/revalidate";

/**
 * Server Action: Update product stock.
 * Used by the StockModal for quick inline stock updates.
 */
export async function updateStockAction(
    productId: string,
    stock: number
): Promise<ActionResult> {
    try {
        // Auth check
        await requireAuth();

        // Validate
        const parsed = updateStockSchema.safeParse({ productId, stock });
        if (!parsed.success) {
            return { success: false, message: "Invalid stock value", data: null };
        }

        // Execute
        const result = await productService.updateStock(productId, stock);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        // Revalidate
        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${productId}`]);

        return { success: true, message: "Stock updated successfully", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}
