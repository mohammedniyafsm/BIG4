import { NextResponse } from "next/server";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/api.types";

/**
 * Send a success JSON response.
 *
 * @example
 * return successResponse("Login successful", { user }, 200);
 */
export function successResponse<T>(
    message: string,
    data: T,
    status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        { success: true, message, data },
        { status }
    );
}

/**
 * Send an error JSON response.
 *
 * @example
 * return errorResponse("Invalid email or password", 401);
 */
export function errorResponse(
    message: string,
    status: number = 400
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { success: false, message, data: null },
        { status }
    );
}
