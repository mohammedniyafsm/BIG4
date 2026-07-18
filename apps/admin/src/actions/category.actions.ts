"use server";

import { requireAuth } from "@/lib/auth-guard";
import { categoryService } from "@/services/category.service";
import { createCategorySchema, updateCategorySchema } from "@/validations/category.validation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin.types";

/**
 * Server Action: Create a new category.
 */
export async function createCategoryAction(name: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const parsed = createCategorySchema.safeParse({ name });
        if (!parsed.success) {
            return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input", data: null };
        }

        const result = await categoryService.create(parsed.data);

        if (result.success) {
            revalidatePath("/admin/categories");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Update a category.
 */
export async function updateCategoryAction(id: string, name: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const parsed = updateCategorySchema.safeParse({ name });
        if (!parsed.success) {
            return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input", data: null };
        }

        const result = await categoryService.update(id, parsed.data);

        if (result.success) {
            revalidatePath("/admin/categories");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

/**
 * Server Action: Delete a category.
 */
export async function deleteCategoryAction(id: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await categoryService.delete(id);

        if (result.success) {
            revalidatePath("/admin/categories");
            revalidatePath("/admin/products");
            revalidatePath("/admin");
        }

        return result;
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}
