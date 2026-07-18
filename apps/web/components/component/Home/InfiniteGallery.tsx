"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const images = [
  "/animation/1.webp",
  "/animation/2.webp",
  "/animation/3.webp",
  "/animation/5.webp",
];

export default function InfiniteGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(
        trackRef.current!.querySelectorAll(".gallery-slide")
      );
      const imgs = gsap.utils.toArray<HTMLElement>(
        trackRef.current!.querySelectorAll(".gallery-image")
      );

      let current = 0;
      const getWidth = () => wrapperRef.current!.clientWidth;

      gsap.set(trackRef.current, { x: 0 });

      imgs.forEach((img, i) => {
        gsap.fromTo(
          img,
          { scale: 1.12, xPercent: -3, yPercent: -2 },
          {
            scale: 1.04,
            xPercent: 3,
            yPercent: 2,
            duration: 10,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.15,
          }
        );
      });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "expo.inOut" },
      });

      const total = images.length;

      for (let i = 0; i < total; i++) {
        const targetIndex = i + 1; // <-- snapshot for this iteration

        // Hold the image
        tl.to({}, { duration: 1.1 });

        // Push to next image
        tl.to(trackRef.current, {
          x: () => -(targetIndex * getWidth()),
          duration: 1.35,
          ease: "expo.inOut",
          onStart: () => {
            current = targetIndex; // update tracked index only when this tween actually runs
          },
        });

        // Small momentum
        tl.to(
          trackRef.current,
          {
            x: () => -(targetIndex * getWidth()) - 10,
            duration: 0.12,
            ease: "power1.out",
          },
          "-=0.18"
        );

        // Settle back
        tl.to(trackRef.current, {
          x: () => -(targetIndex * getWidth()),
          duration: 0.15,
          ease: "power2.out",
        });

        // Active image punch
        tl.fromTo(
          imgs[i % total],
          { scale: 1.08 },
          { scale: 1.03, duration: 1.4, ease: "expo.out" },
          "<"
        );
      }

      // Seamless reset
      tl.set(trackRef.current, {
        x: 0,
        onComplete: () => {
          current = 0;
        },
      });

      const resize = () => {
        gsap.set(trackRef.current, {
          x: -(current * getWidth()),
        });
      };

      window.addEventListener("resize", resize);

      return () => {
        window.removeEventListener("resize", resize);
      };
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="bg-black py-6 lg:py-8">
      <div
        ref={wrapperRef}
        className="relative overflow-hidden mx-auto w-[92vw] md:w-[92vw] lg:w-[92vw]"
      >
        <div ref={trackRef} className="gallery-track flex">
          {[...images, images[0]].map((src, index) => (
            <div
              key={index}
              className="gallery-slide relative shrink-0 overflow-hidden w-[92vw] md:w-[92vw] lg:w-[92vw] h-[72vh] md:h-[78vh] lg:h-[78vh]"
            >
              <Image
                src={src}
                alt=""
                fill
                priority
                quality={90}
                sizes="92vw"
                className="gallery-image object-cover will-change-transform select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}