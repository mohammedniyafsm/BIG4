import Link from "next/link";
import BrandCard from "@/components/ui/BrandCard";
import { prisma } from "@/lib/prisma";

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

const fallbackBrands: BrandItem[] = [
  { id: "1", name: "Simpolo", slug: "simpolo" },
  { id: "2", name: "Italus", slug: "italus" },
  { id: "3", name: "Hindware", slug: "hindware" },
  { id: "4", name: "Somany", slug: "somany" },
  { id: "5", name: "Johnson", slug: "johnson" },
  { id: "6", name: "Vanora", slug: "vanora" },
  { id: "7", name: "Jaquar", slug: "jaquar" },
  { id: "8", name: "Futura", slug: "futura" },
  { id: "9", name: "Brizzio", slug: "brizzio" },
  { id: "10", name: "Varmora", slug: "varmora" },
];

interface BrandsSectionProps {
  initialBrands?: BrandItem[];
}

export default async function BrandsSection({ initialBrands }: BrandsSectionProps) {
  let displayBrands: BrandItem[] = initialBrands || [];

  if (displayBrands.length === 0) {
    try {
      displayBrands = await prisma.brand.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          { displayOrder: "asc" },
          { name: "asc" },
        ],
        take: 10,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      });
    } catch {
      // Fallback if DB fetch fails
    }
  }

  if (displayBrands.length === 0) {
    displayBrands = fallbackBrands;
  }

  return (
    <section
      id="brands"
      className="bg-black text-white overflow-hidden"
    >
      <div className="mx-auto max-w-[1700px] px-6 sm:px-8 lg:px-12 xl:px-20 py-20 md:py-28 xl:py-36 flex flex-col items-center">

        {/* Heading */}
        <div className="mb-16 md:mb-24 lg:mb-28 text-center max-w-3xl">
          <h2 className="uppercase font-black leading-[0.95] tracking-[-0.05em] text-[30px] sm:text-[56px] md:text-[68px] lg:text-[56px] xl:text-[60px] text-center">
            OUR EXCLUSIVE BRANDS
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 xl:gap-10 w-full justify-items-center items-center">
          {displayBrands.map((brand) => (
            <BrandCard
              key={brand.id || brand.name}
              title={brand.name}
              imageUrl={brand.imageUrl}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-20 flex justify-center">
          <Link href="/brands" className="group relative flex items-center gap-2 md:gap-5 h-10 lg:h-14 overflow-hidden border border-[#4d4d4d] px-8 w-max uppercase font-semibold tracking-[0.12em] pnpm text-white">

            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />

            <span className="relative z-10 text-[8px] md:text-xs lg:text-[8px] font-black transition-colors duration-500 group-hover:text-black">
              EXPLORE OUR BRANDS
            </span>

            <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
              ↗
            </span>

          </Link>
        </div>

      </div>
    </section>
  );
}