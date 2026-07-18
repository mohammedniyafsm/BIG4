"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  ["Tiles", "Sanitary", "Bathrooms", "Interior work"],

  ["Kitchen", "Fittings", "Closets","Gum"],

  ["Pipes"],
];

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".category-row", {
        opacity: 0,
        y: 60,
      });

      gsap.to(".category-row", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.18,

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black py-24 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="space-y-3 lg:space-y-4">

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="
                category-row
                flex
                flex-wrap
                justify-start
                md:justify-center
                gap-3
              "
            >
              {row.map((item) => (
                <button
                  key={item}
                  className="
                    group
                    relative
                    overflow-hidden
                    cursor-pointer
                    h-10
                    lg:h-11

                    rounded-full

                    border
                    border-[#939393]

                    bg-transparent

                    px-5
                    lg:px-6

                    uppercase

                    text-[13px]
                    sm:text-[12px]
                    lg:text-[13px]

                    tracking-[0.08em]

                    font-medium

                    text-white

                    transition-all
                    duration-500
                    ease-out

                    hover:border-white
                  "
                >
                  <span
                    className="
                      absolute
                      inset-0

                      origin-left
                      scale-x-0

                      bg-white

                      transition-transform
                      duration-500
                      ease-[cubic-bezier(.76,0,.24,1)]

                      group-hover:scale-x-100
                    "
                  />

                  <span
                    className="
                      relative
                      z-10
                      font-black
                      transition-colors
                      duration-500

                      group-hover:text-black
                    "
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}