"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ShowroomCardProps {
  images: string[];
  mapUrl?: string;
  title: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

export default function ShowroomCard({
  images,
  mapUrl,
  title,
  city,
  address,
  phone,
  email,
}: ShowroomCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSlides = images.length + (mapUrl ? 1 : 0);

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current || !contentRef.current)
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(imageRef.current, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power4.out",
      });

      tl.from(
        contentRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.45"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { opacity: 0.4, scale: 1.03 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      }
    );
  }, [currentImage]);

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-[1180px]">

      {/* Image */}

      <div
        ref={imageRef}
        className="relative aspect-[16/9] overflow-hidden bg-[#111111]"
      >
        {currentImage < images.length ? (
          <Image
            src={images[currentImage]}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <iframe 
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        )}

        {/* Previous */}

        {totalSlides > 1 && (
          <button
            onClick={previousImage}
            className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur transition hover:border-white hover:bg-black/40 z-10"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next */}

        {totalSlides > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur transition hover:border-white hover:bg-black/40 z-10"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Content */}

      <div
        ref={contentRef}
        className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
      >
        {/* Left */}

        <div className="max-w-[650px]">

          <h3 className="text-[24px] font-bold uppercase leading-none tracking-[-0.04em] lg:text-[34px]">
            {title}
          </h3>

          <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-neutral-500">
            {city}
          </p>

          <div className="mt-8 space-y-3 font-inter text-[15px] leading-7 text-neutral-400">
            <p>{address}</p>
            <p>{phone}</p>
            <p>{email}</p>
          </div>

        </div>

        {/* Right */}

        <div className="flex flex-col items-start gap-8 lg:items-end">

          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Navigate
          </p>

          <button className="group relative flex h-12 items-center gap-4 overflow-hidden border border-[#404040] px-8 text-[10px] font-semibold uppercase tracking-[0.16em]">

            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />

            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              Contact Us
            </span>

            <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
              ↗
            </span>

          </button>

        </div>
      </div>
    </section>
  );
}