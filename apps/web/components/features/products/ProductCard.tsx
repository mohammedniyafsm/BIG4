import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { StockBadge } from "./StockBadge";
import { motion } from "framer-motion";

const unitMap: Record<string, string> = {
  PER_SQM: "/ m²",
  PER_PIECE: "/ pc",
  PER_BOX: "/ box",
  PER_SET: "/ set"
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full w-full">
      <div className="flex flex-col h-full bg-card border border-border/50 rounded-[var(--radius-lg)] overflow-hidden hover:border-border transition-colors font-inter">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted/30 shrink-0">
          {product.imageUrl ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-all duration-500 group-hover:scale-105",
                  product.images && product.images.length > 1 ? "group-hover:opacity-0" : ""
                )}
              />
              {product.images && product.images.length > 1 && (
                <Image
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4 gap-2">
          <div className="flex justify-between items-start gap-2 min-h-[20px]">
            <span className="text-micro text-muted-foreground truncate max-w-[70%]">
              {product.category.name}{product.brand ? ` • ${product.brand}` : ""}
            </span>
            <StockBadge stock={product.stock} />
          </div>
          
          <h3 className="text-card-title line-clamp-2 min-h-[42px] leading-snug">
            {product.name}
          </h3>

          <div className="min-h-[20px]">
            {(product.size || product.finish) && (
              <p className="text-meta truncate">
                {[product.size, product.finish].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-t border-border/30">
            <div className="flex flex-col shrink-0">
              {product.salePrice ? (
                <>
                  <span className="text-[16px] font-bold text-foreground leading-none">
                    {formatPrice(product.salePrice)} <span className="text-meta font-normal">{product.priceUnit ? unitMap[product.priceUnit] : ""}</span>
                  </span>
                  <span className="text-[12px] text-muted-foreground line-through mt-0.5">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-[16px] font-bold text-foreground leading-none">
                  {formatPrice(product.price)} <span className="text-meta font-normal">{product.priceUnit ? unitMap[product.priceUnit] : ""}</span>
                </span>
              )}
            </div>
            <span className="text-meta pb-1 truncate max-w-[120px] sm:max-w-none text-right">
              {product.sku}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
