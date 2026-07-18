"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import {
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
} from "@/actions/category.actions";

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
}

interface CategoryListClientProps {
    categories: CategoryItem[];
}

/**
 * Client component for the categories page.
 * Handles create, inline rename, and delete with confirmation.
 */
export function CategoryListClient({ categories: initialCategories }: CategoryListClientProps) {
    const { toast } = useToast();
    const [categories, setCategories] = useState(initialCategories);

    // Create
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    // Edit
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [saving, setSaving] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Create handler
    const handleCreate = async () => {
        if (!newName.trim()) return toast("Name is required", "error");
        setCreating(true);
        const result = await createCategoryAction(newName.trim());
        setCreating(false);

        if (result.success) {
            toast("Category created", "success");
            setNewName("");
            // Optimistic: add to list (will get real data on refresh)
            window.location.reload();
        } else {
            toast(result.message, "error");
        }
    };

    // Update handler
    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return toast("Name is required", "error");
        setSaving(true);
        const result = await updateCategoryAction(id, editName.trim());
        setSaving(false);

        if (result.success) {
            toast("Category updated", "success");
            setEditId(null);
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c))
            );
        } else {
            toast(result.message, "error");
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const result = await deleteCategoryAction(deleteTarget.id);
        setDeleting(false);

        if (result.success) {
            toast("Category deleted", "success");
            setDeleteTarget(null);
            setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        } else {
            toast(result.message, "error");
            setDeleteTarget(null);
        }
    };

    return (
        <>
            {/* Create new category */}
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 24,
                }}
            >
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="New category name…"
                    style={{
                        flex: 1,
                        maxWidth: 400,
                        padding: "10px 14px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 14,
                        outline: "none",
                        background: "#ffffff",
                        color: "#111827",
                    }}
                />
                <LoadingButton loading={creating} onClick={handleCreate}>
                    + Add Category
                </LoadingButton>
            </div>

            {/* Category list */}
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                }}
            >
                {categories.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color: "#6b7280",
                            fontSize: 14,
                        }}
                    >
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                        <div style={{ fontWeight: 600, color: "#374151" }}>No categories yet</div>
                        <div style={{ marginTop: 4 }}>Create your first category above</div>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                                <th style={thStyle}>Name</th>
                                <th style={{ ...thStyle, textAlign: "center" }}>Products</th>
                                <th style={{ ...thStyle, textAlign: "center", width: 180 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    style={{ borderBottom: "1px solid #f3f4f6" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    {/* Name (inline editable) */}
                                    <td style={tdStyle}>
                                        {editId === cat.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleUpdate(cat.id);
                                                    if (e.key === "Escape") setEditId(null);
                                                }}
                                                autoFocus
                                                style={{
                                                    padding: "6px 10px",
                                                    border: "2px solid #2563eb",
                                                    borderRadius: 6,
                                                    fontSize: 14,
                                                    outline: "none",
                                                    width: "100%",
                                                    maxWidth: 300,
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 600, color: "#111827" }}>
                                                {cat.name}
                                            </span>
                                        )}
                                    </td>

                                    {/* Product count */}
                                    <td style={{ ...tdStyle, textAlign: "center" }}>
                                        <span
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: cat._count.products > 0 ? "#2563eb" : "#9ca3af",
                                            }}
                                        >
                                            {cat._count.products}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ ...tdStyle, textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            {editId === cat.id ? (
                                                <>
                                                    <LoadingButton
                                                        variant="primary"
                                                        loading={saving}
                                                        onClick={() => handleUpdate(cat.id)}
                                                        style={{ padding: "4px 12px", fontSize: 12 }}
                                                    >
                                                        Save
                                                    </LoadingButton>
                                                    <button
                                                        onClick={() => setEditId(null)}
                                                        style={{
                                                            padding: "4px 12px",
                                                            fontSize: 12,
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: 6,
                                                            background: "#ffffff",
                                                            color: "#374151",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditId(cat.id);
                                                            setEditName(cat.name);
                                                        }}
                                                        style={actionBtnStyle}
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(cat)}
                                                        style={{
                                                            ...actionBtnStyle,
                                                            color: "#ef4444",
                                                            borderColor: "#fecaca",
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Category"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name}"? ${deleteTarget._count.products > 0
                            ? `This category has ${deleteTarget._count.products} product(s) — you must reassign them first.`
                            : "This action cannot be undone."
                        }`
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

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
};

const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
};

const actionBtnStyle: React.CSSProperties = {
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 500,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    transition: "all 150ms ease",
};
