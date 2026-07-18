import nodemailer from "nodemailer";
import { env } from "@/config/env";

/**
 * Nodemailer transporter — configured from environment variables.
 *
 * For Gmail: use an App Password (not your regular password).
 * Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local
 */
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

/**
 * Send a password reset email with the reset link.
 */
export async function sendPasswordResetEmail(
    to: string,
    resetToken: string
): Promise<void> {
    const resetUrl = `${env.APP_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        from: `"Big4 Tiles & Sanitary" <${env.SMTP_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fa; border-radius: 12px;">
                <h2 style="color: #1a1a2e; margin-bottom: 8px;">Password Reset</h2>
                <p style="color: #555; line-height: 1.6;">
                    You requested a password reset. Click the button below to set a new password.
                    This link expires in <strong>1 hour</strong>.
                </p>
                <a href="${resetUrl}"
                   style="display: inline-block; padding: 12px 28px; margin: 20px 0;
                          background: #1a1a2e; color: #fff; text-decoration: none;
                          border-radius: 8px; font-weight: 600;">
                    Reset Password
                </a>
                <p style="color: #999; font-size: 13px; margin-top: 24px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
                <p style="color: #bbb; font-size: 12px;">
                    Or copy this link: <br/>
                    <span style="color: #888; word-break: break-all;">${resetUrl}</span>
                </p>
            </div>
        `,
    });
}
