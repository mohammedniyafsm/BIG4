import { requireAuth } from "@/lib/auth-guard";
import { userRepository } from "@/repositories/user.repository";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/ToastProvider";

/**
 * Admin layout — wraps all /admin/* pages.
 *
 * Auth is verified server-side before rendering.
 * Provides the sidebar + header shell and ToastProvider context.
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side auth check — redirects to /login if not authenticated
    const auth = await requireAuth();

    // Fetch user details for the header
    const user = await userRepository.findByIdSafe(auth.userId);

    return (
        <ToastProvider>
            <AdminShell
                userEmail={user?.email ?? auth.email}
                userName={user?.name ?? "Admin"}
            >
                {children}
            </AdminShell>
        </ToastProvider>
    );
}
