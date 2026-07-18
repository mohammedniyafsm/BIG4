import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "./StockBadge";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="flex flex-col h-full bg-card border border-border/50 rounded-[var(--radius-lg)] overflow-hidden hover:border-border transition-colors">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4 gap-2">
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.category.name}
            </span>
            <StockBadge stock={product.stock} />
          </div>
          
          <h3 className="font-heading text-lg font-semibold leading-tight line-clamp-2 mt-1">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-sm text-muted-foreground">
              {product.brand}
            </p>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.sku}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
