"use server";

import { requireAuth } from "@/lib/auth-guard";
import { brandService } from "@/services/brand.service";
import { createBrandSchema, updateBrandSchema } from "@/validations/brand.validation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin.types";

/**
 * Server Action: Create a new brand.
 */
export async function createBrandAction(name: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const parsed = createBrandSchema.safeParse({ name });
        if (!parsed.success) {
            return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input", data: null };
        }

        const result = await brandService.create(parsed.data);

        if (result.success) {
            revalidatePath("/admin/brands");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Update a brand.
 */
export async function updateBrandAction(id: string, name: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const parsed = updateBrandSchema.safeParse({ name });
        if (!parsed.success) {
            return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input", data: null };
        }

        const result = await brandService.update(id, parsed.data);

        if (result.success) {
            revalidatePath("/admin/brands");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Delete a brand.
 */
export async function deleteBrandAction(id: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await brandService.delete(id);

        if (result.success) {
            revalidatePath("/admin/brands");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}
