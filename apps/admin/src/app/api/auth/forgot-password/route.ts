import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { forgotPasswordSchema } from "@/validations/auth.validation";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";
import { withCsrf } from "@/middleware/csrf";

/**
 * POST /api/auth/forgot-password
 *
 * Sends a password reset email if the account exists.
 * Always returns 200 to prevent email enumeration.
 *
 * Protected by: CSRF origin validation
 * Request body: { email: string }
 * Response 200: { success: true, message: "If the email exists..." }
 */
export const POST = withCsrf(async (req: NextRequest) => {
    try {
        const body = await req.json();

        const validation = forgotPasswordSchema.safeParse(body);
        if (!validation.success) {
            const firstError =
                validation.error.issues[0]?.message ?? "Invalid input";
            return errorResponse(firstError, HTTP_STATUS.BAD_REQUEST);
        }

        const result = await authService.forgotPassword(validation.data);

        return successResponse(
            result.data.message,
            null
        );
    } catch {
        return errorResponse(
            "Something went wrong, please try again",
            HTTP_STATUS.INTERNAL_ERROR
        );
    }
});
