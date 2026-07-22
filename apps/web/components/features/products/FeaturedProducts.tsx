import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import FadeIn from "@/components/animations/FadeIn";

export async function FeaturedProducts() {
  const { data: products } = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return null;
  }

  const isFew = products.length > 0 && products.length < 3;

  return (
    <section className="w-full bg-black py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6 md:gap-10">
          <div>
            <span className="text-[10px] md:text-xs text-[#939393] uppercase tracking-[0.2em] block mb-4 font-bold">
              HANDPICKED
            </span>
            <h2 className="uppercase font-black leading-[0.95] tracking-[-0.04em] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-white">
              FEATURED
              <br />
              PRODUCTS
            </h2>
          </div>
          
          {/* Desktop Link */}
          <div className="hidden md:block">
            <Link 
              href="/products" 
              className="group relative flex items-center gap-4 h-12 lg:h-14 overflow-hidden border border-[#4d4d4d] px-8 uppercase font-semibold tracking-[0.12em] text-white"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
              <span className="relative z-10 text-[10px] lg:text-xs font-black transition-colors duration-500 group-hover:text-black">
                VIEW ALL PRODUCTS
              </span>
              <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
                ↗
              </span>
            </Link>
          </div>
        </div>

        {/* Product Grid / Carousel */}
        <div className="relative group w-full">
          {/* Mobile: snap-x carousel, Desktop: CSS grid or flex center if few */}
          <div className={`flex ${isFew ? 'md:justify-center md:flex-wrap' : 'md:grid'} overflow-x-auto snap-x snap-mandatory ${!isFew ? 'md:grid-cols-2 lg:grid-cols-4' : ''} gap-5 md:gap-6 pb-8 md:pb-0 scrollbar-hide -mx-6 px-[7.5vw] sm:px-12 md:mx-0 md:px-0`}>
            {products.map((product, idx) => (
              <FadeIn 
                key={product.id} 
                delay={idx * 0.1} 
                className={`w-[85vw] sm:w-[340px] ${isFew ? 'md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] md:max-w-sm' : 'md:w-auto'} shrink-0 snap-center`}
              >
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Mobile Link */}
        <div className="mt-8 md:hidden flex justify-center">
          <Link 
            href="/products" 
            className="group relative w-full flex justify-center items-center gap-3 h-14 overflow-hidden border border-[#4d4d4d] px-6 uppercase font-semibold tracking-[0.12em] text-white"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
            <span className="relative z-10 text-[11px] font-black transition-colors duration-500 group-hover:text-black">
              VIEW ALL PRODUCTS
            </span>
            <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
