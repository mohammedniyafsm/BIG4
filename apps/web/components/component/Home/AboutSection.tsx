"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(".about-title span", {
        yPercent: 100,
        opacity: 0,
      });

      gsap.set(".about-content > *", {
        y: 60,
        opacity: 0,
      });

      // Animation Timeline
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      })
        .to(".about-title span", {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
        })
        .to(".about-content > *", {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.18,
          ease: "power4.out",
        }, "-=0.6");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-black text-white">
      <div className="mx-auto max-w-[1700px] px-7 py-8 sm:px-10 lg:px-20 lg:py-40 xl:px-28">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2 lg:gap-36">

          {/* Left */}
          <div className="about-title">
            <h2 className="uppercase font-black tracking-[-0.06em] leading-[0.98] text-[8vw] sm:text-[8vw] md:text-[8vw] lg:text-[66px] xl:text-[5.7vw] 2xl:text-[4.0vw] lg:ml-12">
              <div className="overflow-hidden"><span className="block">PREMIUM</span></div>
              <div className="overflow-hidden"><span className="block">TILES &</span></div>
              <div className="overflow-hidden"><span className="block">SANITARY</span></div>
              <div className="overflow-hidden"><span className="block">SINCE</span></div>
              <div className="overflow-hidden"><span className="block">2017'</span></div>
            </h2>
          </div>

          {/* Right */}
          <div className="about-content w-full max-w-[470px] mx-auto lg:mx-0 lg:pt-92 xl:pt-32 lg:pt-28 xl:pt-56 pl:0 sm:pl-72 md:pl-92 lg:pl-20 xl:pl-32">

            <h3 className="uppercase font-semibold  tracking-wide text-[14px] lg:text-[18px]">
              BIG4 TILES & SANITARY
            </h3>

            <p className="mt-8 text-xs sm:text-xs font-inter w-[95%] sm:w-[300px] md:w-[360px] leading-6 text-[#9A9A9A]">
              Since 2017, BIG<span className="font-inter">4</span>  Tiles & Sanitary has been helping homeowners, architects, builders, and interior designers create exceptional spaces with premium tiles, sanitaryware, bath fittings, and surface solutions. With a commitment to quality, trusted brands, and personalized service, we deliver products that combine lasting durability with timeless design for every project.
            </p>

            <button className="group relative mt-10 lg:mt-10 flex h-12 items-center justify-center gap-3 overflow-hidden border border-[#505050] px-6 uppercase text-sm font-medium tracking-[0.08em] text-white">

              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />

              <span className="cursor-pointer relative z-10 font-bold text-[8px] sm:text-[6px] lg:text-[10px] transition-colors duration-500 group-hover:text-black">
                More About Us
              </span>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 h-4 w-4 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>

            </button>

          </div>

        </div>
      </div>
    </section>
  );
}