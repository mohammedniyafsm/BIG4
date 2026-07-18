"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ActiveFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract filter keys, ignoring pagination and sorting
  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key]) => key !== "page" && key !== "sort" && key !== "search"
  );

  const searchFilter = searchParams.get("search");

  if (activeFilters.length === 0 && !searchFilter) {
    return null;
  }

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Keep only sorting
    const sort = params.get("sort");
    const newParams = new URLSearchParams();
    if (sort) newParams.set("sort", sort);
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex overflow-x-auto whitespace-nowrap items-center gap-2 mb-6 pb-2 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
      <span className="text-sm text-muted-foreground mr-2 shrink-0">Active filters:</span>
      
      {searchFilter && (
        <Badge variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1 bg-muted/50">
          Search: {searchFilter}
          <button onClick={() => removeFilter("search")} className="hover:bg-muted rounded-full p-0.5 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      {activeFilters.map(([key, value]) => {
        let displayValue = value;
        if (key === "inStock") displayValue = "In Stock";
        // For category and brand, we could map slug to name, but for now we just show the value capitalized
        else displayValue = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <Badge key={key} variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1 bg-muted/50">
            {displayValue}
            <button onClick={() => removeFilter(key)} className="hover:bg-muted rounded-full p-0.5 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        );
      })}

      <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground">
        Clear all
      </Button>
    </div>
  );
}
