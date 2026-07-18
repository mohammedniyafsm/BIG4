"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const images = [
  // "/11.png",
  // "/33.png",
  // "/22.png",
  // "/44.png",
  "/677276fd561b48d392692e3b_LEATHER-min.png",
  "/677276fd561b48d392692e3c_FABRIC-min.png",
  "/677276fd561b48d392692e3d_STONE-min.png",
  "/677276fd561b48d392692e3a_WOOD-min.png",
  "/677276fd561b48d392692e39_METAL-min.png",
];

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    let current = 0;
    let tl: gsap.core.Timeline | null = null;
    let isMounted = true;

    const distance = window.innerHeight * 0.45;

    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current], {
        y: 120,
        opacity: 0,
      });

      gsap.to([line1Ref.current, line2Ref.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.7,
      });

      const playAnimation = () => {
        if (!imgRef.current || !isMounted) return;

        gsap.set(imgRef.current, {
          y: distance,
          opacity: 0,
          rotate: -360,
          scale: 0.7,
        });

        tl = gsap.timeline({
          onComplete: () => {
            if (!isMounted) return;

            current = (current + 1) % images.length;
            setIndex(current);
            playAnimation();
          },
        });

        tl.to(imgRef.current, {
          y: 0,
          opacity: 1,
          rotate: 0,
          scale: 1,
          duration: 1.6,
          ease: "expo.out",
        })
          .to({}, { duration: 0.7 })
          .to(imgRef.current, {
            y: -distance,
            opacity: 0,
            rotate: 360,
            scale: 0.8,
            duration: 1.6,
            ease: "expo.in",
          });
      };

      playAnimation();
    });

    return () => {
      isMounted = false;
      tl?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">

      {/* Floating Image */}
      <div
        ref={imgRef}
        className="absolute z-0 will-change-transform"
      >
        <Image
          src={images[index]}
          alt=""
          width={500}
          height={500}
          priority
          className="
            w-[150px]
            sm:w-[160px]
            md:w-[190px]
            lg:w-[250px]
            xl:w-[400px]
            2xl:w-[380px]
            h-auto
            object-contain
            select-none
          "
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 pointer-events-none">

        <h1
          className="
    text-center
    uppercase
    font-black
    leading-[1.0]
    tracking-[-0.04em]
    mix-blend-difference
    select-none
    font-bold

    text-[9vw]
    sm:text-[10vw]
    md:text-[10vw]
    lg:text-[8vw]
    xl:text-[7vw]
    2xl:text-[7vw]
  "
        >
          <div className="overflow-hidden">
            <div ref={line1Ref}>Living</div>
          </div>

          <div className="overflow-hidden">
            <div ref={line2Ref}>Experience</div>
          </div>
        </h1>

      </div>


      <div className="absolute bottom-8 lg:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">

        <span className="text-[8px] lg:text-[10px]  uppercase  mix-blend-difference text-white">
          Scroll Down
        </span>
      </div>

    </section>
  );
}