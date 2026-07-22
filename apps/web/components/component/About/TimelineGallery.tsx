"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const images = [
  { src: "/77.webp", ratio: 170 / 125, align: "start" as const },
  { src: "/78.webp", ratio: 190 / 120, align: "end" as const },
  { src: "/79.webp", ratio: 170 / 125, align: "start" as const },
  { src: "/80.webp", ratio: 190 / 215, align: "end" as const },
  { src: "/81.jpg", ratio: 170 / 115, align: "start" as const },
];

function RevealImage({ src, ratio }: { src: string; ratio: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipBottom = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const clipPath = useTransform(clipBottom, (v) => `inset(0% 0% ${Math.max(v, 0)}% 0%)`);
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl" style={{ aspectRatio: ratio }}>
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <motion.div style={{ y }} className="absolute inset-0 h-[124%] -top-[12%]">
          <Image src={src} alt="" fill sizes="(max-width: 1023px) 60vw, 484px" className="object-cover" />
        </motion.div>
      </motion.div>
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
      <div ref={headerRef} className="max-w-3xl mx-auto text-center px-6 mb-12 sm:mb-16">
        <div className="gallery-header-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            02 / Portfolio & Journey
          </span>
        </div>
        <h2 className="gallery-header-item text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
          Curated Showcase
        </h2>
        <p className="gallery-header-item text-xs sm:text-sm md:text-base font-light text-gray-300 max-w-xl mx-auto leading-relaxed">
          A visual glimpse into our premium surface collections, luxury bath installations, and architectural showroom displays.
        </p>
      </div>

      <div className="relative w-full max-w-[1100px] px-6">
        <div className="absolute left-1/2 top-[33px] bottom-[33px] z-0 w-px -translate-x-1/2 bg-[#4b4b4b]" />

        <div className="absolute left-1/2 top-0 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-[#5d5d5d] bg-[color:var(--page-bg,#000000)] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col gap-16 pt-36 pb-36 md:gap-24 md:pt-44 md:pb-44 lg:gap-32">
          {images.map((img, i) => (
            <div
              key={i}
              className={
                "w-[62%] sm:w-[55%] md:w-[48%] lg:w-[44%] " +
                (img.align === "start" ? "self-start" : "self-end")
              }
            >
              <RevealImage src={img.src} ratio={img.ratio} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-1/2 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-[#5d5d5d] bg-[color:var(--page-bg,#000000)]" />
      </div>
    </section>
  );
}