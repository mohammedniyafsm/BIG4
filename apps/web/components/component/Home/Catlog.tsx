"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !buttonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 120,
        scale: 0.92,
        rotateX: 18,
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 40,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 2,
        ease: "expo.out",
      });

      tl.to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
        },
        "-=0.7"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-0 flex lg:min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center justify-center px-6 sm:px-10 lg:px-16">
        <h1
          ref={titleRef}
          className="text-center font-black uppercase leading-none tracking-[-0.06em] text-[10vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[8vw] 2xl:text-[7vw] will-change-transform"
        >
          CATALOG
        </h1>

        <button
          ref={buttonRef}
          className="group relative mt-10 flex h-12 cursor-pointer items-center gap-4 overflow-hidden border border-[#3a3a3a] px-8 text-[9px] font-semibold uppercase tracking-[0.14em] text-white sm:mt-10 sm:text-[10px] lg:mt-14 lg:text-[11px]"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />

          <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
            SEE ALL PRODUCTS
          </span>

          <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}