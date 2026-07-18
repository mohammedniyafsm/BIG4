"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
    placeholder?: string;
}

/**
 * Debounced search bar — updates URL search params.
 */
export function SearchBar({ placeholder = "Search products..." }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") ?? "");

    // Debounce: update URL 400ms after user stops typing
    const updateSearch = useCallback(
        (term: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (term.trim()) {
                params.set("search", term.trim());
            } else {
                params.delete("search");
            }
            params.delete("page"); // Reset to page 1 on new search
            
            const currentQueryString = searchParams.toString();
            const newQueryString = params.toString();
            if (currentQueryString !== newQueryString) {
                router.push(`?${newQueryString}`);
            }
        },
        [router, searchParams]
    );

    useEffect(() => {
        const timer = setTimeout(() => updateSearch(value), 400);
        return () => clearTimeout(timer);
    }, [value, updateSearch]);

    return (
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    background: "#ffffff",
                    color: "#111827",
                    transition: "border-color 150ms ease",
                }}
            />
        </div>
    );
}
