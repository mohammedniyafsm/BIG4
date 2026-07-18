"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FullscreenMenu from "@/components/component/Home/FullscreenMenu";
import Navbar from "@/components/component/Home/Navbar";
import PageLoader from "@/components/ui/PageLoader";

gsap.registerPlugin(ScrollTrigger);

const brands = [
    {
        name: "MODULNOVA",
        href: "https://www.aristo-group.co.il/brands/modulnova",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    },
    {
        name: "MERIDIANI",
        href: "#",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    },
    {
        name: "DIANI",
        href: "#",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    },
    {
        name: "FIAM",
        href: "#",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    },
    {
        name: "SANGIACOMO",
        href: "#",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    },
    {
        name: "MOLTENI&C",
        href: "#",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    },
    {
        name: "RIMADESIO",
        href: "#",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    },
];

const filters = [
    { label: "ALL", icon: null },
    { label: "WARDROBES", icon: "wardrobe" },
    { label: "FURNITURE", icon: "furniture" },
    { label: "APPLIENCES", icon: "appliance" },
];

export default function OurBrands() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        const rail = railRef.current;
        if (!section || !rail) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".brand-card", rail);

            // Scroll-scrubbed effect: cards travel right -> left in place,
            // tied directly to how far the user has scrolled through the
            // section (not a one-off play-once entrance). Each card gets a
            // slightly different starting offset + scrub speed so they don't
            // all move in lockstep — gives a subtle parallax feel.
            // The rail itself is still freely swipeable/scrollable by the
            // user on top of this; the page never gets pinned or hijacked.
            cards.forEach((card, i) => {
                const offset = 60 + (i % 3) * 25; // vary starting distance a bit
                gsap.fromTo(
                    card,
                    { x: offset },
                    {
                        x: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",   // begins as section enters viewport
                            end: "bottom top",     // finishes as section leaves viewport
                            scrub: 1 + (i % 3) * 0.3, // slight stagger in scrub speed
                        },
                    }
                );
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <PageLoader />
            <div className="bg-white min-h-screen w-full">
            <style>{`
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>

            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme="light" />
            <FullscreenMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <section ref={sectionRef} className="relative w-full">
                {/* Heading */}
                <div className="pt-28 pb-6 md:pb-10 flex justify-center items-center uppercase">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-background">
                        our brands
                    </h1>
                </div>

                {/* Brand Rail */}
                <div
                    ref={railRef}
                    className="no-scrollbar w-full overflow-x-auto overflow-y-hidden py-8"
                >
                    <div className="flex w-max items-start gap-1 md:gap-6 px-1 md:px-6">
                        {brands.map((brand) => (
                            <a
                                key={brand.name}
                                href={brand.href}
                                className="brand-card group relative flex-shrink-0 flex flex-col snap-start"
                                style={{
                                    width: "clamp(220px,40vw,380px)",
                                }}
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        draggable={false}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="pt-3">
                                    <span className="text-xs md:text-lg font-bold uppercase tracking-tight text-background">
                                        {brand.name}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter Pills */}
            <section className="pt-10 pb-10">
                <div className="flex flex-wrap justify-center gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.label}
                            className="rounded-full border border-background/30 px-2 py-2 text-[8px] md:text-sm font-semibold uppercase transition hover:bg-black text-black hover:text-white"
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
        </>
    );
}