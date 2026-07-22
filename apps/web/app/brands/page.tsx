"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FullscreenMenu from "@/components/component/Home/FullscreenMenu";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";
import PageLoader from "@/components/ui/PageLoader";

gsap.registerPlugin(ScrollTrigger);

const availableImages = [
  "/44.webp",
  "/77.webp",
  "/80.webp",
  "/81.jpg",
  "/45.webp",
  "/46.jpg",
];

const categories = [
  "All",
  "Ceramics & Tiles",
  "Sanitaryware",
  "Bath Fittings",
  "Luxury Bath",
  "Designer Surfaces",
  "Building Materials",
  "Pipes & Fittings",
];

const brandData: { name: string; category: string }[] = [
  { name: "Simpolo", category: "Ceramics & Tiles" },
  { name: "Italus", category: "Luxury Bath" },
  { name: "Hindware", category: "Sanitaryware" },
  { name: "Naveen Ceramics", category: "Ceramics & Tiles" },
  { name: "Marbito Ceramic", category: "Ceramics & Tiles" },
  { name: "Somany", category: "Ceramics & Tiles" },
  { name: "Anjani Tile", category: "Ceramics & Tiles" },
  { name: "Asian Paints Bathsense", category: "Bath Fittings" },
  { name: "Johnson", category: "Ceramics & Tiles" },
  { name: "Vanora", category: "Luxury Bath" },
  { name: "Jaquar", category: "Bath Fittings" },
  { name: "Parryware", category: "Sanitaryware" },
  { name: "Futura", category: "Designer Surfaces" },
  { name: "Brizzio", category: "Luxury Bath" },
  { name: "Varmora", category: "Ceramics & Tiles" },
  { name: "Watercare", category: "Bath Fittings" },
  { name: "Acebond", category: "Building Materials" },
  { name: "JK Tile Adhesive", category: "Building Materials" },
  { name: "Watertec", category: "Bath Fittings" },
  { name: "Sintex", category: "Sanitaryware" },
  { name: "Astral Pipes", category: "Pipes & Fittings" },
  { name: "Ashirvad", category: "Pipes & Fittings" },
];

const brands = brandData.map((item, index) => ({
  ...item,
  image: availableImages[index % availableImages.length],
}));

export default function OurBrands() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const brandsWrapperRef = useRef<HTMLElement>(null);
  const brandsContainerRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBrands =
    activeCategory === "All"
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  /* ── Hero Entrance Animation ── */
  useEffect(() => {
    if (!pageRef.current || !titleRef.current || !copyRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-eyebrow",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.8 }
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

  /* ── Pinned Horizontal Side-Scroll & Filter Handling ── */
  useEffect(() => {
    if (!brandsWrapperRef.current || !brandsContainerRef.current) return;

    const container = brandsContainerRef.current;
    const wrapper = brandsWrapperRef.current;

    let anim: gsap.core.Tween | null = null;

    // Immediately reset container horizontal offset to start position (x: 0) on filter change
    gsap.set(container, { x: 0 });

    const timeoutId = setTimeout(() => {
      const getScrollDistance = () => container.scrollWidth - window.innerWidth;
      const scrollDistance = getScrollDistance();

      // Only create horizontal pinned scroll if items overflow the screen width
      if (scrollDistance > 30) {
        // Calibrated scroll duration for smooth responsive transition to next section
        const pinDuration = Math.min(scrollDistance * 2.5, 6000);

        anim = gsap.to(container, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.5,
            start: "top top",
            end: () => `+=${pinDuration}`,
            invalidateOnRefresh: true,
          },
        });
      }

      // Smooth entrance stagger for filtered brand cards
      gsap.fromTo(
        ".brand-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" }
      );

      ScrollTrigger.refresh();
    }, 60);

    return () => {
      clearTimeout(timeoutId);
      if (anim) {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      }
      gsap.set(container, { x: 0 });
    };
  }, [activeCategory]);

  return (
    <>
      <PageLoader />
      <div ref={pageRef} className="min-h-screen w-full bg-white text-[#121212]">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme="light" />
        <FullscreenMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ── Hero Section ── */}
        <section className="px-6 pb-12 pt-40  md:pt-28 lg:pt-40 sm:px-8 max-w-3xl mx-auto text-center flex flex-col items-center justify-center min-h-screen">
          <p className="hero-eyebrow mb-4 text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6f5f4a] whitespace-nowrap">
            Elite Tiles & Sanitary Ware
          </p>
          <h1
            ref={titleRef}
            className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-[#121212] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="block overflow-hidden">
              <span className="inline-block title-line">Premium Brands,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block title-line">Elevated.</span>
            </span>
          </h1>
          <p
            ref={copyRef}
            className="font-inter mt-4 w-full max-w-xl text-xs leading-5 text-[#4a4a4a] sm:text-xs font-light flex flex-wrap justify-center gap-x-[0.28em] gap-y-0"
          >
            {"Discover a deeply curated portfolio of world-class names in tiles, sanitary ware, and bath fittings. Engineered for exceptional spaces, crafted for enduring luxury."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="inline-block overflow-hidden py-0.5">
                  <span className="inline-block copy-word">{word}</span>
                </span>
              ))}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto items-center justify-center gap-4">
            <a
              href="#brand-grid"
              className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full bg-[#121212] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2b2b2b]"
            >
              View collection
            </a>
            <Link
              href="/"
              className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full border border-[#121212]/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#121212] transition hover:bg-[#121212] hover:text-white"
            >
              Back home
            </Link>
          </div>
        </section>

        {/* ── Pinned GSAP Horizontal Scroll Brands Showcase (Mobile & Desktop) ── */}
        <section
          ref={brandsWrapperRef}
          id="brand-grid"
          className="relative w-full min-h-screen bg-white py-16 flex flex-col justify-center overflow-hidden"
        >
          {/* Centered Heading */}
          <div className="w-full text-center mb-8 px-6">
            <h2 className="text-4xl font-black uppercase leading-[1.0] tracking-tight text-[#121212] sm:text-5xl lg:text-6xl">
              Our Brands
            </h2>
          </div>

          {/* GSAP Horizontal Track with Left Padding */}
          <div className="relative flex items-center overflow-hidden w-full">
            <div
              ref={brandsContainerRef}
              className="flex items-start gap-6 sm:gap-8 lg:gap-10 pl-6 sm:pl-12 lg:pl-20 pr-12 lg:pr-24 w-max"
            >
              {filteredBrands.map((brand, i) => (
                <article
                  key={brand.name + i}
                  className="brand-card flex-shrink-0 w-[80vw] sm:w-[48vw] md:w-[38vw] lg:w-[30vw] xl:w-[26vw] cursor-pointer group"
                >
                  {/* Clean 4:3 Landscape Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0ede9]">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      priority={i < 4}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 38vw, 26vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Brand name and category label under image */}
                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#121212]">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e8c7a]">
                      {brand.category}
                    </p>
                  </div>
                </article>
              ))}

              {/* Trailing space element to ensure final card is fully visible before unpinning */}
              <div className="flex-shrink-0 w-12 lg:w-24" aria-hidden="true" />
            </div>
          </div>

          {/* Category Filter Pills — left-aligned wrapping chips (matches reference) */}
          <div className="mt-10 w-full px-6 sm:px-10 lg:px-20">
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-white text-[#6f5f4a] border-[#ccc0b0] hover:border-[#121212] hover:text-[#121212]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Site Footer Component */}
        <SiteFooter bgColor="bg-white" textColor="text-black" />
      </div>
    </>
  );
}