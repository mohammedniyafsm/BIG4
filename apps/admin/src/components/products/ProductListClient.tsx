"use client";

import { useState } from "react";
import { ProductTable } from "@/components/products/ProductTable";
import { StockModal } from "@/components/products/StockModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { deleteProductAction } from "@/actions/product.actions";
import type { ProductListItem } from "@/types/admin.types";

interface ProductListClientProps {
    products: ProductListItem[];
}

/**
 * Client wrapper for the product list page.
 * Manages the stock modal and delete confirmation state.
 */
export function ProductListClient({ products }: ProductListClientProps) {
    const { toast } = useToast();
    const [stockProduct, setStockProduct] = useState<ProductListItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        // Permanently delete from database
        const result = await deleteProductAction(deleteTarget.id);
        setDeleting(false);

        if (result.success) {
            toast("Product deleted permanently", "success");
            setDeleteTarget(null);
            window.location.reload();
        } else {
            toast(result.message, "error");
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <ProductTable
                products={products}
                onStockClick={(product) => setStockProduct(product)}
                onDeleteClick={(product) => setDeleteTarget(product)}
            />

            {/* Stock Modal */}
            <StockModal
                product={stockProduct}
                onClose={() => setStockProduct(null)}
            />

            {/* Delete Confirmation */}
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
