"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/ToastProvider";

interface BrandImageUploaderProps {
    currentImage?: string | null;
    currentPublicId?: string | null;
    onImageChange: (url: string | null, publicId: string | null) => void;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (err) => reject(err));
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
    });
}

/**
 * Renders pixel crop to canvas preserving source MIME type for transparency.
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area, mimeType: string = "image/png"): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Clear background for PNG/WebP transparency support
    if (mimeType === "image/png" || mimeType === "image/webp") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    const format = ALLOWED_TYPES.includes(mimeType) ? mimeType : "image/png";
    const ext = format === "image/jpeg" ? "jpg" : format.split("/")[1] || "png";

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(new File([blob!], `brand-cropped.${ext}`, { type: format }));
            },
            format,
            0.92
        );
    });
}

/**
 * Compress image while respecting MIME type and enforcing a 0.4MB size ceiling.
 */
async function compressImage(file: File): Promise<File> {
    const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";
    const options = {
        maxSizeMB: 0.4, // Max 400KB limit
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: isJpeg ? ("image/jpeg" as const) : (file.type as any),
    };
    return imageCompression(file, options);
}

export function BrandImageUploader({
    currentImage,
    currentPublicId,
    onImageChange,
    onUploadStart,
    onUploadEnd,
}: BrandImageUploaderProps) {
    const { toast } = useToast();
    const [image, setImage] = useState<string | null>(currentImage || null);
    const [publicId, setPublicId] = useState<string | null>(currentPublicId || null);

    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [originalMime, setOriginalMime] = useState<string>("image/png");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const uploadFile = async (file: File): Promise<{ url: string; publicId: string } | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "big4-brands");

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok || !data.success) return null;

        return { url: data.data.url, publicId: data.data.publicId };
    };

    const handleFiles = (files: FileList | File[]) => {
        const fileArr = Array.from(files);
        if (fileArr.length === 0) return;

        const file = fileArr[0];
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast(`"${file.name}" is not a valid image (PNG, JPG, WebP only)`, "error");
            return;
        }

        if (file.size > MAX_SIZE) {
            toast(`"${file.name}" exceeds maximum 5MB size limit`, "error");
            return;
        }

        setOriginalMime(file.type);

        const reader = new FileReader();
        reader.onload = (e) => {
            setCropSrc(e.target?.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
        };
        reader.readAsDataURL(file);
    };

    const handleCropConfirm = async () => {
        if (!cropSrc || !croppedArea) return;

        setUploading(true);
        onUploadStart?.();

        try {
            const croppedFile = await getCroppedImg(cropSrc, croppedArea, originalMime);
            let processedFile = croppedFile;

            try {
                processedFile = await compressImage(croppedFile);
            } catch {
                // Ignore compression fallback
            }

            const uploaded = await uploadFile(processedFile);

            if (uploaded) {
                setImage(uploaded.url);
                setPublicId(uploaded.publicId);
                onImageChange(uploaded.url, uploaded.publicId);
                toast("Brand image uploaded successfully", "success");
                setCropSrc(null);
            } else {
                toast("Failed to upload brand image to server", "error");
            }
        } catch (error) {
            toast("Error processing brand image", "error");
        } finally {
            setUploading(false);
            onUploadEnd?.();
        }
    };

    const handleRemove = () => {
        setImage(null);
        setPublicId(null);
        onImageChange(null, null);
    };

    return (
        <div>
            <div style={{ marginBottom: 6 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    Brand Image / Logo (4:3 Aspect Ratio)
                </label>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
                    💡 Note: This image displays as a full card on /brands and as a logo on the home page — square-ish, high-contrast logos or clean brand graphics work best in both.
                </p>
            </div>

            {image ? (
                <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-default)", aspectRatio: "4/3", maxWidth: 280, background: "var(--bg-canvas)" }}>
                    <img src={image} alt="Brand Logo Preview" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={{
                            position: "absolute", top: 8, right: 8, width: 28, height: 28,
                            borderRadius: "50%", border: "none", background: "var(--overlay-heavy)",
                            color: "var(--text-inverse)", fontSize: 16, cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                        }}
                        title="Remove image"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (!uploading) handleFiles(e.dataTransfer.files);
                    }}
                    style={{
                        border: `2px dashed ${dragOver ? "var(--hero-bg)" : "var(--border-strong)"}`,
                        borderRadius: 12, padding: "28px 20px", textAlign: "center",
                        cursor: uploading ? "wait" : "pointer", background: dragOver ? "var(--skeleton-base)" : "var(--bg-hover)",
                        aspectRatio: "4/3", maxWidth: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                    }}
                >
                    {uploading ? (
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Uploading image…</div>
                    ) : (
                        <div>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>🏷️</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Upload Brand Image / Logo</div>
                            <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 2 }}>PNG, JPG, WebP (Max 5MB)</div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                    e.target.value = "";
                }}
            />

            {/* ── Crop Modal ── */}
            {cropSrc && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div className="responsive-modal" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 600, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-drawer)" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                                Crop Brand Logo / Card (4:3 Ratio)
                            </h3>
                            <button onClick={() => setCropSrc(null)} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-secondary)", cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ position: "relative", width: "100%", height: "50vh", maxHeight: 400, background: "#111111" }}>
                            <Cropper
                                image={cropSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "var(--bg-canvas)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Zoom</span>
                                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: 140, accentColor: "var(--hero-bg)" }} />
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={() => setCropSrc(null)} style={{ padding: "8px 18px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button type="button" onClick={handleCropConfirm} disabled={uploading} style={{ padding: "8px 18px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--hero-bg)", color: "var(--hero-text)", fontSize: 13, fontWeight: 600, cursor: uploading ? "wait" : "pointer" }}>
                                    {uploading ? "Uploading..." : "Crop & Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
