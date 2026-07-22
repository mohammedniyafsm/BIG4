"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/config/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experinces() {
    const containerRef = useRef<HTMLDivElement>(null);
    const desktopHeadingRef = useRef<HTMLHeadingElement>(null);
    const desktopParagraphRef = useRef<HTMLDivElement>(null);
    const badgesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    once: true,
                },
            });

            // Eyebrow reveal
            tl.from(".story-eyebrow", {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: "power4.out",
            })
            // Heading lines masked reveal
            .from(
                desktopHeadingRef.current?.querySelectorAll(".heading-line") || [],
                {
                    yPercent: 100,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power4.out",
                },
                "-=0.5"
            )
            // Paragraph stagger
            .from(
                desktopParagraphRef.current?.querySelectorAll("p") || [],
                {
                    y: 35,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                },
                "-=0.6"
            )
            // Feature Badges stagger
            .from(
                badgesRef.current?.querySelectorAll(".feature-badge") || [],
                {
                    y: 25,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.4"
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="story"
            ref={containerRef}
            className="w-full py-24 sm:py-32 md:py-40 px-6 border-b border-white/10 flex flex-col items-center justify-center text-center bg-black relative overflow-hidden"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                {/* Eyebrow tag */}
                <div className="story-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                        01 / Our Story
                    </span>
                </div>

                <h1 ref={desktopHeadingRef} className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-8 leading-tight max-w-3xl">
                    <span className="block overflow-hidden">
                        <span className="inline-block heading-line">The Experience Begins</span>
                    </span>
                    <span className="block overflow-hidden mt-1 sm:mt-2">
                        <span className="inline-block heading-line text-gray-400">With BIG4 Tiles</span>
                    </span>
                </h1>

                <div ref={desktopParagraphRef} className="text-sm sm:text-base md:text-lg font-sans font-normal text-gray-300 max-w-2xl leading-relaxed text-center space-y-4 mb-12">
                    <p className="normal-case">Since {siteConfig.founded}, BIG4 Tiles & Sanitary has transformed residential and commercial spaces across the region with world-class surface and bath solutions.</p>
                    <p className="normal-case text-gray-400">Trusted by architects, designers, and homeowners, we combine curated global brands with personalized expert consultation to bring architectural visions to life.</p>
                </div>

                {/* Feature Highlights Grid */}
                <div ref={badgesRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-8 border-t border-white/10">
                    <div className="feature-badge p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex flex-col items-center transition-transform hover:-translate-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white">Curated Selection</span>
                        <span className="text-[11px] font-sans text-gray-400 mt-1">World-class premium surfaces</span>
                    </div>

                    <div className="feature-badge p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex flex-col items-center transition-transform hover:-translate-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white">Global Brands</span>
                        <span className="text-[11px] font-sans text-gray-400 mt-1">Direct authorized partners</span>
                    </div>

                    <div className="feature-badge p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex flex-col items-center transition-transform hover:-translate-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white">Expert Guidance</span>
                        <span className="text-[11px] font-sans text-gray-400 mt-1">End-to-end consultation</span>
                    </div>
                </div>
            </div>
        </section>
    );
}