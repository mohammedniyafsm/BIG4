import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";

export default function ProductDetailsLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <Skeleton className="h-6 w-64 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Image Skeleton */}
            <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-xl)]" />

            {/* Right: Info Skeleton */}
            <div className="flex flex-col">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-12 w-full max-w-md mb-6" />
              
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="space-y-3 mb-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Skeleton className="h-14 w-full sm:w-40 rounded-none" />
                <Skeleton className="h-14 w-full sm:w-48 rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
