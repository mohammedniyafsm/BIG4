"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BrandCardProps {
  title: string;
}

export default function BrandCard({ title }: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
      });

      gsap.set(cardRef.current, {
        opacity: 0,
        y: 70,
      });

      gsap.set(textRef.current, {
        opacity: 0,
        scaleX: 0,
        clipPath: "inset(0 50% 0 50%)",
        transformOrigin: "center center",
        filter: "blur(10px)",
      });

      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
      }).to(
        textRef.current,
        {
          opacity: 1,
          scaleX: 1,
          clipPath: "inset(0 0% 0 0%)",
          filter: "blur(0px)",
          duration: 1,
          ease: "expo.out",
        },
        "-=0.45"
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const textClass =
    title.length > 22
      ? "text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]"
      : title.length > 16
      ? "text-[12px] sm:text-[16px] md:text-[18px] lg:text-[22px] xl:text-[24px]"
      : "text-sm sm:text-xl md:text-2xl lg:text-[28px] xl:text-[30px]";

  return (
    <div
      ref={cardRef}
      className="relative flex items-center justify-center w-full aspect-[2.25/1] overflow-hidden border border-[#1d1d1d] bg-[#111111]"
    >
      <div
        ref={textRef}
        className={`will-change-transform text-white font-semibold uppercase tracking-tight leading-none text-center whitespace-nowrap px-4 ${textClass}`}
      >
        {title}
      </div>
    </div>
  );
}