import type { Metadata } from "next";
import { categoryService } from "@/services/category.service";
import { brandService } from "@/services/brand.service";
import { ProductForm } from "@/components/products/ProductForm";

export const metadata: Metadata = {
    title: "Add Product — Big4 Admin",
    description: "Create a new product",
};

/**
 * /admin/products/new — Create product page.
 */
export default async function NewProductPage() {
    const [categories, brands] = await Promise.all([
        categoryService.getAll(),
        brandService.getAll(),
    ]);

    const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
    const brandOptions = brands.map((b) => ({ id: b.id, name: b.name }));

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#111827" }}>
                    Add Product
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
                    Create a new product in your inventory
                </p>
            </div>

            <ProductForm categories={categoryOptions} brands={brandOptions} />
        </div>
    );
}
