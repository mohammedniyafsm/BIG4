"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/ToastProvider";

export interface UploadedImage {
    url: string;
    publicId: string;
    displayOrder: number;
}

interface MultiImageUploaderProps {
    currentImages?: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
    maxImages?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// ─── Crop helpers ───────────────────────────────────────

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (err) => reject(err));
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
    });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

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

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(new File([blob!], "cropped.jpg", { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.92
        );
    });
}

// ─── Compression helper ─────────────────────────────────

async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg" as const,
    };
    return imageCompression(file, options);
}

// ─── Component ──────────────────────────────────────────

export function ImageUploader({
    currentImages = [],
    onImagesChange,
    onUploadStart,
    onUploadEnd,
    maxImages = 8,
}: MultiImageUploaderProps) {
    const { toast } = useToast();
    const [images, setImages] = useState<UploadedImage[]>(currentImages);
    const [uploading, setUploading] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // ─── Crop state ─────────────────────────────────────
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [cropQueue, setCropQueue] = useState<File[]>([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    // ─── Upload single file ────────────────────────────
    const uploadFile = async (file: File): Promise<UploadedImage | null> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok || !data.success) return null;

        return {
            url: data.data.url,
            publicId: data.data.publicId,
            displayOrder: 0,
        };
    };

    // ─── Process & upload files (after crop) ────────────
    const processAndUpload = async (files: File[]) => {
        setUploading(true);
        setUploadCount(0);
        onUploadStart?.();

        const uploaded: UploadedImage[] = [];

        for (let i = 0; i < files.length; i++) {
            setUploadCount(i + 1);

            // Compress before uploading
            let processedFile = files[i];
            try {
                toast(`Compressing image ${i + 1}…`, "info");
                processedFile = await compressImage(files[i]);
            } catch {
                // If compression fails, use original
            }

            const result = await uploadFile(processedFile);
            if (result) {
                uploaded.push({ ...result, displayOrder: images.length + uploaded.length });
            } else {
                toast(`Failed to upload image ${i + 1}`, "error");
            }
        }

        const newImages = [...images, ...uploaded];
        setImages(newImages);
        onImagesChange(newImages);

        setUploading(false);
        setUploadCount(0);
        onUploadEnd?.();

        if (uploaded.length > 0) {
            toast(`${uploaded.length} image(s) uploaded`, "success");
        }
    };

    // ─── Handle file selection → open crop ──────────────
    const handleFiles = async (files: FileList | File[]) => {
        const fileArr = Array.from(files);

        const remaining = maxImages - images.length;
        if (remaining <= 0) {
            toast(`Maximum ${maxImages} images allowed`, "error");
            return;
        }

        const toProcess = fileArr.slice(0, remaining);

        for (const file of toProcess) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast(`"${file.name}" is not a valid image (JPG, PNG, WebP only)`, "error");
                return;
            }
            if (file.size > MAX_SIZE) {
                toast(`"${file.name}" exceeds 5MB limit`, "error");
                return;
            }
        }

        // Open cropper for the first file, queue the rest
        const [first, ...rest] = toProcess;
        setCropQueue(rest);
        openCropper(first);
    };

    const openCropper = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCropSrc(e.target?.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
        };
        reader.readAsDataURL(file);
    };

    // ─── Crop confirm ───────────────────────────────────
    const handleCropConfirm = async () => {
        if (!cropSrc || !croppedArea) return;

        const croppedFile = await getCroppedImg(cropSrc, croppedArea);
        setCropSrc(null);

        // If there are more files in queue, open next cropper
        if (cropQueue.length > 0) {
            const [next, ...rest] = cropQueue;
            setCropQueue(rest);

            // Process the just-cropped file immediately
            await processAndUpload([croppedFile]);

            // Open cropper for the next file
            openCropper(next);
        } else {
            // Last file — process and upload
            await processAndUpload([croppedFile]);
        }
    };

    // ─── Skip crop (upload original) ────────────────────
    const handleCropSkip = async () => {
        if (!cropSrc) return;

        // Convert data URL back to File
        const res = await fetch(cropSrc);
        const blob = await res.blob();
        const file = new File([blob], "original.jpg", { type: "image/jpeg" });

        setCropSrc(null);

        if (cropQueue.length > 0) {
            const [next, ...rest] = cropQueue;
            setCropQueue(rest);
            await processAndUpload([file]);
            openCropper(next);
        } else {
            await processAndUpload([file]);
        }
    };

    const handleCropCancel = () => {
        setCropSrc(null);
        setCropQueue([]);
    };

    const removeImage = (idx: number) => {
        const updated = images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, displayOrder: i }));
        setImages(updated);
        onImagesChange(updated);
    };

    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 6,
                }}
            >
                Product Images {images.length > 0 && `(${images.length}/${maxImages})`}
            </label>

            {/* Image grid */}
            {images.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                        gap: 8,
                        marginBottom: 10,
                    }}
                >
                    {images.map((img, idx) => (
                        <div
                            key={img.publicId || idx}
                            style={{
                                position: "relative",
                                borderRadius: 8,
                                overflow: "hidden",
                                border: "1px solid #e5e7eb",
                                aspectRatio: "1",
                            }}
                        >
                            <img
                                src={img.url}
                                alt={`Product ${idx + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "";
                                }}
                            />
                            {idx === 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 4,
                                        left: 4,
                                        fontSize: 9,
                                        fontWeight: 700,
                                        background: "#2563eb",
                                        color: "#fff",
                                        padding: "1px 6px",
                                        borderRadius: 4,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Main
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    lineHeight: 1,
                                }}
                                title="Remove"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop zone */}
            {images.length < maxImages && (
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
                        border: `2px dashed ${dragOver ? "#2563eb" : "#d1d5db"}`,
                        borderRadius: 12,
                        padding: "24px 20px",
                        textAlign: "center",
                        cursor: uploading ? "wait" : "pointer",
                        transition: "all 200ms ease",
                        background: dragOver ? "#eff6ff" : "#f9fafb",
                        position: "relative",
                    }}
                >
                    {uploading ? (
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#2563eb" }}>
                            Uploading {uploadCount}…
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                                Click or drag & drop to upload
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                                PNG, JPG, WebP — max 5MB each, up to {maxImages} images
                            </div>
                            <div style={{ fontSize: 10, color: "#b0b8c4", marginTop: 4 }}>
                                ✂️ Crop &amp; auto-compress before upload
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                    e.target.value = "";
                }}
            />

            {/* ─── Crop Modal ──────────────────────────── */}
            {cropSrc && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Crop area */}
                    <div style={{ position: "relative", flex: 1 }}>
                        <Cropper
                            image={cropSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    {/* Zoom slider */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            padding: "12px 24px",
                            background: "rgba(0,0,0,0.7)",
                        }}
                    >
                        <span style={{ color: "#9ca3af", fontSize: 12 * 1 }}>🔍</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{ width: 200, accentColor: "#2563eb" }}
                        />
                        <span style={{ color: "#9ca3af", fontSize: 12, minWidth: 40 }}>
                            {zoom.toFixed(1)}x
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 12,
                            padding: "16px 24px",
                            background: "#111827",
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleCropCancel}
                            style={{
                                padding: "10px 24px",
                                borderRadius: 8,
                                border: "1px solid #374151",
                                background: "transparent",
                                color: "#9ca3af",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCropSkip}
                            style={{
                                padding: "10px 24px",
                                borderRadius: 8,
                                border: "1px solid #374151",
                                background: "transparent",
                                color: "#d1d5db",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            Skip Crop
                        </button>
                        <button
                            type="button"
                            onClick={handleCropConfirm}
                            style={{
                                padding: "10px 32px",
                                borderRadius: 8,
                                border: "none",
                                background: "#2563eb",
                                color: "#ffffff",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            ✂️ Crop & Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
