import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <h2 className="text-4xl font-extrabold tracking-tight">404</h2>
        <p className="text-lg text-slate-300">Page Not Found</p>
        <p className="text-slate-400 text-sm">
          The requested admin resource could not be found or has been moved.
        </p>
        <div>
          <Link
            href="/admin"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
