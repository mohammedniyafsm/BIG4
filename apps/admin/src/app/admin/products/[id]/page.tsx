import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { brandService } from "@/services/brand.service";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductEditActions } from "@/components/products/ProductEditActions";

export const metadata: Metadata = {
    title: "Edit Product — Big4 Admin",
    description: "Edit product details",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * /admin/products/[id] — Edit product page.
 */
export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;

    const [product, categories, brands] = await Promise.all([
        productService.getById(id),
        categoryService.getAll(),
        brandService.getAll(),
    ]);

    if (!product) {
        notFound();
    }

    const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
    const brandOptions = brands.map((b) => ({ id: b.id, name: b.name }));

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Edit Product
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                        {product.name}
                    </p>
                </div>

                <ProductEditActions
                    productId={product.id}
                    productName={product.name}
                    isActive={product.isActive}
                />
            </div>

            <ProductForm
                categories={categoryOptions}
                brands={brandOptions}
                product={{
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    description: product.description,
                    brandId: product.brandId,
                    price: Number(product.price),
                    costPrice: Number(product.costPrice),
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    images: product.images,
                    categoryId: product.categoryId,
                    isActive: product.isActive,
                    featured: product.featured,
                    priceUnit: product.priceUnit,
                    salePrice: product.salePrice ? Number(product.salePrice) : null,
                    color: product.color,
                    material: product.material,
                    finish: product.finish,
                    size: product.size,
                    coveragePerBox: product.coveragePerBox ? Number(product.coveragePerBox) : null,
                    highlights: product.highlights,
                }}
            />
        </div>
    );
}
