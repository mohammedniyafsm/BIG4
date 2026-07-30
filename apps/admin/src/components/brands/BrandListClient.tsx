"use client";

import { useState, useEffect } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { BrandImageUploader } from "@/components/brands/BrandImageUploader";
import {
    createBrandAction,
    updateBrandAction,
    deleteBrandAction,
    reorderBrandsAction,
} from "@/actions/brand.actions";

export interface BrandItem {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    displayOrder: number;
    isActive: boolean;
    _count: { products: number };
}

interface BrandListClientProps {
    brands: BrandItem[];
}

export function BrandListClient({ brands: initialBrands }: BrandListClientProps) {
    const { toast } = useToast();
    const [brands, setBrands] = useState(initialBrands);

    useEffect(() => {
        setBrands(initialBrands);
    }, [initialBrands]);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

    // Form fields
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePublicId, setImagePublicId] = useState<string | null>(null);
    const [displayOrder, setDisplayOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Delete target
    const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    const moveBrand = async (index: number, direction: -1 | 1) => {
        if (reordering) return;
        if (index + direction < 0 || index + direction >= brands.length) return;

        setReordering(true);

        const newBrands = [...brands];
        const temp = newBrands[index];
        newBrands[index] = newBrands[index + direction];
        newBrands[index + direction] = temp;

        newBrands.forEach((b, i) => {
            b.displayOrder = i + 1;
        });

        setBrands(newBrands);

        const updates = newBrands.map((b) => ({ id: b.id, displayOrder: b.displayOrder }));
        const result = await reorderBrandsAction(updates);
        setReordering(false);

        if (result.success) {
            toast("Brand order updated", "success");
        } else {
            toast(result.message || "Failed to update order", "error");
            setBrands(brands);
        }
    };

    const openCreateModal = () => {
        setEditingBrand(null);
        setName("");
        setImageUrl(null);
        setImagePublicId(null);
        const maxOrder = brands.length > 0 ? Math.max(...brands.map((b) => b.displayOrder || 0)) : 0;
        setDisplayOrder(maxOrder + 1);
        setIsActive(true);
        setFormError("");
        setModalOpen(true);
    };

    const openEditModal = (brand: BrandItem) => {
        setEditingBrand(brand);
        setName(brand.name);
        setImageUrl(brand.imageUrl || null);
        setImagePublicId(brand.imagePublicId || null);
        setDisplayOrder(brand.displayOrder || 0);
        setIsActive(brand.isActive ?? true);
        setFormError("");
        setModalOpen(true);
    };

    const handleSave = async () => {
        setFormError("");

        if (!name.trim() || name.trim().length < 2) {
            setFormError("Brand name must be at least 2 characters");
            return;
        }

        const payload = {
            name: name.trim(),
            imageUrl,
            imagePublicId,
            displayOrder: Number(displayOrder) || 0,
            isActive,
        };

        setSaving(true);
        const result = editingBrand
            ? await updateBrandAction(editingBrand.id, payload)
            : await createBrandAction(payload);
        setSaving(false);

        if (result.success) {
            toast(editingBrand ? "Brand updated successfully" : "Brand created successfully", "success");
            setModalOpen(false);
            window.location.reload();
        } else {
            setFormError(result.message || "Failed to save brand");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const result = await deleteBrandAction(deleteTarget.id);
        setDeleting(false);

        if (result.success) {
            toast("Brand deleted", "success");
            setDeleteTarget(null);
            setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        } else {
            toast(result.message, "error");
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <button
                        onClick={openCreateModal}
                        style={{
                            padding: "10px 24px",
                            borderRadius: "var(--radius-pill)",
                            background: "var(--hero-bg)",
                            color: "var(--hero-text)",
                            border: "none",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "var(--shadow-sm)"
                        }}
                    >
                        + Add New Brand
                    </button>
                </div>
            </div>

            <div className="saas-card saas-table-container" style={{ padding: 0, overflow: "hidden" }}>
                {brands.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>No brands yet</div>
                        <div style={{ marginTop: 4, color: "var(--text-secondary)", fontSize: 14 }}>Create your first brand to display on the storefront</div>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="saas-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 80 }}>Logo / Image</th>
                                    <th>Name & Slug</th>
                                    <th style={{ textAlign: "center", width: 140 }}>Position / Order</th>
                                    <th style={{ textAlign: "center" }}>Status</th>
                                    <th style={{ textAlign: "center" }}>Products</th>
                                    <th style={{ textAlign: "right", width: 160 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map((brand, idx) => (
                                    <tr key={brand.id}>
                                        <td>
                                            {brand.imageUrl ? (
                                                <div style={{ width: 44, height: 33, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border-default)", background: "var(--bg-canvas)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <img src={brand.imageUrl} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                </div>
                                            ) : (
                                                <div style={{ width: 44, height: 33, borderRadius: 6, background: "var(--bg-canvas)", border: "1px dashed var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>
                                                    NO IMG
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{brand.name}</div>
                                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>slug: {brand.slug}</div>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                                <button
                                                    type="button"
                                                    disabled={reordering || idx === 0}
                                                    onClick={() => moveBrand(idx, -1)}
                                                    title="Move Up (Higher priority)"
                                                    style={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: 4,
                                                        border: "1px solid var(--border-default)",
                                                        background: "var(--bg-card)",
                                                        cursor: idx === 0 || reordering ? "not-allowed" : "pointer",
                                                        opacity: idx === 0 || reordering ? 0.3 : 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: "bold",
                                                        fontSize: 11,
                                                        color: "var(--text-primary)"
                                                    }}
                                                >
                                                    ▲
                                                </button>
                                                <span style={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    padding: "2px 8px",
                                                    borderRadius: 12,
                                                    background: brand.displayOrder === 1 ? "rgba(59, 130, 246, 0.12)" : "var(--bg-canvas)",
                                                    color: brand.displayOrder === 1 ? "#2563eb" : "var(--text-primary)",
                                                    border: brand.displayOrder === 1 ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid var(--border-default)"
                                                }}>
                                                    #{brand.displayOrder || idx + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={reordering || idx === brands.length - 1}
                                                    onClick={() => moveBrand(idx, 1)}
                                                    title="Move Down (Lower priority)"
                                                    style={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: 4,
                                                        border: "1px solid var(--border-default)",
                                                        background: "var(--bg-card)",
                                                        cursor: idx === brands.length - 1 || reordering ? "not-allowed" : "pointer",
                                                        opacity: idx === brands.length - 1 || reordering ? 0.3 : 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: "bold",
                                                        fontSize: 11,
                                                        color: "var(--text-primary)"
                                                    }}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span className={`badge ${brand.isActive ? "badge-active" : "badge-archived"}`}>
                                                {brand.isActive ? "Active" : "Hidden"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                                                {brand._count.products} Products
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <button
                                                    onClick={() => openEditModal(brand)}
                                                    style={{
                                                        padding: "6px 14px",
                                                        borderRadius: "var(--radius-pill)",
                                                        border: "1px solid var(--border-default)",
                                                        background: "var(--bg-card)",
                                                        color: "var(--text-primary)",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(brand)}
                                                    style={{
                                                        padding: "6px 14px",
                                                        borderRadius: "var(--radius-pill)",
                                                        border: "1px solid var(--danger-soft)",
                                                        background: "var(--danger-soft)",
                                                        color: "var(--danger)",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Brand Edit/Create Modal */}
            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div className="responsive-modal" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 540, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-drawer)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                                {editingBrand ? "Edit Brand" : "Create New Brand"}
                            </h2>
                            <button onClick={() => setModalOpen(false)} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-secondary)", cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxHeight: "75vh", overflowY: "auto" }}>
                            {formError && (
                                <div style={{ padding: "10px 14px", background: "var(--danger-soft)", border: "1px solid rgba(255,59,48,0.2)", borderRadius: "var(--radius-md)", color: "var(--danger)", fontSize: 13, fontWeight: 500 }}>
                                    {formError}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                                    Brand Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Kajaria, Simpolo, Grohe..."
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid var(--border-strong)",
                                        borderRadius: "var(--radius-md)",
                                        fontSize: 14,
                                        outline: "none",
                                        background: "var(--bg-canvas)",
                                        color: "var(--text-primary)",
                                    }}
                                />
                            </div>

                            {/* Image Uploader */}
                            <BrandImageUploader
                                currentImage={imageUrl}
                                currentPublicId={imagePublicId}
                                onImageChange={(url, publicId) => {
                                    setImageUrl(url);
                                    setImagePublicId(publicId);
                                }}
                            />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {/* Display Order */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                                        Order Number / Position *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={displayOrder}
                                        onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                                        placeholder="e.g. 1 for 1st position"
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            border: "1px solid var(--border-strong)",
                                            borderRadius: "var(--radius-md)",
                                            fontSize: 14,
                                            outline: "none",
                                            background: "var(--bg-canvas)",
                                            color: "var(--text-primary)",
                                        }}
                                    />
                                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                                        1 = 1st position on home page & brands page
                                    </span>
                                </div>

                                {/* Active Toggle */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                                        Visibility
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            style={{ width: 18, height: 18, accentColor: "var(--hero-bg)" }}
                                        />
                                        <span>Show on Storefront</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-default)", background: "var(--bg-canvas)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                style={{ padding: "10px 24px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            >
                                Cancel
                            </button>
                            <LoadingButton
                                loading={saving}
                                onClick={handleSave}
                                style={{ padding: "10px 24px", borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                            >
                                {editingBrand ? "Save Changes" : "Create Brand"}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Brand"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name}"? ${deleteTarget._count.products > 0
                            ? `This brand has ${deleteTarget._count.products} product(s) — you must reassign them first.`
                            : "This action cannot be undone and will delete the associated logo asset."
                        }`
                        : ""
                }
                confirmLabel="Delete Brand"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}
