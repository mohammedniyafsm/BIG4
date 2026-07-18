"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ImageUploader, type UploadedImage } from "@/components/ui/ImageUploader";
import { useToast } from "@/components/ui/ToastProvider";
import { createProductAction, updateProductAction } from "@/actions/product.actions";

interface CategoryOption {
    id: string;
    name: string;
}

interface BrandOption {
    id: string;
    name: string;
}

interface ProductImageData {
    id: string;
    url: string;
    publicId: string;
    displayOrder: number;
}

interface ProductData {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    brandId: string | null;
    price: number;
    costPrice: number;
    stock: number;
    imageUrl: string | null;
    images: ProductImageData[];
    categoryId: string;
    isActive: boolean;
}

interface ProductFormProps {
    categories: CategoryOption[];
    brands: BrandOption[];
    product?: ProductData;
}

/**
 * Reusable product form — used for both Create and Edit.
 */
export function ProductForm({ categories, brands, product }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const isEdit = !!product;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<UploadedImage[]>(
        product?.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            displayOrder: img.displayOrder,
        })) ?? []
    );

    // Form fields
    const [name, setName] = useState(product?.name ?? "");
    const [sku, setSku] = useState(product?.sku ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [brandId, setBrandId] = useState(product?.brandId ?? "");
    const [price, setPrice] = useState(product?.price?.toString() ?? "");
    const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() ?? "");
    const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
    const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!name.trim()) return toast("Product name is required", "error");
        if (!sku.trim()) return toast("SKU is required", "error");
        if (!categoryId) return toast("Please select a category", "error");
        if (!price || parseFloat(price) < 0) return toast("Price must be 0 or greater", "error");
        if (!costPrice || parseFloat(costPrice) < 0) return toast("Cost price must be 0 or greater", "error");

        setLoading(true);

        const formData = new FormData();
        formData.set("name", name.trim());
        formData.set("sku", sku.trim());
        formData.set("description", description.trim());
        formData.set("brandId", brandId);
        formData.set("price", price);
        formData.set("costPrice", costPrice);
        formData.set("stock", stock || "0");
        formData.set("categoryId", categoryId);

        // Set thumbnail + images
        const imageUrl = images.length > 0 ? images[0].url : "";
        formData.set("imageUrl", imageUrl);
        formData.set("images", JSON.stringify(images));

        const result = isEdit
            ? await updateProductAction(product.id, formData)
            : await createProductAction(formData);

        setLoading(false);

        if (result.success) {
            toast(result.message, "success");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast(result.message, "error");
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        outline: "none",
        background: "#ffffff",
        color: "#111827",
        transition: "border-color 150ms ease",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#111827",
        marginBottom: 6,
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
                {/* Left Column — Main Fields */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    {/* Name */}
                    <div>
                        <label style={labelStyle}>Product Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Premium Floor Tile 600x600"
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* SKU + Category row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>SKU *</label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="e.g. TILE-FL-001"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Category *</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Brand */}
                    <div>
                        <label style={labelStyle}>Brand</label>
                        <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">No brand</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product details, specifications, features..."
                            rows={4}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    {/* Price + Cost Price + Stock row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Selling Price (₹) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Cost Price (₹) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                                placeholder="0.00"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Stock</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column — Image + Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Image Upload */}
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            padding: 20,
                        }}
                    >
                        <ImageUploader
                            currentImages={images}
                            onImagesChange={(imgs) => setImages(imgs)}
                            onUploadStart={() => setUploading(true)}
                            onUploadEnd={() => setUploading(false)}
                        />
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            padding: 20,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            disabled={uploading}
                            style={{ width: "100%" }}
                        >
                            {isEdit ? "Update Product" : "Create Product"}
                        </LoadingButton>

                        <LoadingButton
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                            style={{ width: "100%" }}
                        >
                            Cancel
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </form>
    );
}
