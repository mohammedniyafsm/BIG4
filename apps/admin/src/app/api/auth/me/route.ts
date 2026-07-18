import { authService } from "@/services/auth.service";
import { withAuth } from "@/middleware/withAuth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated admin user's profile.
 *
 * Requires: Valid access token (HTTP-only cookie)
 * Response 200: { success: true, message: "User retrieved", data: { user } }
 * Response 401: Not authenticated
 * Response 404: User not found
 */
export const GET = withAuth(async (_req, user) => {
    try {
        const result = await authService.me(user.userId);

        if ("error" in result) {
            return errorResponse(result.error ?? "User not found", result.status ?? 404);
        }

        return successResponse("User retrieved", { user: result.data });
    } catch {
        return errorResponse(
            "Something went wrong, please try again",
            HTTP_STATUS.INTERNAL_ERROR
        );
    }
});
