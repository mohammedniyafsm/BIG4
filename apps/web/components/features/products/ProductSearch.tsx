"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset page to 1
      
      const newUrl = `/products?${params.toString()}`;
      // Only push if the url actually changes to avoid infinite loops
      if (`/products?${searchParams.toString()}` !== newUrl && query !== searchParams.get("search")) {
         router.push(newUrl, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams]);

  // Sync state if URL changes externally
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setQuery(urlSearch);
  }, [searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products or SKU..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 w-full bg-background/50 backdrop-blur-sm"
      />
    </div>
  );
}
