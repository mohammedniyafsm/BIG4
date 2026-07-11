"use client";

import Image from "next/image";

const CIRCLE_SIZE = 66;
const TOP_OFFSET = 48; // top-12 = 48px
const BOTTOM_OFFSET = 2; // bottom-14 = 56px

const images = [
  { src: "/77.webp", top: 180, left: 45, width: 160, height: 115 },
  { src: "/78.webp", top: 310, right: 40, width: 160, height: 105 },
  { src: "/79.webp", top: 500, left: 45, width: 160, height: 115 },
  { src: "/80.webp", top: 640, right: 40, width: 160, height: 180 },
  { src: "/81.jpg", top: 860, left: 120, width: 160, height: 105 },
];

// Every value multiplies by the --s custom property.
// On mobile --s is 1, so this resolves to the exact original px value.
const s = (value: number) => `calc(${value}px * var(--s, 1))`;

export default function TimelineGallery() {
  return (
    <section className="flex justify-center py-8">
      <div
        className="relative overflow-hidden [--s:1] sm:[--s:1.15] md:[--s:1.35] lg:[--s:1.6] xl:[--s:1.85]"
        style={{
          width: s(450),
          height: s(1100),
        }}
      >
        {/* ---------- TOP CIRCLE ---------- */}

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#5d5d5d]"
          style={{
            top: s(TOP_OFFSET),
            width: s(CIRCLE_SIZE),
            height: s(CIRCLE_SIZE),
          }}
        />

        {/* ---------- CENTER LINE ---------- */}

        <div
          className="absolute left-1/2 w-px -translate-x-1/2 bg-[#4b4b4b]"
          style={{
            top: s(TOP_OFFSET + CIRCLE_SIZE),
            bottom: s(BOTTOM_OFFSET + CIRCLE_SIZE),
          }}
        />

        {/* ---------- BOTTOM CIRCLE ---------- */}

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#5d5d5d]"
          style={{
            bottom: s(BOTTOM_OFFSET),
            width: s(CIRCLE_SIZE),
            height: s(CIRCLE_SIZE),
          }}
        />

        {/* ---------- LINE BELOW BOTTOM CIRCLE ---------- */}

        <div
          className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#4b4b4b]"
          style={{ height: s(BOTTOM_OFFSET) }}
        />

        {/* ---------- IMAGES ---------- */}

        {images.map((img, index) => (
          <div
            key={index}
            className="absolute overflow-hidden"
            style={{
              top: s(img.top),
              left: img.left !== undefined ? s(img.left) : undefined,
              right: img.right !== undefined ? s(img.right) : undefined,
              width: s(img.width),
              height: s(img.height),
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 160px, (max-width: 1023px) 216px, (max-width: 1279px) 256px, 296px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}