import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/auth";
import { getAccessToken } from "@/lib/cookies";
import type { AccessTokenPayload } from "@/types/auth.types";

/**
 * Server-side auth guard for Server Actions and Server Components.
 *
 * Verifies the access token from cookies and returns the payload.
 * Redirects to /login if not authenticated.
 *
 * Usage in Server Actions:
 * ```ts
 * const user = await requireAuth();
 * // user.userId, user.email guaranteed available
 * ```
 *
 * Usage in Server Components:
 * ```tsx
 * export default async function AdminPage() {
 *   const user = await requireAuth();
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export async function requireAuth(): Promise<AccessTokenPayload> {
    const token = await getAccessToken();

    if (!token) {
        redirect("/login");
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
        redirect("/login");
    }

    return payload;
}
