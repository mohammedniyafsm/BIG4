/**
 * Auth-related type definitions.
 */

/** Payload stored inside the JWT access token */
export interface AccessTokenPayload {
    userId: string;
    email: string;
}

/** Payload stored inside the JWT refresh token (minimal data) */
export interface RefreshTokenPayload {
    userId: string;
}

/** Authenticated user info returned by /api/auth/me */
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
}

/** Shape of the login request body */
export interface LoginRequest {
    email: string;
    password: string;
}
