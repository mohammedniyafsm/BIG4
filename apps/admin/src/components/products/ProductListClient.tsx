"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductTable } from "@/components/products/ProductTable";
import { StockModal } from "@/components/products/StockModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { deleteProductAction, toggleProductFeaturedAction } from "@/actions/product.actions";
import type { ProductListItem } from "@/types/admin.types";

interface ProductListClientProps {
    products: ProductListItem[];
}

const TABS = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
    { label: "Low Stock", value: "low-stock" }
];

export function ProductListClient({ products }: ProductListClientProps) {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Determine current tab from URL
    let currentTab = "all";
    if (searchParams.get("status") === "active") currentTab = "active";
    if (searchParams.get("status") === "archived") currentTab = "archived";
    if (searchParams.get("sort") === "stock-asc") currentTab = "low-stock";

    const [stockProduct, setStockProduct] = useState<ProductListItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("status");
        params.delete("sort");
        
        if (value === "active") params.set("status", "active");
        if (value === "archived") params.set("status", "archived");
        if (value === "low-stock") params.set("sort", "stock-asc");
        
        router.push(`?${params.toString()}`);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        const result = await deleteProductAction(deleteTarget.id);
        setDeleting(false);

        if (result.success) {
            toast("Product deleted permanently", "success");
            setDeleteTarget(null);
            router.refresh(); // Use router.refresh() instead of window.location.reload()
        } else {
            toast(result.message, "error");
            setDeleteTarget(null);
        }
    };

    const handleFeatureToggle = async (product: ProductListItem) => {
        const result = await toggleProductFeaturedAction(product.id);
        if (result.success) {
            toast(result.message, "success");
            router.refresh();
        } else {
            toast(result.message, "error");
        }
    };

    return (
        <>
            {/* Segmented Control */}
            <div style={{ display: "flex", overflowX: "auto", gap: 8, marginBottom: 24, paddingBottom: 4, msOverflowStyle: "none", scrollbarWidth: "none" }} className="segmented-control">
                {TABS.map(tab => {
                    const isActive = currentTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "var(--radius-pill)",
                                border: "none",
                                background: isActive ? "var(--hero-bg)" : "transparent",
                                color: isActive ? "var(--hero-text)" : "var(--text-secondary)",
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 500,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 200ms ease"
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <ProductTable
                products={products}
                onStockClick={(product) => setStockProduct(product)}
                onDeleteClick={(product) => setDeleteTarget(product)}
                onFeatureToggle={handleFeatureToggle}
            />

            <StockModal
                product={stockProduct}
                onClose={() => setStockProduct(null)}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Product"
                message={
                    deleteTarget
                        ? `Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`
                        : ""
                }
                confirmLabel="Delete"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}
