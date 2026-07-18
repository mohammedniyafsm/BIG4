import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductListClient } from "@/components/products/ProductListClient";
import type { ProductListParams } from "@/types/admin.types";

export const metadata: Metadata = {
    title: "Products — Big4 Admin",
    description: "Manage your product inventory",
};

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        status?: string;
        sort?: string;
        page?: string;
    }>;
}

/**
 * /admin/products — Product listing page.
 *
 * Server-rendered with search, filters, pagination, and sorting.
 * Client components handle interactions (search debounce, stock modal).
 */
export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Parse sort param (e.g., "name-asc" → { sortBy: "name", sortOrder: "asc" })
    let sortBy: ProductListParams["sortBy"] = "createdAt";
    let sortOrder: ProductListParams["sortOrder"] = "desc";
    if (params.sort) {
        const [field, order] = params.sort.split("-");
        if (["name", "price", "stock", "createdAt"].includes(field)) {
            sortBy = field as ProductListParams["sortBy"];
        }
        if (order === "asc" || order === "desc") {
            sortOrder = order;
        }
    }

    // Fetch data in parallel
    const [result, categories] = await Promise.all([
        productService.list({
            search: params.search,
            categoryId: params.category,
            status: (params.status as ProductListParams["status"]) ?? "all",
            sortBy,
            sortOrder,
            page: params.page ? parseInt(params.page, 10) : 1,
        }),
        categoryService.getAll(),
    ]);

    const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

    return (
        <div>
            {/* Header */}
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
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#111827" }}>
                        Products
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
                        Manage your product inventory
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 20px",
                        background: "#2563eb",
                        color: "#ffffff",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "background 150ms ease",
                    }}
                >
                    + Add Product
                </Link>
            </div>

            {/* Search + Filters */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 20,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <Suspense>
                    <SearchBar placeholder="Search by name or SKU..." />
                </Suspense>
                <Suspense>
                    <ProductFilters categories={categoryOptions} />
                </Suspense>
            </div>

            {/* Product Table */}
            <ProductListClient products={result.items} />

            {/* Pagination */}
            <Suspense>
                <Pagination
                    currentPage={result.page}
                    totalPages={result.totalPages}
                    total={result.total}
                />
            </Suspense>
        </div>
    );
}
