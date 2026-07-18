import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.validation";
import { successResponse, errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";
import { withCsrf } from "@/middleware/csrf";
import {
    checkRateLimit,
    resetRateLimit,
    getClientIp,
} from "@/lib/rate-limiter";

/**
 * POST /api/auth/login
 *
 * Authenticates an admin user with email and password.
 * Sets HTTP-only cookies with access and refresh tokens.
 *
 * Protected by:
 * - Rate limiting (5 attempts per 15 minutes per IP)
 * - CSRF origin validation
 * - Account lockout (5 failures → 30 min lock, handled in service)
 *
 * Request body: { email: string, password: string }
 * Response 200: { success: true, message: "Login successful", data: { user } }
 * Response 400: Validation error
 * Response 401: Invalid credentials
 * Response 422: Account deactivated
 * Response 423: Account locked
 * Response 429: Rate limited
 * Response 500: Server error
 */
export const POST = withCsrf(async (req: NextRequest) => {
    try {
        // 1. Rate limit check
        const clientIp = getClientIp(req.headers);
        const rateCheck = checkRateLimit(clientIp);

        if (rateCheck.limited) {
            return errorResponse(
                `Too many login attempts. Try again in ${rateCheck.retryAfterSeconds} seconds`,
                HTTP_STATUS.TOO_MANY_REQUESTS
            );
        }

        // 2. Parse request body
        const body = await req.json();

        // 3. Validate input with Zod
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            const firstError =
                validation.error.issues[0]?.message ?? "Invalid input";
            return errorResponse(firstError, HTTP_STATUS.BAD_REQUEST);
        }

        // 4. Call auth service
        const result = await authService.login(validation.data);

        // 5. Handle errors
        if ("error" in result) {
            return errorResponse(result.error ?? "Invalid credentials", result.status ?? 401);
        }

        // 6. Reset rate limit on successful login
        resetRateLimit(clientIp);

        // 7. Return success
        return successResponse("Login successful", { user: result.data });
    } catch {
        return errorResponse(
            "Something went wrong, please try again",
            HTTP_STATUS.INTERNAL_ERROR
        );
    }
});
