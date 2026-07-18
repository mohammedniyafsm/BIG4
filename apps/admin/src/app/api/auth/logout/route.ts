import { authService } from "@/services/auth.service";
import { withAuth } from "@/middleware/withAuth";
import { withCsrf } from "@/middleware/csrf";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";

/**
 * POST /api/auth/logout
 *
 * Logs out the admin user.
 * Clears auth cookies and revokes all refresh tokens.
 *
 * Requires: Valid access token (HTTP-only cookie)
 * Response 200: { success: true, message: "Logged out successfully" }
 * Response 401: Not authenticated
 */
export const POST = withCsrf(
    withAuth(async (_req, user) => {
        try {
            await authService.logout(user.userId);
            return successResponse("Logged out successfully", null);
        } catch {
            return errorResponse(
                "Something went wrong, please try again",
                HTTP_STATUS.INTERNAL_ERROR
            );
        }
    })
);
