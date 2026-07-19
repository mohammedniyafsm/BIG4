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
    title: "INSPIRE",
    src: "/44.webp",
    copy: "Discover collections that combine timeless design, exceptional craftsmanship, and lasting quality. From elegant tiles to modern sanitaryware and bath fittings, every product is selected to elevate your living spaces.",
  },
  {
    title: "SELECT",
    src: "/45.webp",
    copy: "Our experts help you choose products that complement your style, budget, and project requirements. With personalized guidance and trusted recommendations, we make creating beautiful spaces effortless.",
  },
  {
    title: "COMPLETE",
    src: "/46.jpg",
    copy: "Every project deserves dependable service. From consultation and product selection to timely delivery and after-sales support, BIG4 is committed to making your journey smooth from start to finish.",
  },
];

export default function Exper() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debug = false;

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const heroHeading = heroRef.current?.querySelectorAll(".hero-heading");
      const heroParagraph = heroRef.current?.querySelectorAll(".hero-paragraph");

      if (heroHeading && heroParagraph) {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 70%",
            once: true,
            toggleActions: "play none none none",
          },
        });

        heroTimeline
          .fromTo(
            heroHeading,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
            }
          )
          .fromTo(
            heroParagraph,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.05,
            },
            "-=" + 0.25
          );
      }

      const isMobile = window.innerWidth < 768;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const content = section.querySelector(".section-content");
        const heading = content?.querySelector("h1");
        const paragraph = content?.querySelector("p");
        const media = section.querySelector(".section-media");

        if (!content || !heading || !paragraph) return;

        const tlSection = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 52%",
            once: true,
            toggleActions: "play none none none",
            markers: debug,
          },
        });

        tlSection
          .fromTo(
            heading,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: index * 0.05,
            }
          )
          .fromTo(
            paragraph,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=" + 0.25
          );

        if (isMobile && media) {
          tlSection.fromTo(
            media,
            { opacity: 0, y: 40, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "+=0.12"
          );
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={heroRef}>
        {/* mobile hero */}
        <div className="flex flex-col justify-center items-center text-center gap-4 py-20 md:hidden">
          <h1 className="hero-heading text-3xl font-black uppercase">
            8+ <br /> years
          </h1>
          <p className="hero-paragraph text-xs px-4 uppercase font-black">
            Transforming Homes with Premium Surfaces & Bath Solutions.
          </p>
        </div>

        {/* desktop hero */}
        <div className="hidden md:flex flex-col justify-center items-center text-center gap-4 py-20">
          <h1 className="hero-heading font-black uppercase text-6xl lg:text-8xl xl:text-9xl">
            8+ <br /> years
          </h1>
          <p className="hero-paragraph uppercase font-black mt-8 px-4 text-base lg:text-lg">
            Transforming Homes with Premium Surfaces <br /> & Bath Solutions.
          </p>
        </div>

        {/* sections */}
        <div className="py-16 flex flex-col gap-16 md:gap-28 md:px-6 lg:px-16">
          {sections.map((section, index) => {
            const imageLeft = index % 2 === 0;

            return (
              <div
                key={section.title}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className={`px-6 md:px-0 flex flex-col md:items-center md:gap-20 lg:gap-28 xl:gap-40 ${
                  imageLeft ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="section-content md:w-1/2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
                    {section.title}
                  </h1>
                  <p className="font-inter text-xs mt-4 md:mt-6 lg:mt-8 leading-5 text-[#8e8e8e] md:w-[70%]">
                    {section.copy}
                  </p>
                </div>

                <div className="section-media relative mt-6 md:mt-0 md:w-1/2 h-62.5 md:h-110 lg:h-135 xl:h-150 w-full overflow-hidden">
                  <Image
                    src={section.src}
                    alt={section.title}
                    fill
                    priority
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}