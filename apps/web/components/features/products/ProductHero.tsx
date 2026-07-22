"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ProductHero() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!pageRef.current || !titleRef.current || !copyRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-eyebrow",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          ".title-line",
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.0, stagger: 0.15 },
          "-=0.5"
        )
        .fromTo(
          ".copy-word",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.015, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta-btn",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.55"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={pageRef} 
      className="px-6 pb-12 pt-40 md:pt-28 lg:pt-40 sm:px-8 max-w-3xl mx-auto text-center flex flex-col items-center justify-center min-h-screen"
    >
      <p className="hero-eyebrow mb-4 text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6f5f4a] whitespace-nowrap">
        Elite Tiles & Sanitary Ware
      </p>
      <h1
        ref={titleRef}
        className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-[#121212] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
      >
        <span className="block overflow-hidden pb-2">
          <span className="inline-block title-line">Exquisite Collections,</span>
        </span>
        <span className="block overflow-hidden pb-2">
          <span className="inline-block title-line">Unveiled.</span>
        </span>
      </h1>
      <p
        ref={copyRef}
        className="font-inter mt-6 w-full max-w-2xl text-xs md:text-sm leading-6 text-[#4a4a4a] font-light flex flex-wrap justify-center gap-x-[0.3em] gap-y-0"
      >
        {"Discover a deeply curated portfolio of world-class tiles, sanitary ware, and bath fittings. Engineered for exceptional spaces, crafted for enduring luxury."
          .split(" ")
          .map((word, i) => (
            <span key={i} className="inline-block overflow-hidden py-0.5">
              <span className="inline-block copy-word">{word}</span>
            </span>
          ))}
      </p>

      <div className="mt-10 flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto items-center justify-center gap-4">
        <button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
          className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full bg-[#121212] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2b2b2b]"
        >
          View products
        </button>
        <a
          href="/"
          className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full border border-[#121212]/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#121212] transition hover:bg-[#121212] hover:text-white"
        >
          Back home
        </a>
      </div>
    </section>
  );
}
