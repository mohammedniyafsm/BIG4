"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { archiveProductAction, restoreProductAction } from "@/actions/product.actions";

interface ProductEditActionsProps {
    productId: string;
    productName: string;
    isActive: boolean;
}

/**
 * Archive/Restore buttons on the product edit page.
 */
export function ProductEditActions({ productId, productName, isActive }: ProductEditActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleArchive = async () => {
        setLoading(true);
        const result = await archiveProductAction(productId);
        setLoading(false);
        setShowConfirm(false);

        if (result.success) {
            toast("Product archived", "success");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast(result.message, "error");
        }
    };

    const handleRestore = async () => {
        setLoading(true);
        const result = await restoreProductAction(productId);
        setLoading(false);

        if (result.success) {
            toast("Product restored", "success");
            router.refresh();
        } else {
            toast(result.message, "error");
        }
    };

    return (
        <>
            {isActive ? (
                <LoadingButton variant="danger" onClick={() => setShowConfirm(true)}>
                    Archive Product
                </LoadingButton>
            ) : (
                <LoadingButton variant="primary" loading={loading} onClick={handleRestore}>
                    Restore Product
                </LoadingButton>
            )}

            <ConfirmDialog
                open={showConfirm}
                title="Archive Product"
                message={`Are you sure you want to archive "${productName}"? It will be hidden from the active product list but can be restored later.`}
                confirmLabel="Archive"
                variant="danger"
                loading={loading}
                onConfirm={handleArchive}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
