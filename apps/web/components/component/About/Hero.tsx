"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ---------- Load-in animation: heading rises up into place ----------
      gsap.from(headingRef.current, {
        y: 120,
        opacity: 0,
        duration: 1.3,
        ease: "power4.out",
        delay: 1.0,
      });

      gsap.from(scrollHintRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.2,
      });

      // ---------- Hide "Scroll Down" as soon as scrolling starts ----------
      // (heading is untouched by scroll — stays exactly where it landed)
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 12,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150", // fully hidden after ~150px of scroll
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen flex justify-center items-center text-center overflow-hidden"
    >
      <div className="">
        <h1 ref={headingRef} className="text-3xl lg:text-8xl font-black">
          CRAFTING <br />
          SPACES
        </h1>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 lg:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-[8px] lg:text-[10px] uppercase mix-blend-difference text-white">
          Scroll Down
        </span>
      </div>
    </div>
  );
}