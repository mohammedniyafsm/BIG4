"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { BannerUploader } from "@/components/offers/BannerUploader";
import { useToast } from "@/components/ui/ToastProvider";
import { createOfferAction, updateOfferAction } from "@/actions/offer.actions";
import { offerSchema } from "@/validations/offer.validation";
import type { Offer } from "@prisma/client";

interface OfferFormProps {
    initialData?: Offer | null;
}

export function OfferForm({ initialData }: OfferFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const isEdit = !!initialData;

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form fields
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [discountText, setDiscountText] = useState(initialData?.discountText ?? "");
    const [bannerImage, setBannerImage] = useState(initialData?.bannerImage ?? "");
    const [bannerImageMobile, setBannerImageMobile] = useState(initialData?.bannerImageMobile ?? "");
    const [linkType, setLinkType] = useState(initialData?.linkType ?? "NONE");
    const [linkValue, setLinkValue] = useState(initialData?.linkValue ?? "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    
    // Dates
    const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "");
    const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        const rawData = {
            title: title.trim(),
            description: description.trim() || null,
            discountText: discountText.trim() || null,
            bannerImage,
            bannerImageMobile: bannerImageMobile || null,
            linkType,
            linkValue: linkType !== "NONE" ? linkValue.trim() : null,
            isActive,
            startDate: startDate || null,
            endDate: endDate || null,
            displayOrder: initialData?.displayOrder ?? 0,
        };

        const parsed = offerSchema.safeParse(rawData);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            setErrors(fieldErrors as Record<string, string[]>);
            const firstErrorField = Object.keys(fieldErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.focus();
            }
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.set("title", rawData.title);
        if (rawData.description) formData.set("description", rawData.description);
        if (rawData.discountText) formData.set("discountText", rawData.discountText);
        formData.set("bannerImage", rawData.bannerImage);
        if (rawData.bannerImageMobile) formData.set("bannerImageMobile", rawData.bannerImageMobile);
        formData.set("linkType", rawData.linkType);
        if (rawData.linkValue) formData.set("linkValue", rawData.linkValue);
        formData.set("isActive", rawData.isActive.toString());
        formData.set("displayOrder", rawData.displayOrder.toString());
        if (rawData.startDate) formData.set("startDate", rawData.startDate);
        if (rawData.endDate) formData.set("endDate", rawData.endDate);

        const result = isEdit
            ? await updateOfferAction(initialData.id, formData)
            : await createOfferAction(formData);

        setLoading(false);

        if (result.success) {
            toast(result.message, "success");
            router.push("/admin/offers");
            router.refresh();
        } else {
            if (result.errors) {
                setErrors(result.errors);
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
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Banner Content</h3>
                        
                        <div>
                            <label htmlFor="title" style={labelStyle}>Offer Title *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Summer Tile Sale"
                                style={getInputStyle(!!errors.title)}
                                required
                            />
                            {errors.title && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.title[0]}</span>}
                        </div>

                        <div>
                            <label htmlFor="discountText" style={labelStyle}>Discount Badge Text</label>
                            <input
                                id="discountText"
                                type="text"
                                value={discountText}
                                onChange={(e) => setDiscountText(e.target.value)}
                                placeholder='e.g. "Up to 20% Off" or "Flat ₹500 Off"'
                                style={getInputStyle(!!errors.discountText)}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" style={labelStyle}>Description (Optional)</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Any additional terms or details..."
                                rows={3}
                                style={{ ...getInputStyle(!!errors.description), resize: "vertical" }}
                            />
                        </div>
                    </div>

                    {/* Routing/Action Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Click Action</h3>
                        
                        <div>
                            <label htmlFor="linkType" style={labelStyle}>Where should the banner link to?</label>
                            <select
                                id="linkType"
                                value={linkType}
                                onChange={(e) => setLinkType(e.target.value as any)}
                                style={{ ...getInputStyle(false), paddingRight: 32, appearance: "none" }}
                            >
                                <option value="NONE">No link (Not Clickable)</option>
                                <option value="WHATSAPP">WhatsApp Message</option>
                                <option value="EXTERNAL_URL">External Website</option>
                                <option value="PRODUCT">Specific Product ID/Slug</option>
                                <option value="CATEGORY">Specific Category Slug</option>
                            </select>
                        </div>

                        {linkType !== "NONE" && (
                            <div>
                                <label htmlFor="linkValue" style={labelStyle}>
                                    {linkType === "WHATSAPP" ? "WhatsApp Number" :
                                     linkType === "EXTERNAL_URL" ? "URL (https://...)" :
                                     linkType === "PRODUCT" ? "Product Slug or ID" :
                                     "Category Slug"} *
                                </label>
                                <input
                                    id="linkValue"
                                    type="text"
                                    value={linkValue}
                                    onChange={(e) => setLinkValue(e.target.value)}
                                    placeholder={
                                        linkType === "WHATSAPP" ? "e.g. 919876543210" :
                                        linkType === "EXTERNAL_URL" ? "https://example.com" :
                                        "e.g. premium-floor-tile"
                                    }
                                    style={getInputStyle(!!errors.linkValue)}
                                    required={(linkType as string) !== "NONE"}
                                />
                                {errors.linkValue && <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.linkValue[0]}</span>}
                                
                                {linkType === "WHATSAPP" && (
                                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
                                        Format: Country code + Number without spaces or + sign. (e.g. 919876543210 for India)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Scheduling Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Scheduling & Status</h3>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                style={{ width: 18, height: 18, accentColor: "var(--hero-bg)" }}
                            />
                            <label htmlFor="isActive" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", cursor: "pointer" }}>
                                Banner is Active
                            </label>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, paddingLeft: 30 }}>
                            If unchecked, this banner will never be shown on the storefront, regardless of the dates below.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                            <div>
                                <label htmlFor="startDate" style={labelStyle}>Start Date (Optional)</label>
                                <input
                                    id="startDate"
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={getInputStyle(false)}
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" style={labelStyle}>End Date (Optional)</label>
                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={getInputStyle(false)}
                                />
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                            The banner will only be shown during this window. If left empty, it shows indefinitely.
                        </p>
                    </div>
                </div>

                {/* Right Column — Image + Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Image Upload */}
                    <div className="saas-card">
                        <BannerUploader
                            currentImage={bannerImage}
                            currentImageMobile={bannerImageMobile}
                            onImageChange={(url) => {
                                setBannerImage(url);
                                if (errors.bannerImage) {
                                    setErrors(prev => ({ ...prev, bannerImage: [] }));
                                }
                            }}
                            onMobileImageChange={(url) => setBannerImageMobile(url)}
                            onUploadStart={() => setUploading(true)}
                            onUploadEnd={() => setUploading(false)}
                        />
                        {errors.bannerImage && <span id="images-error" style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--danger)" }}>{errors.bannerImage[0]}</span>}
                    </div>

                    {/* Actions (Desktop) */}
                    <div className="saas-card hide-on-mobile" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            disabled={uploading}
                            style={{ width: "100%", borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                        >
                            {isEdit ? "Update Offer" : "Create Offer"}
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
