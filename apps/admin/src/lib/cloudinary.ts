import { env } from "@/config/env";

/**
 * Cloudinary upload helper.
 *
 * Uses the Cloudinary REST Upload API directly (no SDK dependency).
 * Images are uploaded to the "big4-products" folder.
 */

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Generate a signature for Cloudinary signed uploads.
 */
async function generateSignature(params: Record<string, string>): Promise<string> {
    // Sort params alphabetically and join as key=value&key=value
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map((k) => `${k}=${params[k]}`).join("&") + env.CLOUDINARY_API_SECRET;

    // SHA-1 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Upload an image to Cloudinary.
 *
 * @param file - The File or Blob to upload
 * @returns The secure URL of the uploaded image, or null on failure
 */
export async function uploadImage(file: File): Promise<{ url: string; publicId: string } | null> {
    try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const folder = "big4-products";

        const params: Record<string, string> = {
            folder,
            timestamp,
        };

        const signature = await generateSignature(params);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", env.CLOUDINARY_API_KEY);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Cloudinary upload failed:", errorBody);
            return null;
        }

        const data = await response.json();
        return {
            url: data.secure_url as string,
            publicId: data.public_id as string,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

/**
 * Delete an image from Cloudinary.
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const params: Record<string, string> = {
            public_id: publicId,
            timestamp,
        };

        const signature = await generateSignature(params);

        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", env.CLOUDINARY_API_KEY);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
            { method: "POST", body: formData }
        );

        return response.ok;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
}
