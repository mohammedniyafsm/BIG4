"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

interface ProductActionsProps {
  product: {
    name: string;
    slug: string;
    sku: string;
    price: number;
    salePrice: number | null;
    priceUnit: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const [area, setArea] = useState<string>("");
  const [includeWastage, setIncludeWastage] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const effectivePrice = product.salePrice ?? product.price;

  const isAreaCalc = product.priceUnit === "PER_SQM" || product.priceUnit === "PER_SQFT";
  const unitLabel = product.priceUnit === "PER_SQFT" ? "sq.ft" : "m²";
  
  const areaNum = parseFloat(area);
  const isValidArea = !isNaN(areaNum) && areaNum > 0;
  const effectiveArea = isValidArea ? (areaNum * (includeWastage ? 1.10 : 1.0)) : 0;
  
  // Total logic based on unit type
  const total = isAreaCalc 
    ? (effectiveArea * effectivePrice) 
    : (quantity * effectivePrice);

  // Build WhatsApp URL
  const buildWhatsAppUrl = (isSample = false) => {
    const phone = "919353920365";
    const productUrl = typeof window !== "undefined" && window.location.href 
      ? window.location.href 
      : `${siteConfig.website}/products/${product.slug}`;

    const skuSegment = product.sku ? ` (SKU: ${product.sku})` : "";
    
    let message = "";
    if (isSample) {
      message = `Hi Big4 Tiles & Sanitary, I'd like to request a *sample* for *${product.name}*${skuSegment}.\nPlease let me know the process and any charges involved.\nProduct link: ${productUrl}`;
    } else {
      message = `Hi Big4 Tiles & Sanitary, I'm interested in *${product.name}*${skuSegment}.\nCould you share more details, pricing, and availability?\nProduct link: ${productUrl}`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      {isAreaCalc ? (
        <div className="mt-8 p-5 bg-card border border-border/50 rounded-[var(--radius-lg)]">
          <h3 className="text-sm font-semibold mb-3">Area Calculator</h3>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder={`Enter area (${unitLabel})`}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-sm outline-none focus:border-primary transition-colors"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{unitLabel} needed</span>
          </div>
          
          <label className="flex items-center gap-2 mb-4 text-sm text-muted-foreground cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeWastage} 
              onChange={(e) => setIncludeWastage(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary accent-primary"
            />
            +10% for cuts & wastage
          </label>

          {isValidArea && (
            <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-md">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Effective Area:</span>
                <span className="font-medium">
                  {includeWastage ? `${areaNum} ${unitLabel} + 10% → ` : ''}
                  {effectiveArea.toFixed(2)} {unitLabel}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-border/50 pt-2 mt-1">
                <span>Estimated Total:</span>
                <span className="text-lg text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 p-5 bg-card border border-border/50 rounded-[var(--radius-lg)]">
          <h3 className="text-sm font-semibold mb-3">Quantity</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center border border-border rounded-md bg-background overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-muted transition-colors text-lg leading-none"
              >-</button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-2 outline-none border-x border-border appearance-none"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-muted transition-colors text-lg leading-none"
              >+</button>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total</span>
              <span className="text-xl font-bold text-primary leading-none">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Actions */}
      <div className="hidden lg:flex flex-col mt-8 pt-8 border-t border-border gap-4">
        <Button size="lg" className="h-12 px-8 text-[16px] font-semibold rounded-[var(--radius-lg)] w-full" asChild>
          <a href={buildWhatsAppUrl(false)} target="_blank" rel="noopener noreferrer">
            Enquire Now
          </a>
        </Button>
        <div className="flex gap-4">
          <Button size="lg" variant="outline" className="h-10 flex-1 rounded-[var(--radius-md)] text-[14px]" asChild>
            <a href={buildWhatsAppUrl(true)} target="_blank" rel="noopener noreferrer">
              Get a Sample
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-10 flex-1 rounded-[var(--radius-md)] text-[14px]" onClick={handleShare}>
            Share
          </Button>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] border-t border-border flex items-center justify-between gap-3 transition-all">
        <Button size="lg" variant="outline" className="h-12 text-[14px] font-semibold rounded-[var(--radius-lg)] px-3 shrink-0" asChild>
          <a href={buildWhatsAppUrl(true)} target="_blank" rel="noopener noreferrer">
            Get a Sample
          </a>
        </Button>
        <Button size="lg" className="flex-1 h-12 text-[15px] font-semibold rounded-[var(--radius-lg)]" asChild>
          <a href={buildWhatsAppUrl(false)} target="_blank" rel="noopener noreferrer">
            Enquire Now
          </a>
        </Button>
      </div>
    </>
  );
}
