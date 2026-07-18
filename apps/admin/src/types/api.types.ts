/**
 * Standardized API response types.
 * All API endpoints return this shape for consistency.
 */

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
