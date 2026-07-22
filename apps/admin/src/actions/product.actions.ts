"use server";

import { requireAuth } from "@/lib/auth-guard";
import { productService } from "@/services/product.service";
import { createProductSchema, updateProductSchema } from "@/validations/product.validation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin.types";
import { triggerStorefrontRevalidation } from "@/lib/revalidate";

/**
 * Server Action: Create a new product.
 */
export async function createProductAction(formData: FormData): Promise<ActionResult> {
    try {
        await requireAuth();

        const imagesJson = formData.get("images") as string;
        let images: { url: string; publicId: string; displayOrder?: number }[] = [];
        try {
            if (imagesJson) images = JSON.parse(imagesJson);
        } catch {
            /* ignore parse errors */
        }

        const raw = {
            name: formData.get("name") as string,
            sku: formData.get("sku") as string,
            description: (formData.get("description") as string) || undefined,
            brandId: (formData.get("brandId") as string) || undefined,
            price: parseFloat(formData.get("price") as string),
            costPrice: parseFloat(formData.get("costPrice") as string),
            stock: parseInt(formData.get("stock") as string, 10),
            imageUrl: (formData.get("imageUrl") as string) || undefined,
            images,
            categoryId: formData.get("categoryId") as string,
            priceUnit: (formData.get("priceUnit") as string) || undefined,
            salePrice: formData.has("salePrice") && formData.get("salePrice") ? parseFloat(formData.get("salePrice") as string) : undefined,
            color: (formData.get("color") as string) || undefined,
            material: (formData.get("material") as string) || undefined,
            finish: (formData.get("finish") as string) || undefined,
            size: (formData.get("size") as string) || undefined,
            coveragePerBox: formData.has("coveragePerBox") && formData.get("coveragePerBox") ? parseFloat(formData.get("coveragePerBox") as string) : undefined,
            highlights: formData.has("highlights") ? JSON.parse(formData.get("highlights") as string) : undefined,
            featured: formData.has("featured") ? formData.get("featured") === "true" : undefined,
        };

        const parsed = createProductSchema.safeParse(raw);
        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid input";
            return { success: false, message: msg, data: null };
        }

        const result = await productService.create(parsed.data);

        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products"]);

        return { success: true, message: "Product created successfully", data: null };
    } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT") throw error;
        console.error("createProductAction error:", error);
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Update an existing product.
 */
export async function updateProductAction(
    productId: string,
    formData: FormData
): Promise<ActionResult> {
    try {
        await requireAuth();

        const imagesJson = formData.get("images") as string;
        let images: { url: string; publicId: string; displayOrder?: number }[] | undefined;
        try {
            if (imagesJson) images = JSON.parse(imagesJson);
        } catch {
            /* ignore parse errors */
        }

        const raw = {
            name: (formData.get("name") as string) || undefined,
            sku: (formData.get("sku") as string) || undefined,
            description: (formData.get("description") as string) || undefined,
            brandId: formData.get("brandId") as string | undefined,
            price: formData.has("price") ? parseFloat(formData.get("price") as string) : undefined,
            costPrice: formData.has("costPrice") ? parseFloat(formData.get("costPrice") as string) : undefined,
            stock: formData.has("stock") ? parseInt(formData.get("stock") as string, 10) : undefined,
            imageUrl: formData.get("imageUrl") as string | undefined,
            images,
            categoryId: (formData.get("categoryId") as string) || undefined,
            priceUnit: formData.has("priceUnit") ? (formData.get("priceUnit") as string) : undefined,
            salePrice: formData.has("salePrice") && formData.get("salePrice") ? parseFloat(formData.get("salePrice") as string) : undefined,
            color: formData.has("color") ? (formData.get("color") as string || undefined) : undefined,
            material: formData.has("material") ? (formData.get("material") as string || undefined) : undefined,
            finish: formData.has("finish") ? (formData.get("finish") as string || undefined) : undefined,
            size: formData.has("size") ? (formData.get("size") as string || undefined) : undefined,
            coveragePerBox: formData.has("coveragePerBox") && formData.get("coveragePerBox") ? parseFloat(formData.get("coveragePerBox") as string) : undefined,
            highlights: formData.has("highlights") ? JSON.parse(formData.get("highlights") as string) : undefined,
            featured: formData.has("featured") ? formData.get("featured") === "true" : undefined,
        };

        const parsed = updateProductSchema.safeParse(raw);
        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid input";
            return { success: false, message: msg, data: null };
        }

        const result = await productService.update(productId, parsed.data);

        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${productId}`);
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${result.data?.slug || productId}`]);

        return { success: true, message: "Product updated successfully", data: null };
    } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT") throw error;
        console.error("updateProductAction error:", error);
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Archive a product (soft delete).
 */
export async function archiveProductAction(productId: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await productService.archive(productId);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${result.data?.slug || productId}`]);

        return { success: true, message: "Product archived", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Toggle featured status of a product.
 */
export async function toggleProductFeaturedAction(productId: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await productService.toggleFeatured(productId);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${result.data?.slug || productId}`]);

        return { success: true, message: result.message, data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Restore an archived product.
 */
export async function restoreProductAction(productId: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await productService.restore(productId);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${result.data?.slug || productId}`]);

        return { success: true, message: "Product restored", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Delete a product permanently.
 */
export async function deleteProductAction(productId: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await productService.delete(productId);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        await triggerStorefrontRevalidation(["products", `product-${result.data?.slug || productId}`]);

        return { success: true, message: "Product deleted", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}
