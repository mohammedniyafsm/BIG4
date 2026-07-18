import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { resetPasswordSchema } from "@/validations/auth.validation";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";
import { withCsrf } from "@/middleware/csrf";

/**
 * POST /api/auth/reset-password
 *
 * Resets the user's password using a valid reset token.
 * The token must not be expired or already used.
 *
 * Protected by: CSRF origin validation
 * Request body: { token: string, newPassword: string }
 * Response 200: { success: true, message: "Password reset successfully" }
 * Response 400: Invalid/expired token or weak password
 */
export const POST = withCsrf(async (req: NextRequest) => {
    try {
        const body = await req.json();

        const validation = resetPasswordSchema.safeParse(body);
        if (!validation.success) {
            const firstError =
                validation.error.issues[0]?.message ?? "Invalid input";
            return errorResponse(firstError, HTTP_STATUS.BAD_REQUEST);
        }

        const result = await authService.resetPassword(validation.data);

        if ("error" in result) {
            return errorResponse(result.error ?? "Invalid or expired reset token", result.status ?? 400);
        }

        return successResponse(result.data.message, null);
    } catch {
        return errorResponse(
            "Something went wrong, please try again",
            HTTP_STATUS.INTERNAL_ERROR
        );
    }
});
