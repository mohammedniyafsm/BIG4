import { authService } from "@/services/auth.service";
import { withCsrf } from "@/middleware/csrf";
import { getRefreshToken } from "@/lib/cookies";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";

/**
 * POST /api/auth/refresh
 *
 * Rotates the refresh token and issues new tokens.
 * The old refresh token is invalidated (refresh token rotation).
 * If a reused token is detected, all tokens are revoked.
 *
 * Requires: Valid refresh token (HTTP-only cookie)
 * Response 200: { success: true, message: "Token refreshed", data: { user } }
 * Response 401: Invalid/expired refresh token
 */
export const POST = withCsrf(async () => {
    try {
        // 1. Get refresh token from cookie
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            return errorResponse(
                "Session expired, please login again",
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // 2. Call auth service for token rotation
        const result = await authService.refresh(refreshToken);

        // 3. Handle errors
        if ("error" in result) {
            return errorResponse(result.error ?? "Session expired, please login again", result.status ?? 401);
        }

        // 4. Return success
        return successResponse("Token refreshed", { user: result.data });
    } catch {
        return errorResponse(
            "Something went wrong, please try again",
            HTTP_STATUS.INTERNAL_ERROR
        );
    }
});
