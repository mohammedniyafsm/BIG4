"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/types/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MobileProductControlsProps {
  categories: Category[];
  brands: string[];
}

export function MobileProductControls({ categories, brands }: MobileProductControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const inStock = searchParams.get("inStock") === "true";
  const currentSort = searchParams.get("sort") || "newest";

  const activeFilterCount = Array.from(searchParams.keys()).filter((k) => k !== "page" && k !== "sort" && k !== "search").length;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`/products?${createQueryString(name, value)}`, { scroll: false });
  };

  const onSortChange = (value: string) => {
    updateFilter("sort", value === "newest" ? "" : value);
    setIsSortOpen(false); // Close after sort
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("sort")) params.set("sort", searchParams.get("sort")!);
    if (searchParams.get("search")) params.set("search", searchParams.get("search")!);
    router.push(`/products?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur border-t border-border flex gap-4">
      {/* Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button suppressHydrationWarning variant="outline" className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border-border bg-background shadow-sm active:scale-95 transition-transform">
            <FilterIcon className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl overflow-y-auto px-6">
          <SheetHeader className="mb-6 flex flex-row items-center justify-between text-left">
            <SheetTitle className="text-2xl font-semibold">Filters</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-8 pb-20">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Categories</h3>
              <RadioGroup value={currentCategory} onValueChange={(val) => updateFilter("category", val)}>
                <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                  <RadioGroupItem value="all" id="m-cat-all" className="w-5 h-5" />
                  <Label htmlFor="m-cat-all" className="text-base flex-1">All Categories</Label>
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={cat.slug} id={`m-cat-${cat.slug}`} className="w-5 h-5" />
                      <Label htmlFor={`m-cat-${cat.slug}`} className="text-base">{cat.name}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Brands</h3>
                <RadioGroup value={currentBrand} onValueChange={(val) => updateFilter("brand", val)}>
                  <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                    <RadioGroupItem value="all" id="m-brand-all" className="w-5 h-5" />
                    <Label htmlFor="m-brand-all" className="text-base flex-1">All Brands</Label>
                  </div>
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-3 py-2 border-b border-border/50">
                      <RadioGroupItem value={brand} id={`m-brand-${brand}`} className="w-5 h-5" />
                      <Label htmlFor={`m-brand-${brand}`} className="text-base">{brand}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Availability</h3>
              <div className="flex items-center space-x-3 py-2">
                <Checkbox
                  id="m-inStock"
                  checked={inStock}
                  className="w-5 h-5"
                  onCheckedChange={(checked) => updateFilter("inStock", checked ? "true" : "")}
                />
                <Label htmlFor="m-inStock" className="text-base">In stock only</Label>
              </div>
            </div>
            
            <div className="pt-6 flex gap-4">
              <Button suppressHydrationWarning variant="outline" className="flex-1 h-12" onClick={clearAllFilters}>Clear all</Button>
              <Button suppressHydrationWarning className="flex-1 h-12" onClick={() => setIsFilterOpen(false)}>Apply</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
        <SheetTrigger asChild>
          <Button suppressHydrationWarning variant="outline" className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border-border bg-background shadow-sm active:scale-95 transition-transform">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl px-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-semibold text-left">Sort by</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-8">
            <RadioGroup value={currentSort} onValueChange={onSortChange}>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="newest" id="sort-newest" className="w-5 h-5" />
                <Label htmlFor="sort-newest" className="text-base flex-1">Newest</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="price-asc" id="sort-price-asc" className="w-5 h-5" />
                <Label htmlFor="sort-price-asc" className="text-base flex-1">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="price-desc" id="sort-price-desc" className="w-5 h-5" />
                <Label htmlFor="sort-price-desc" className="text-base flex-1">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="name-asc" id="sort-name-asc" className="w-5 h-5" />
                <Label htmlFor="sort-name-asc" className="text-base flex-1">Name: A to Z</Label>
              </div>
              <div className="flex items-center space-x-3 py-3">
                <RadioGroupItem value="name-desc" id="sort-name-desc" className="w-5 h-5" />
                <Label htmlFor="sort-name-desc" className="text-base flex-1">Name: Z to A</Label>
              </div>
            </RadioGroup>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
