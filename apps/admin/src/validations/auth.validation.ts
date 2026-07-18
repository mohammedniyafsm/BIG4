import { z } from "zod/v4";

/**
 * Auth validation schemas using Zod.
 * Used in API route handlers to validate request bodies.
 */

/**
 * Strong password schema — enforces:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
    );

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: passwordSchema,
});

/** Inferred TypeScript types from Zod schemas */
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
