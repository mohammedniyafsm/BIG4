"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = [
  {
    step: "01",
    title: "INSPIRE",
    src: "/44.webp",
    copy: "Handpicked surface and bath collections combining timeless architectural design with modern craftsmanship.",
  },
  {
    step: "02",
    title: "SELECT",
    src: "/45.webp",
    copy: "Expert guidance to help choose materials tailored to your aesthetic, project specifications, and budget.",
  },
  {
    step: "03",
    title: "COMPLETE",
    src: "/46.jpg",
    copy: "End-to-end service from personalized consultation and product selection to reliable delivery and support.",
  },
];

export default function Exper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyCardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !stickyCardsRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance animations
      gsap.from(".hero-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.from(".hero-paragraph", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // Sticky Stacked Cards ScrollTrigger Animation
      const cardElements = cardRefs.current.filter(Boolean);
      const totalCards = cardElements.length;

      if (cardElements.length > 0) {
        // Set initial card states: card 0 visible, subsequent cards start below
        gsap.set(cardElements[0], { y: "0%", scale: 1, opacity: 1, zIndex: 1 });

        for (let i = 1; i < totalCards; i++) {
          if (!cardElements[i]) continue;
          gsap.set(cardElements[i], { y: "100%", scale: 1, opacity: 1, zIndex: i + 1 });
        }

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stickyCardsRef.current,
            start: "top top+=100",
            end: `+=${window.innerHeight * (totalCards - 0.5)}`,
            pin: true,
            scrub: 0.6,
            pinSpacing: true,
          },
        });

        for (let i = 0; i < totalCards - 1; i++) {
          const currentCard = cardElements[i];
          const nextCard = cardElements[i + 1];
          const position = i;

          if (!currentCard || !nextCard) continue;

          // Scale down current card as next card slides up
          scrollTimeline.to(
            currentCard,
            {
              scale: 0.9,
              opacity: 0.4,
              duration: 1,
              ease: "none",
            },
            position
          );

          // Slide up next card
          scrollTimeline.to(
            nextCard,
            {
              y: "0%",
              duration: 1,
              ease: "none",
            },
            position
          );

          // Animate image zoom on enter
          const nextMedia = nextCard.querySelector(".card-image");
          if (nextMedia) {
            scrollTimeline.fromTo(
              nextMedia,
              { scale: 1.12 },
              { scale: 1, duration: 1, ease: "none" },
              position
            );
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-black border-b border-white/10 pt-20 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 overflow-hidden"
    >
      <div className="w-full max-w-[96%] lg:max-w-[94%] xl:max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center flex flex-col items-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              03 / Our Philosophy
            </span>
          </div>

          <h1 className="hero-heading font-black uppercase text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none mb-4">
            8+ Years
          </h1>
          <p className="hero-paragraph text-xs sm:text-sm md:text-base font-light text-gray-300 max-w-lg leading-relaxed uppercase tracking-wider">
            Transforming Homes with Premium Surfaces & Bath Solutions.
          </p>
        </div>

        {/* Sticky Cards Stack Container */}
        <div
          ref={stickyCardsRef}
          className="relative w-full max-w-full h-[70vh] sm:h-[75vh] md:h-[75vh] flex items-center justify-center"
        >
          {sections.map((section, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={section.title}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-between gap-6 md:gap-12 px-4 sm:px-8 py-6 sm:py-8 overflow-hidden ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#777] mb-2 sm:mb-4">
                    Phase {section.step}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">
                    {section.title}
                  </h2>
                  <p className="font-inter text-xs sm:text-sm md:text-base leading-relaxed text-gray-300 max-w-md">
                    {section.copy}
                  </p>
                </div>

                {/* Media Image */}
                <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-full rounded-2xl overflow-hidden">
                  <Image
                    src={section.src}
                    alt={section.title}
                    fill
                    priority
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="card-image object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}