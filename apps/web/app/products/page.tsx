import { getCategories, getProducts } from "@/lib/api";
import { ProductFilters } from "@/components/features/products/ProductFilters";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { ProductSearch } from "@/components/features/products/ProductSearch";
import { SortSelect } from "@/components/features/products/SortSelect";
import { ActiveFilterChips } from "@/components/features/products/ActiveFilterChips";
import { ProductPagination } from "@/components/features/products/ProductPagination";
import { MobileProductControls } from "@/components/features/products/MobileProductControls";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";
import FadeIn from "@/components/animations/FadeIn";

export const metadata = {
  title: "Products | Big4 Tiles & Sanitary",
  description: "Browse our extensive catalog of premium tiles and sanitaryware.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === "string" ? Number(resolvedSearchParams.limit) : 12;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const brand = typeof resolvedSearchParams.brand === "string" ? resolvedSearchParams.brand : undefined;
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "newest";
  const inStock = resolvedSearchParams.inStock === "true";

  // Fetch categories and products in parallel
  const [categoriesRes, productsRes] = await Promise.all([
    getCategories().catch(() => ({ data: [] })),
    getProducts({
      page,
      limit,
      search,
      category,
      brand,
      sort,
      inStock,
    }).catch(() => null), // Return null if API is down
  ]);

  const categories = categoriesRes.data || [];
  
  // Extract unique brands from the current products response (since API doesn't have a brands endpoint)
  // Ideally this would come from a dedicated `/brands` API endpoint.
  // For now, we mock it or extract from known.
  const brands = Array.from(new Set(productsRes?.data.map((p) => p.brand).filter(Boolean) as string[]));

  return (
    <div className="light-theme bg-background text-foreground min-h-screen">
      <Navbar theme="light" />
      <main className="pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <FadeIn>
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl font-semibold mb-3 uppercase">
                  Our Products
                </h1>
                <p className="text-muted-foreground text-lg">
                  {productsRes?.pagination.total 
                    ? `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, productsRes.pagination.total)} of ${productsRes.pagination.total} products`
                    : "Browse our collection"}
                </p>
              </div>
              
              <div className="flex flex-col w-full md:w-auto sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto sticky top-[4.5rem] z-40 lg:static bg-background/95 backdrop-blur py-3 -mx-6 px-6 lg:mx-0 lg:px-0 lg:py-0 border-b lg:border-none border-border">
                  <ProductSearch />
                </div>
                <div className="hidden lg:block">
                  <SortSelect />
                </div>
              </div>
            </div>
            

            
            <ActiveFilterChips />
          </FadeIn>

          <MobileProductControls categories={categories} brands={brands} />

          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters categories={categories} brands={brands} />
            
            <div className="flex-1">
              {productsRes ? (
                <>
                  <ProductGrid products={productsRes.data} />
                  <ProductPagination 
                    currentPage={productsRes.pagination.page} 
                    totalPages={productsRes.pagination.totalPages} 
                  />
                </>
              ) : (
                <div className="py-20 text-center text-red-500">
                  <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                  <p>Please check if the backend API is running and accessible.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
