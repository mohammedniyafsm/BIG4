import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/constants";

const ACCESS_TOKEN_COOKIE = COOKIE_NAMES.ACCESS_TOKEN;
const REFRESH_TOKEN_COOKIE = COOKIE_NAMES.REFRESH_TOKEN;

/** Cookie config defaults */
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
};

/**
 * Set auth cookies (access + refresh tokens).
 * Access token: 15 minutes
 * Refresh token: 7 days
 */
export async function setAuthCookies(
    accessToken: string,
    refreshToken: string
): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60, // 15 minutes in seconds
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });
}

/**
 * Clear auth cookies on logout.
 */
export async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    });
}

/**
 * Get access token from cookies.
 */
export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

/**
 * Get refresh token from cookies.
 */
export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
