"use client";

import { useState, useRef, useEffect } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/ToastProvider";
import { updateStockAction } from "@/actions/stock.actions";
import type { ProductListItem } from "@/types/admin.types";

interface StockModalProps {
    product: ProductListItem | null;
    onClose: () => void;
}

/**
 * Quick stock update modal — opens when clicking stock cell in product table.
 * Designed for speed: numeric input, auto-focused, Enter to submit.
 */
export function StockModal({ product, onClose }: StockModalProps) {
    const { toast } = useToast();
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Set initial value and focus when product changes
    useEffect(() => {
        if (product) {
            setStock(String(product.stock));
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [product]);

    if (!product) return null;

    const handleSubmit = async () => {
        const newStock = parseInt(stock, 10);
        if (isNaN(newStock) || newStock < 0) {
            toast("Stock must be a valid number ≥ 0", "error");
            return;
        }

        if (newStock === product.stock) {
            onClose();
            return;
        }

        setLoading(true);
        const result = await updateStockAction(product.id, newStock);
        setLoading(false);

        if (result.success) {
            toast(`Stock updated: ${product.name} → ${newStock}`, "success");
            onClose();
        } else {
            toast(result.message, "error");
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 50,
                    animation: "fade-in 200ms ease",
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#ffffff",
                    borderRadius: 16,
                    padding: 28,
                    width: "100%",
                    maxWidth: 380,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    zIndex: 51,
                    animation: "slide-up 250ms ease",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                    Update Stock
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
                    {product.name}
                </p>

                {/* Current stock */}
                <div
                    style={{
                        margin: "20px 0",
                        padding: "12px 16px",
                        background: "#f9fafb",
                        borderRadius: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Current Stock</span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: product.stock <= 5 ? "#ef4444" : "#111827",
                        }}
                    >
                        {product.stock}
                    </span>
                </div>

                {/* Input */}
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
                    New Stock
                </label>
                <input
                    ref={inputRef}
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                        if (e.key === "Escape") onClose();
                    }}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        fontSize: 18,
                        fontWeight: 700,
                        border: "2px solid #e5e7eb",
                        borderRadius: 10,
                        outline: "none",
                        textAlign: "center",
                        color: "#111827",
                        background: "#ffffff",
                        transition: "border-color 150ms ease",
                    }}
                />

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <LoadingButton variant="secondary" onClick={onClose} style={{ flex: 1 }}>
                        Cancel
                    </LoadingButton>
                    <LoadingButton variant="primary" loading={loading} onClick={handleSubmit} style={{ flex: 1 }}>
                        Save
                    </LoadingButton>
                </div>
            </div>
        </>
    );
}
