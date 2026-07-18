import { NextRequest } from "next/server";
import { errorResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants";

/**
 * CSRF protection via Origin / Referer header validation.
 *
 * Rejects state-changing requests (POST, PUT, DELETE, PATCH)
 * that don't include a matching Origin or Referer header.
 *
 * In development mode, allows requests from localhost.
 */
export function withCsrf(
    handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>
) {
    return async (req: NextRequest, ...args: unknown[]) => {
        // Only check state-changing methods
        const method = req.method.toUpperCase();
        if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
            return handler(req, ...args);
        }

        const origin = req.headers.get("origin");
        const referer = req.headers.get("referer");
        const host = req.headers.get("host");

        if (!host) {
            return errorResponse("Request rejected", HTTP_STATUS.FORBIDDEN);
        }

        const isDev = process.env.NODE_ENV === "development";

        // Check Origin header first (most reliable)
        if (origin) {
            const originHost = new URL(origin).host;
            if (originHost === host) {
                return handler(req, ...args);
            }
            // In development, allow localhost variants
            if (isDev && isLocalhost(originHost) && isLocalhost(host)) {
                return handler(req, ...args);
            }
            return errorResponse("Request rejected", HTTP_STATUS.FORBIDDEN);
        }

        // Fallback to Referer header
        if (referer) {
            try {
                const refererHost = new URL(referer).host;
                if (refererHost === host) {
                    return handler(req, ...args);
                }
                if (isDev && isLocalhost(refererHost) && isLocalhost(host)) {
                    return handler(req, ...args);
                }
            } catch {
                // Invalid referer URL
            }
            return errorResponse("Request rejected", HTTP_STATUS.FORBIDDEN);
        }

        // No Origin or Referer — reject
        return errorResponse("Request rejected", HTTP_STATUS.FORBIDDEN);
    };
}

function isLocalhost(host: string): boolean {
    return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}
