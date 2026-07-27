"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BrandCardProps {
  title: string;
  imageUrl?: string | null;
}

export default function BrandCard({ title, imageUrl }: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

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

  const hasValidImage = Boolean(imageUrl && !imgError);

  return (
    <div
      ref={cardRef}
      className="group relative flex items-center justify-center w-full aspect-[2.25/1] overflow-hidden border border-[#1d1d1d] bg-[#111111]"
    >
      {/* Background Image with Blur & Reduced Opacity */}
      {hasValidImage && (
        <>
          <Image
            src={imageUrl!}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover opacity-40 blur-[2px] transition-all duration-700 group-hover:scale-105 group-hover:opacity-55 group-hover:blur-[1px]"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/60 z-10 pointer-events-none" />
        </>
      )}

      {/* Brand Name Text Overlay (Always visible & centered on top) */}
      <div
        ref={textRef}
        className={`relative z-20 will-change-transform text-white font-black uppercase tracking-tight leading-none text-center whitespace-nowrap px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${textClass}`}
      >
        {title}
      </div>
    </div>
  );
}