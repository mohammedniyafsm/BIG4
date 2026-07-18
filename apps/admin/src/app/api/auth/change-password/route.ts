import { authService } from "@/services/auth.service";
import { withAuth } from "@/middleware/withAuth";
import { withCsrf } from "@/middleware/csrf";
import { changePasswordSchema } from "@/validations/auth.validation";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";

/**
 * POST /api/auth/change-password
 *
 * Changes the authenticated user's password.
 * Requires the current password and a strong new password.
 * Revokes all refresh tokens (forces re-login on other devices).
 *
 * Requires: Valid access token (HTTP-only cookie)
 * Request body: { currentPassword: string, newPassword: string }
 * Response 200: { success: true, message: "Password changed successfully" }
 * Response 400: Weak password or same as current
 * Response 401: Wrong current password
 */
export const POST = withCsrf(
    withAuth(async (req, user) => {
        try {
            // 1. Parse request body
            const body = await req.json();

            // 2. Validate input with Zod
            const validation = changePasswordSchema.safeParse(body);
            if (!validation.success) {
                const firstError =
                    validation.error.issues[0]?.message ?? "Invalid input";
                return errorResponse(firstError, HTTP_STATUS.BAD_REQUEST);
            }

            // 3. Call auth service
            const result = await authService.changePassword(
                user.userId,
                validation.data
            );

            // 4. Handle errors
            if ("error" in result) {
                return errorResponse(result.error ?? "An unexpected error occurred", result.status ?? HTTP_STATUS.INTERNAL_ERROR);
            }

            // 5. Return success
            return successResponse("Password changed successfully", null);
        } catch {
            return errorResponse(
                "Something went wrong, please try again",
                HTTP_STATUS.INTERNAL_ERROR
            );
        }
    })
);
