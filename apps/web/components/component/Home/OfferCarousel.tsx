"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getOffers } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config/site";

export default function OfferCarousel() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const options = useMemo(() => ({ loop: true }), []);
  const plugins = useMemo(() => [Autoplay({ delay: 5000, stopOnInteraction: true })], []);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await getOffers();
        setOffers(res.data || []);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-muted animate-pulse h-[50vw] md:h-[33vw] max-h-[600px] min-h-[300px]" />
    );
  }

  if (!offers || offers.length === 0) {
    return null; // Don't show carousel if no active offers
  }

  return (
    <section className="py-12 md:py-20 bg-black w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full relative overflow-hidden group rounded-2xl shadow-2xl bg-black" ref={emblaRef}>
      <div className="flex touch-pan-y">
        {offers.map((offer) => {
          let href = "#";
          
          if (offer.linkType === "PRODUCT") {
            href = `/products/${offer.linkValue}`;
          } else if (offer.linkType === "CATEGORY") {
            href = `/products?category=${offer.linkValue}`;
          } else if (offer.linkType === "EXTERNAL_URL") {
            href = offer.linkValue;
          } else if (offer.linkType === "WHATSAPP") {
            href = siteConfig.contact.whatsappLink;
          }

          const slideContent = (
            <div className="relative w-full flex flex-col md:block group">
              {/* Image Container */}
              <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-[3/1] md:h-auto md:max-h-[650px]">
                {/* Desktop Image */}
                <Image
                  src={offer.bannerImage}
                  alt={offer.title}
                  fill
                  priority
                  className={`object-cover ${offer.bannerImageMobile ? "hidden md:block" : "hidden md:block"}`}
                  sizes="(max-width: 768px) 100vw, 100vw"
                />
                
                {/* Mobile Image or Fallback */}
                {offer.bannerImageMobile ? (
                  <Image
                    src={offer.bannerImageMobile}
                    alt={offer.title}
                    fill
                    priority
                    className="object-cover md:hidden"
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                ) : (
                  <>
                    <Image
                      src={offer.bannerImage}
                      alt={`${offer.title} background`}
                      fill
                      priority
                      className="object-cover md:hidden blur-xl scale-110 opacity-50"
                    />
                    <Image
                      src={offer.bannerImage}
                      alt={offer.title}
                      fill
                      priority
                      className="object-contain md:hidden relative z-0"
                      sizes="(max-width: 768px) 100vw, 100vw"
                    />
                  </>
                )}
              </div>
              
              {/* Text Content (Overlay on Desktop, Solid Background Below on Mobile) */}
              <div className="relative md:absolute md:inset-0 bg-zinc-950 md:bg-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent flex flex-col justify-center items-start p-6 sm:p-8 md:p-16 lg:p-24 z-10 border-t border-white/5 md:border-t-0">
                <div className="max-w-2xl transform transition-transform duration-700 ease-out translate-y-0 group-hover:md:translate-x-4 w-full">
                  {offer.discountText && (
                    <span className="inline-block px-3 py-1 mb-3 md:mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] text-white bg-primary rounded-sm uppercase">
                      {offer.discountText}
                    </span>
                  )}
                  
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 md:mb-4 leading-[1.1] tracking-tight drop-shadow-sm">
                    {offer.title}
                  </h2>
                  
                  {offer.description && (
                    <p className="text-sm md:text-lg text-zinc-300 font-medium mb-6 md:mb-10 max-w-lg drop-shadow-sm line-clamp-3 md:line-clamp-none">
                      {offer.description}
                    </p>
                  )}
                  
                  {offer.linkType !== "NONE" && (
                    <div className="inline-flex items-center justify-center bg-white text-black px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg w-full sm:w-auto mt-2 md:mt-0">
                      {offer.linkType === "WHATSAPP" ? "Inquire Now" : "Shop Now"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <div
              key={offer.id}
              className="relative min-w-0 flex-[0_0_100%] cursor-grab active:cursor-grabbing"
            >
              {offer.linkType === "NONE" ? (
                slideContent
              ) : (
                <Link href={href} target={offer.linkType === "EXTERNAL_URL" || offer.linkType === "WHATSAPP" ? "_blank" : undefined}>
                  {slideContent}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Modern Pagination Dots */}
      {offers.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 md:gap-4 z-20">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-[3px] transition-all duration-500 ease-out ${
                index === selectedIndex 
                  ? "w-8 md:w-12 bg-white" 
                  : "w-4 md:w-6 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
      </div>
    </section>
  );
}
