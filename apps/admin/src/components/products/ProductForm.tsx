"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ImageUploader, type UploadedImage } from "@/components/ui/ImageUploader";
import { useToast } from "@/components/ui/ToastProvider";
import { createProductAction, updateProductAction } from "@/actions/product.actions";
import { createProductSchema, updateProductSchema } from "@/validations/product.validation";

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
    featured: boolean;
    priceUnit: "PER_SQM" | "PER_PIECE" | "PER_SET" | "PER_BOX";
    salePrice: number | null;
    color: string | null;
    material: string | null;
    finish: string | null;
    size: string | null;
    coveragePerBox: number | null;
    highlights: string[];
}

interface ProductFormProps {
    categories: CategoryOption[];
    brands: BrandOption[];
    product?: ProductData;
}

export function ProductForm({ categories, brands, product }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const isEdit = !!product;

    const [errors, setErrors] = useState<Record<string, string[]>>({});
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
    const [featured, setFeatured] = useState(product?.featured ?? false);
    
    // New fields
    const [priceUnit, setPriceUnit] = useState(product?.priceUnit ?? "PER_PIECE");
    const [salePrice, setSalePrice] = useState(product?.salePrice?.toString() ?? "");
    const [color, setColor] = useState(product?.color ?? "");
    const [material, setMaterial] = useState(product?.material ?? "");
    const [finish, setFinish] = useState(product?.finish ?? "");
    const [size, setSize] = useState(product?.size ?? "");
    const [coveragePerBox, setCoveragePerBox] = useState(product?.coveragePerBox?.toString() ?? "");
    const [highlights, setHighlights] = useState<string[]>(product?.highlights ?? []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        const rawData = {
            name: name.trim(),
            sku: sku.trim(),
            description: description.trim() || undefined,
            brandId: brandId || undefined,
            price: price ? parseFloat(price) : -1,
            costPrice: costPrice ? parseFloat(costPrice) : -1,
            stock: stock ? parseInt(stock, 10) : 0,
            imageUrl: images.length > 0 ? images[0].url : undefined,
            images,
            categoryId,
            featured,
            priceUnit,
            salePrice: salePrice ? parseFloat(salePrice) : undefined,
            color: color.trim() || undefined,
            material: material.trim() || undefined,
            finish: finish.trim() || undefined,
            size: size.trim() || undefined,
            coveragePerBox: coveragePerBox ? parseFloat(coveragePerBox) : undefined,
            highlights: highlights.map(h => h.trim()).filter(Boolean),
        };

        const schema = isEdit ? updateProductSchema : createProductSchema;
        const parsed = schema.safeParse(rawData);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            setErrors(fieldErrors as Record<string, string[]>);
            
            // Focus first error field
            const firstErrorField = Object.keys(fieldErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.focus();
            }
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.set("name", rawData.name!);
        formData.set("sku", rawData.sku!);
        if (rawData.description) formData.set("description", rawData.description);
        if (rawData.brandId) formData.set("brandId", rawData.brandId);
        formData.set("price", rawData.price.toString());
        formData.set("costPrice", rawData.costPrice.toString());
        formData.set("stock", rawData.stock.toString());
        formData.set("categoryId", rawData.categoryId!);

        const imageUrl = images.length > 0 ? images[0].url : "";
        formData.set("imageUrl", imageUrl);
        formData.set("images", JSON.stringify(images));
        formData.set("featured", featured ? "true" : "false");
        
        formData.set("priceUnit", rawData.priceUnit);
        if (rawData.salePrice !== undefined) formData.set("salePrice", rawData.salePrice.toString());
        if (rawData.color) formData.set("color", rawData.color);
        if (rawData.material) formData.set("material", rawData.material);
        if (rawData.finish) formData.set("finish", rawData.finish);
        if (rawData.size) formData.set("size", rawData.size);
        if (rawData.coveragePerBox !== undefined) formData.set("coveragePerBox", rawData.coveragePerBox.toString());
        if (rawData.highlights && rawData.highlights.length > 0) formData.set("highlights", JSON.stringify(rawData.highlights));

        const result = isEdit
            ? await updateProductAction(product.id, formData)
            : await createProductAction(formData);

        setLoading(false);

        if (result.success) {
            toast(result.message, "success");
            router.push("/admin/products");
            router.refresh();
        } else {
            if (result.errors) {
                setErrors(result.errors);
                const firstErrorField = Object.keys(result.errors)[0];
                const element = document.getElementById(firstErrorField);
                if (element) element.focus();
            } else {
                toast(result.message, "error");
            }
        }
    };

    const getInputStyle = (hasError: boolean): React.CSSProperties => ({
        width: "100%",
        padding: "10px 14px",
        border: `1px solid ${hasError ? "var(--danger)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        fontSize: 16,
        outline: "none",
        background: "var(--bg-canvas)",
        color: "var(--text-primary)",
        transition: "border-color 150ms ease",
    });

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-primary)",
        marginBottom: 8,
        marginLeft: 4,
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: "relative" }}>
            <div className="product-form-grid">
                {/* Left Column — Main Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Basic Details Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Basic Details</h3>
                        
                        <div>
                            <label htmlFor="name" style={labelStyle}>Product Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Premium Floor Tile 600x600"
                                style={getInputStyle(!!errors.name)}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "name-error" : undefined}
                                required
                            />
                            {errors.name && <span id="name-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.name[0]}</span>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                            <div>
                                <label htmlFor="sku" style={labelStyle}>SKU *</label>
                                <input
                                    id="sku"
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="e.g. TILE-FL-001"
                                    style={getInputStyle(!!errors.sku)}
                                    aria-invalid={!!errors.sku}
                                    aria-describedby={errors.sku ? "sku-error" : undefined}
                                    required
                                />
                                {errors.sku && <span id="sku-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.sku[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="categoryId" style={labelStyle}>Category *</label>
                                <select
                                    id="categoryId"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    style={{ ...getInputStyle(!!errors.categoryId), paddingRight: 32, appearance: "none" }}
                                    aria-invalid={!!errors.categoryId}
                                    aria-describedby={errors.categoryId ? "categoryId-error" : undefined}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <span id="categoryId-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.categoryId[0]}</span>}
                            </div>
                        </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label htmlFor="brandId" style={labelStyle}>Brand *</label>
                            <select
                                id="brandId"
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                                style={{ ...getInputStyle(!!errors.brandId), paddingRight: 32, appearance: "none" }}
                                aria-invalid={!!errors.brandId}
                                aria-describedby={errors.brandId ? "brandId-error" : undefined}
                                required
                            >
                                <option value="">Select brand</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                            {errors.brandId && <span id="brandId-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.brandId[0]}</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", paddingTop: 28 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", ...labelStyle, marginBottom: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    style={{ width: 16, height: 16, cursor: "pointer" }}
                                />
                                Feature on homepage
                            </label>
                        </div>
                    </div>

                        <div>
                            <label htmlFor="description" style={labelStyle}>Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Product details, specifications, features..."
                                rows={4}
                                style={{ ...getInputStyle(!!errors.description), resize: "vertical" }}
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && <span id="description-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.description[0]}</span>}
                        </div>
                    </div>

                    {/* Pricing & Inventory Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Pricing & Inventory</h3>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
                            <div>
                                <label htmlFor="price" style={labelStyle}>Selling Price (₹) *</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input
                                        id="price"
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        style={{ ...getInputStyle(!!errors.price), flex: 2 }}
                                        aria-invalid={!!errors.price}
                                        aria-describedby={errors.price ? "price-error" : undefined}
                                        required
                                    />
                                    <select
                                        id="priceUnit"
                                        value={priceUnit}
                                        onChange={(e) => setPriceUnit(e.target.value as "PER_SQM" | "PER_PIECE" | "PER_SET" | "PER_BOX")}
                                        style={{ ...getInputStyle(false), flex: 1, padding: "10px 8px" }}
                                    >
                                        <option value="PER_PIECE">/ pc</option>
                                        <option value="PER_SQM">/ m²</option>
                                        <option value="PER_BOX">/ box</option>
                                        <option value="PER_SET">/ set</option>
                                    </select>
                                </div>
                                {errors.price && <span id="price-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.price[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="salePrice" style={labelStyle}>Sale Price (₹) <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>(optional)</span></label>
                                <input
                                    id="salePrice"
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    placeholder="0.00"
                                    style={getInputStyle(!!errors.salePrice)}
                                    aria-invalid={!!errors.salePrice}
                                    aria-describedby={errors.salePrice ? "salePrice-error" : undefined}
                                />
                                {errors.salePrice && <span id="salePrice-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.salePrice[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="costPrice" style={labelStyle}>Cost Price (₹) *</label>
                                <input
                                    id="costPrice"
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    placeholder="0.00"
                                    style={getInputStyle(!!errors.costPrice)}
                                    aria-invalid={!!errors.costPrice}
                                    aria-describedby={errors.costPrice ? "costPrice-error" : undefined}
                                    required
                                />
                                {errors.costPrice && <span id="costPrice-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.costPrice[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="stock" style={labelStyle}>Stock</label>
                                <input
                                    id="stock"
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    style={getInputStyle(!!errors.stock)}
                                    aria-invalid={!!errors.stock}
                                    aria-describedby={errors.stock ? "stock-error" : undefined}
                                />
                                {errors.stock && <span id="stock-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.stock[0]}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Product Details Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Product Details</h3>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                            <div>
                                <label htmlFor="color" style={labelStyle}>Color</label>
                                <input id="color" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Matte Black" style={getInputStyle(!!errors.color)} />
                                {errors.color && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.color[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="material" style={labelStyle}>Material</label>
                                <input id="material" type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Ceramic" style={getInputStyle(!!errors.material)} />
                                {errors.material && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.material[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="finish" style={labelStyle}>Finish</label>
                                <input id="finish" type="text" value={finish} onChange={(e) => setFinish(e.target.value)} placeholder="e.g. Glossy" style={getInputStyle(!!errors.finish)} />
                                {errors.finish && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.finish[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="size" style={labelStyle}>Size</label>
                                <input id="size" type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 600x1200mm" style={getInputStyle(!!errors.size)} />
                                {errors.size && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.size[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="coveragePerBox" style={labelStyle}>Coverage per Box (m²)</label>
                                <input id="coveragePerBox" type="number" step="0.001" min="0" value={coveragePerBox} onChange={(e) => setCoveragePerBox(e.target.value)} placeholder="1.44" style={getInputStyle(!!errors.coveragePerBox)} />
                                {errors.coveragePerBox && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.coveragePerBox[0]}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Highlights Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border-default)" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>Key Features / Highlights</h3>
                            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{highlights.length}/10</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {highlights.map((highlight, index) => (
                                <div key={index} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                                        <button type="button" onClick={() => {
                                            if (index === 0) return;
                                            const newH = [...highlights];
                                            [newH[index - 1], newH[index]] = [newH[index], newH[index - 1]];
                                            setHighlights(newH);
                                        }} disabled={index === 0} style={{ padding: 4, background: "transparent", border: "none", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.3 : 1 }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                                        </button>
                                        <button type="button" onClick={() => {
                                            if (index === highlights.length - 1) return;
                                            const newH = [...highlights];
                                            [newH[index], newH[index + 1]] = [newH[index + 1], newH[index]];
                                            setHighlights(newH);
                                        }} disabled={index === highlights.length - 1} style={{ padding: 4, background: "transparent", border: "none", cursor: index === highlights.length - 1 ? "default" : "pointer", opacity: index === highlights.length - 1 ? 0.3 : 1 }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                        </button>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) => {
                                                const newH = [...highlights];
                                                newH[index] = e.target.value.substring(0, 120);
                                                setHighlights(newH);
                                            }}
                                            placeholder="e.g. Scratch resistant and easy to clean"
                                            style={getInputStyle(false)}
                                        />
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                                            <span style={{ fontSize: 11, color: highlight.length >= 120 ? "var(--danger)" : "var(--text-secondary)" }}>{highlight.length}/120</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                                        style={{ padding: "10px", background: "transparent", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                    </button>
                                </div>
                            ))}
                            
                            {highlights.length < 10 && (
                                <button
                                    type="button"
                                    onClick={() => setHighlights([...highlights, ""])}
                                    style={{
                                        padding: "12px", background: "var(--bg-canvas)", border: "1px dashed var(--border-default)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "var(--bg-card)"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "var(--bg-canvas)"}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                    Add Feature Highlight
                                </button>
                            )}
                            {errors.highlights && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.highlights[0]}</span>}
                        </div>
                    </div>
                </div>

                {/* Right Column — Image + Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Image Upload */}
                    <div className="saas-card">
                        <ImageUploader
                            currentImages={images}
                            onImagesChange={(imgs) => {
                                setImages(imgs);
                                if (errors.images) {
                                    setErrors(prev => ({ ...prev, images: [] }));
                                }
                            }}
                            onUploadStart={() => setUploading(true)}
                            onUploadEnd={() => setUploading(false)}
                            maxImages={5}
                        />
                        {errors.images && errors.images.length > 0 && <span id="images-error" style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--danger)" }}>{errors.images[0]}</span>}
                    </div>

                    {/* Actions (Desktop) */}
                    <div className="saas-card hide-on-mobile" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            disabled={uploading}
                            style={{ width: "100%", borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                        >
                            {isEdit ? "Update Product" : "Create Product"}
                        </LoadingButton>

                        <LoadingButton
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                            style={{ width: "100%", borderRadius: "var(--radius-pill)" }}
                        >
                            Cancel
                        </LoadingButton>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div
                className="mobile-only"
                style={{
                    position: "fixed",
                    bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
                    left: 0,
                    right: 0,
                    background: "var(--bg-card)",
                    padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
                    borderTop: "1px solid var(--border-default)",
                    zIndex: 40,
                    boxShadow: "var(--shadow-drawer)",
                }}
            >
                <div style={{ display: "flex", gap: 12 }}>
                    <LoadingButton
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                        style={{ flex: 1, borderRadius: "var(--radius-pill)" }}
                    >
                        Cancel
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        disabled={uploading}
                        style={{ flex: 1, borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                    >
                        {isEdit ? "Save" : "Create"}
                    </LoadingButton>
                </div>
            </div>
        </form>
    );
}
