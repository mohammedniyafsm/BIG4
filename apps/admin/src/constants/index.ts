/**
 * Application constants.
 * Centralized to avoid magic strings scattered across the codebase.
 */

/** Admin role — only role for now. Add more as needed. */
export const ROLES = {
    ADMIN: "ADMIN",
} as const;

/** Cookie names */
export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

/** HTTP status codes used across the app */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    LOCKED: 423,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
} as const;
