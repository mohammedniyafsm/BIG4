"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full bg-muted/30 rounded-[var(--radius-xl)] overflow-hidden border border-border/50 flex items-center justify-center">
        <span className="text-muted-foreground">No Image Available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-[var(--radius-xl)] border border-border/50"
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full aspect-[4/3] shrink-0 snap-center bg-muted/30">
            <Image
              src={src}
              alt={`${alt} - Image ${i + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      
      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: i * scrollRef.current.clientWidth,
                    behavior: "smooth"
                  });
                }
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                activeIndex === i ? "bg-primary" : "bg-muted-foreground/30"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
