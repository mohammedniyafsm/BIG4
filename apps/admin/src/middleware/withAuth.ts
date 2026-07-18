import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { getAccessToken } from "@/lib/cookies";
import { errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";
import type { AccessTokenPayload } from "@/types/auth.types";

/**
 * Higher-order function that protects an API route with JWT authentication.
 *
 * Usage:
 * ```ts
 * export const GET = withAuth(async (req, user) => {
 *   // `user` is the verified JWT payload (userId, email)
 *   return successResponse("Protected data", { ... });
 * });
 * ```
 */
export function withAuth(
    handler: (
        req: NextRequest,
        user: AccessTokenPayload
    ) => Promise<Response>
) {
    return async (req: NextRequest) => {
        try {
            const token = await getAccessToken();

            if (!token) {
                return errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED);
            }

            const payload = verifyAccessToken(token);

            if (!payload) {
                return errorResponse(
                    "Session expired, please login again",
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            return handler(req, payload);
        } catch {
            return errorResponse(
                "Something went wrong, please try again",
                HTTP_STATUS.INTERNAL_ERROR
            );
        }
    };
}
