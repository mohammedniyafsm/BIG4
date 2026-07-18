"use client";

import BrandCard from "@/components/ui/BrandCard";

// const brands = [
//   "Simpolo",
//   "Italus",
//   "Hindware",
//   "Naveen Ceramics",
//   "Marbito Ceramic",
//   "Somany",
//   "Anjani Tile",
//   "Asian Paints Bathsense",
//   "Johnson",
//   "Vanora",
//   "Jaquar",
//   "Parryware",
//   "Futura",
//   "Brizzio",
//   "Varmora",
//   "Watercare",
//   "Acebond",
//   "JK Tile Adhesive",
//   "Watertec",
//   "Sintex",
//   "Astral Pipes",
//   "Ashirvad",
// ];

const brands = [
  "Simpolo",
  "Italus",
  "Hindware",
  "Somany",
  "Johnson",
  "Vanora",
  "Jaquar",
  "Futura",
  "Brizzio",
  "Varmora",
];

export default function BrandsSection() {
  return (
    <section
      id="brands"
      className="bg-black text-white overflow-hidden"
    >
      <div className="w-full pl-6 sm:pl-8 lg:pl-24 xl:pl-32 2xl:pl-96 pr-6 sm:pr-8 lg:pr-10 xl:pr-12 py-20 md:py-28 xl:py-36">

        {/* Heading */}
        <div className="mb-16 md:mb-24 lg:mb-28 max-w-[560px]">
          <h2 className="uppercase font-black leading-[0.95] tracking-[-0.05em] text-[30px] sm:text-[56px] md:text-[68px] lg:text-[56px] xl:text-[60px]">
            OUR
            <br />
            EXCLUSIVE
            <br />
            BRANDS
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-5 md:gap-8 xl:gap-10 w-full">
          {brands.map((brand) => (
            <BrandCard
              key={brand}
              title={brand}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-20 lg:mt-10">
          <button className="group relative flex items-center gap-2 md:gap-5 h-10 lg:h-14 overflow-hidden border border-[#4d4d4d] px-8 uppercase font-semibold tracking-[0.12em] pnpm text-white">

            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />

            <span  className="relative z-10 text-[8px] md:text-xs lg:text-[8px] font-black transition-colors duration-500 group-hover:text-black">
              EXPLORE OUR BRANDS
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