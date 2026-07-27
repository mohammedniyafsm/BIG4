"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const showcaseItems = [
  {
    tag: "01 / Architectural Surfaces",
    category: "Luxury Surfaces & Slabs",
    title: "Monolithic Kitchen Islands & Slabs",
    description: "Seamless ultra-large porcelain slabs engineered for high-heat resistance, scratch durability, and striking minimal aesthetic in modern kitchens.",
    src: "/images/products/77.webp",
    ratio: 170 / 125,
    align: "start" as const,
  },
  {
    tag: "02 / Bath & Wellness",
    category: "Luxury Bathware",
    title: "Precision Sanitary & Bath Systems",
    description: "Ergonomic brassware and contemporary sanitary fixtures designed for effortless water control and timeless spa-grade luxury.",
    src: "/images/products/78.webp",
    ratio: 190 / 120,
    align: "end" as const,
  },
  {
    tag: "03 / Premium Flooring",
    category: "Commercial & Residential",
    title: "Heavy-Duty Vitrified Flooring",
    description: "High-durability slip-resistant vitrified tiles engineered to withstand heavy foot traffic while retaining polished architectural elegance.",
    src: "/images/products/79.webp",
    ratio: 170 / 125,
    align: "start" as const,
  },
  {
    tag: "04 / Wall Cladding",
    category: "Overlay & Wall Panels",
    title: "Designer Wall Overlay Solutions",
    description: "Precision-crafted wall panels and overlay tiles that blend structural longevity with refined texturized finishes for grand interiors.",
    src: "/images/products/80.webp",
    ratio: 190 / 140,
    align: "end" as const,
  },
  {
    tag: "05 / Living Spaces",
    category: "Interior Architecture",
    title: "Integrated Living Space Aesthetics",
    description: "Harmonized color palettes and high-definition surface textures designed to elevate residential living rooms and commercial luxury suites.",
    src: "/images/products/81.jpg",
    ratio: 170 / 115,
    align: "start" as const,
  },
];

function RevealImage({ src, ratio }: { src: string; ratio: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipBottom = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const clipPath = useTransform(clipBottom, (v) => `inset(0% 0% ${Math.max(v, 0)}% 0%)`);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#111]" style={{ aspectRatio: ratio }}>
      <motion.div style={{ clipPath } as any} className="absolute inset-0">
        <motion.div style={{ y } as any} className="absolute inset-0 h-[120%] -top-[10%]">
          <Image src={src} alt="Showcase image" fill sizes="(max-width: 1023px) 90vw, 500px" className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function TextCard({
  tag,
  category,
  title,
  description,
}: {
  tag: string;
  category: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all hover:bg-white/[0.05] hover:border-white/20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-max mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
          {tag}
        </span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">
        {category}
      </p>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm font-light text-gray-300 leading-relaxed mb-6">
        {description}
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white hover:text-[#d4af37] transition-colors w-max group"
      >
        <span>Explore Collection</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

export default function TimelineGallery() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gallery-header-item", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-28 md:py-32 border-b border-white/10 bg-black flex flex-col items-center overflow-hidden">
      {/* Section Header */}
      <div ref={headerRef} className="max-w-3xl mx-auto text-center px-6 mb-16 sm:mb-24">
        <div className="gallery-header-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            02 / Portfolio & Journey
          </span>
        </div>
        <h2 className="gallery-header-item text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
          Curated Showcase
        </h2>
        <p className="gallery-header-item text-xs sm:text-sm md:text-base font-light text-gray-300 max-w-xl mx-auto leading-relaxed">
          A visual and narrative glimpse into our premium surface collections, luxury bath installations, and architectural showroom displays.
        </p>
      </div>

      <div className="relative w-full max-w-[1200px] px-6">
        {/* Central Vertical Timeline Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-[33px] bottom-[33px] z-0 w-px -translate-x-1/2 bg-white/15" />

        <div className="hidden md:flex absolute left-1/2 top-0 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-white/20 bg-black items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>

        {/* Items Showcase List */}
        <div className="relative z-10 flex flex-col gap-16 pt-12 pb-12 md:gap-24 md:pt-24 md:pb-24">
          {showcaseItems.map((item, i) => {
            const isLeftImage = item.align === "start";

            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full">
                {/* Desktop Left Slot */}
                <div className={isLeftImage ? "order-1" : "order-2 md:order-1"}>
                  {isLeftImage ? (
                    <RevealImage src={item.src} ratio={item.ratio} />
                  ) : (
                    <TextCard
                      tag={item.tag}
                      category={item.category}
                      title={item.title}
                      description={item.description}
                    />
                  )}
                </div>

                {/* Desktop Right Slot */}
                <div className={isLeftImage ? "order-2" : "order-1 md:order-2"}>
                  {isLeftImage ? (
                    <TextCard
                      tag={item.tag}
                      category={item.category}
                      title={item.title}
                      description={item.description}
                    />
                  ) : (
                    <RevealImage src={item.src} ratio={item.ratio} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block absolute bottom-0 left-1/2 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-white/20 bg-black" />
      </div>
    </section>
  );
}