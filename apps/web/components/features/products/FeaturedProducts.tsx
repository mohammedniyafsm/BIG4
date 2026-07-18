import { getProducts } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export async function FeaturedProducts() {
  try {
    const response = await getProducts({ limit: 4 });
    const products = response.data;

    if (products.length === 0) return null;

    return (
      <section className="py-20 px-6 sm:px-10 xl:px-16 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="font-heading text-4xl sm:text-5xl font-semibold mb-4 uppercase">
                  Featured Products
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Discover our curated selection of premium tiles and sanitaryware for your next project.
                </p>
              </div>
              <Link 
                href="/products" 
                className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-primary transition-colors shrink-0"
              >
                View All Catalog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeIn>

          <ProductGrid products={products} />
        </div>
      </section>
    );
  } catch (error) {
    // Graceful fallback for home page
    return null;
  }
}
