"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryOption {
    id: string;
    name: string;
}

interface ProductFiltersProps {
    categories: CategoryOption[];
}

/**
 * Filter bar for product listing — category and status dropdowns.
 */
export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category") ?? "";
    const currentStatus = searchParams.get("status") ?? "all";
    const currentSort = searchParams.get("sort") ?? "createdAt-desc";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!value || value === "all" || value === "createdAt-desc") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.delete("page"); // Reset pagination on filter change
        router.push(`?${params.toString()}`);
    };

    const selectStyle: React.CSSProperties = {
        padding: "8px 12px",
        fontSize: 13,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#ffffff",
        color: "#374151",
        outline: "none",
        cursor: "pointer",
        minWidth: 140,
    };

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Category Filter */}
            <select
                value={currentCategory}
                onChange={(e) => updateParam("category", e.target.value)}
                style={selectStyle}
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Status Filter */}
            <select
                value={currentStatus}
                onChange={(e) => updateParam("status", e.target.value)}
                style={selectStyle}
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
            </select>

            {/* Sort */}
            <select
                value={currentSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                style={selectStyle}
            >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="price-asc">Price Low–High</option>
                <option value="price-desc">Price High–Low</option>
                <option value="stock-asc">Stock Low–High</option>
                <option value="stock-desc">Stock High–Low</option>
            </select>
        </div>
    );
}
