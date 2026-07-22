"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { siteConfig } from "@/lib/config/site";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-eyebrow", {
        y: -15,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      })
        .from(
          ".hero-title-line",
          {
            y: "100%",
            opacity: 0,
            duration: 1,
            stagger: 0.15,
          },
          "-=0.5"
        )
        .from(
          ".hero-copy-word",
          {
            y: "100%",
            opacity: 0,
            duration: 0.6,
            stagger: 0.02,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta-btn",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.4"
        );

      // Scroll parallax on outer container (no opacity conflicts)
      if (bgParallaxRef.current) {
        gsap.to(bgParallaxRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Smooth slow Ken Burns ambient zoom on inner image
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          scale: 1.12,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden bg-black text-white px-6 pt-32 pb-20 sm:px-8 border-b border-white/10"
    >
      {/* Background Image Container */}
      <div ref={bgParallaxRef} className="absolute inset-0 z-0 h-[120%] -top-[10%] opacity-25 pointer-events-none">
        <div ref={bgImageRef} className="relative w-full h-full">
          <Image
            src="/45.webp"
            alt="Luxury Tile Texture"
            fill
            priority
            className="object-cover object-center mix-blend-luminosity pointer-events-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
      </div>

      {/* Main Content Container matching Brands page layout */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <p className="hero-eyebrow mb-4 text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[#555] whitespace-nowrap">
          About {siteConfig.legalName}
        </p>

        {/* Short Headline */}
        <h1 className="w-full flex flex-col items-center justify-center text-[12vw] font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center">
          <span className="flex w-full justify-center overflow-hidden">
            <span className="inline-block hero-title-line">Crafting</span>
          </span>
          <span className="flex w-full justify-center overflow-hidden">
            <span className="inline-block hero-title-line text-gray-400">Spaces.</span>
          </span>
        </h1>

        {/* Split Word Animated Subtext */}
        <p className="font-inter mt-4 w-full max-w-xl text-xs sm:text-xs leading-5 text-gray-400 font-light flex flex-wrap justify-center gap-x-[0.28em] gap-y-0">
          {`Transforming homes and commercial projects with world-class surface solutions and luxury bath fittings since ${siteConfig.founded}.`
            .split(" ")
            .map((word, i) => (
              <span key={i} className="inline-block overflow-hidden py-0.5">
                <span className="inline-block hero-copy-word">{word}</span>
              </span>
            ))}
        </p>

        {/* Pill-shaped CTA buttons matching Brands page */}
        <div className="mt-8 flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto items-center justify-center gap-4">
          <a
            href="#story"
            className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200"
          >
            Explore Story
          </a>
          <Link
            href="/products"
            className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
          >
            Our Products
          </Link>
        </div>

        {/* Social Media Links */}
        {(siteConfig.social.instagram || siteConfig.social.facebook || siteConfig.social.youtube || siteConfig.social.linkedin) && (
          <div className="mt-10 flex items-center justify-center gap-8 hero-cta-btn">
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {siteConfig.social.youtube && (
              <a href={siteConfig.social.youtube} className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/></svg>
              </a>
            )}
            {siteConfig.social.linkedin && (
              <a href={siteConfig.social.linkedin} className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}