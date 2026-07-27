"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={currentSort} onValueChange={onSortChange}>
      <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white text-zinc-900 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent position="popper" className="bg-white text-zinc-900 border border-zinc-200 shadow-2xl dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="name_asc">Name: A to Z</SelectItem>
        <SelectItem value="name_desc">Name: Z to A</SelectItem>
      </SelectContent>
    </Select>
  );
}
