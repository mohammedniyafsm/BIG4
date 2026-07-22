"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShowroomCard from "@/components/ui/ShowroomCard";

gsap.registerPlugin(ScrollTrigger);

import { siteConfig } from "@/lib/config/site";

const showroom = {
  images: ["/1.png"],
  mapUrl: siteConfig.googleMapsEmbed,
  title: `${siteConfig.name} Experience Center`,
  city: siteConfig.address.city,
  address: `${siteConfig.address.building}, ${siteConfig.address.landmark}, ${siteConfig.address.area}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}`,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
};

export default function ShowroomSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 70,
        duration: 1,
        ease: "expo.out",
      });

      tl.from(
        cardRef.current,
        {
          opacity: 0,
          y: 80,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.55"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showroom"
      className="overflow-hidden bg-black text-white"
    >
      <div
        className="
          mx-auto
          max-w-[1700px]

          px-6
          sm:px-8
          lg:px-12
          xl:px-20

          py-24
          md:py-28
          xl:py-36
        "
      >
        {/* Heading */}

        <div className="mb-16 flex justify-center md:mb-20 lg:mb-24">
          <h2
            ref={titleRef}
            className="
              text-center
              font-black
              uppercase

              leading-[0.95]
              tracking-[-0.05em]

              text-[34px]
              sm:text-[54px]
              md:text-[68px]
              lg:text-[58px]
              xl:text-[64px]
            "
          >
            SHOWROOM
          </h2>
        </div>

        {/* Card */}

        <div ref={cardRef}>
          <ShowroomCard
            images={showroom.images}
            mapUrl={showroom.mapUrl}
            title={showroom.title}
            city={showroom.city}
            address={showroom.address}
            phone={showroom.phone}
            email={showroom.email}
          />
        </div>
      </div>
    </section>
  );
}