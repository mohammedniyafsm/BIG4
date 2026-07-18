"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
}

/**
 * Pagination component — updates URL page param.
 */
export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page <= 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }
        router.push(`?${params.toString()}`);
    };

    // Generate visible page numbers
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    const btnBase: React.CSSProperties = {
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        cursor: "pointer",
        background: "#ffffff",
        color: "#374151",
        transition: "all 150ms ease",
        minWidth: 36,
        textAlign: "center",
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
                {total} product{total !== 1 ? "s" : ""} total
            </span>

            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {/* Prev */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    style={{
                        ...btnBase,
                        opacity: currentPage <= 1 ? 0.4 : 1,
                        cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    }}
                >
                    ←
                </button>

                {/* Page numbers */}
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} style={{ padding: "6px 4px", color: "#9ca3af", fontSize: 13 }}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            style={{
                                ...btnBase,
                                background: p === currentPage ? "#2563eb" : "#ffffff",
                                color: p === currentPage ? "#ffffff" : "#374151",
                                borderColor: p === currentPage ? "#2563eb" : "#e5e7eb",
                                fontWeight: p === currentPage ? 700 : 500,
                            }}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    style={{
                        ...btnBase,
                        opacity: currentPage >= totalPages ? 0.4 : 1,
                        cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    }}
                >
                    →
                </button>
            </div>
        </div>
    );
}
