import { getProducts } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
}

export async function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  try {
    const response = await getProducts({ category: categorySlug, limit: 5 });
    
    // Filter out the current product and take only 4
    const relatedProducts = response.data
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4);

    if (relatedProducts.length === 0) return null;

    return (
      <section className="mt-24 pt-12 border-t border-border">
        <h2 className="text-3xl font-heading font-semibold mb-8">Related Products</h2>
        
        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <ProductGrid products={relatedProducts} />
        </div>
        
        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
          {relatedProducts.map((product) => (
            <div key={product.id} className="w-[85vw] sm:w-[300px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    // Graceful degradation
    return null;
  }
}
