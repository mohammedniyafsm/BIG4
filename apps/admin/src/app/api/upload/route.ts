import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "@/lib/auth";
import { getAccessToken, getRefreshToken } from "@/lib/cookies";
import { uploadImage } from "@/lib/cloudinary";

/**
 * POST /api/upload
 * 
 * Authenticated image upload endpoint.
 * Accepts multipart/form-data with a "file" field.
 * Returns the Cloudinary secure URL.
 */
export async function POST(req: NextRequest) {
    try {
        let accessToken = await getAccessToken();
        let authPayload = accessToken ? verifyAccessToken(accessToken) : null;
        let newAccessTokenSet = false;

        // If access token is invalid/expired, try refresh token exchange
        if (!authPayload) {
            const refreshToken = await getRefreshToken();
            const refreshPayload = refreshToken ? verifyRefreshToken(refreshToken) : null;

            if (refreshPayload) {
                // Re-mint a fresh access token using existing generateAccessToken function
                const newAccessToken = generateAccessToken({
                    userId: refreshPayload.userId,
                    email: "admin@big4.com", // Payload standard
                });
                accessToken = newAccessToken;
                authPayload = verifyAccessToken(newAccessToken);
                newAccessTokenSet = true;
            }
        }

        if (!authPayload) {
            return Response.json(
                { success: false, message: "Authentication required", data: null },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json(
                { success: false, message: "No file provided", data: null },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return Response.json(
                { success: false, message: "Only image files are allowed", data: null },
                { status: 400 }
            );
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                { success: false, message: "Image must be under 5MB", data: null },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadImage(file);

        if (!result) {
            return Response.json(
                { success: false, message: "Upload failed. Please try again.", data: null },
                { status: 500 }
            );
        }

        const res = NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            data: { url: result.url, publicId: result.publicId },
        });

        if (newAccessTokenSet && accessToken) {
            res.cookies.set("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 15 * 60,
            });
        }

        return res;
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { success: false, message: "Something went wrong", data: null },
            { status: 500 }
        );
    }
}
