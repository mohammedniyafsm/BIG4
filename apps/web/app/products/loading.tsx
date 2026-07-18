import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";

export default function ProductsLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="flex justify-between items-end mb-10">
            <div>
              <Skeleton className="h-10 w-64 mb-3" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-64 shrink-0 pr-6">
              <div className="space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col h-full rounded-[var(--radius-lg)] overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="p-4 space-y-3 bg-card border-x border-b border-border/50 rounded-b-[var(--radius-lg)]">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="pt-4 flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
