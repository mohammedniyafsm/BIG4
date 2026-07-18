import type { Metadata } from "next";
import { categoryService } from "@/services/category.service";
import { CategoryListClient } from "@/components/categories/CategoryListClient";

export const metadata: Metadata = {
    title: "Categories — Big4 Admin",
    description: "Manage product categories",
};

/**
 * /admin/categories — Category management page.
 */
export default async function CategoriesPage() {
    const categories = await categoryService.getAll();

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#111827" }}>
                    Categories
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
                    Manage your product categories
                </p>
            </div>

            <CategoryListClient categories={categories} />
        </div>
    );
}
