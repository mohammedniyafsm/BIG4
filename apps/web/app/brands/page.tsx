import type { Metadata } from "next";
import BrandsClient from "./BrandsClient";
import { siteConfig } from "@/lib/config/site";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Authorized Brands | Kajaria, Simpolo & Grohe Dealer in Sullia",
  description:
    "Browse top tile & sanitaryware brands available at Big4 Tiles & Sanitary in Sullia. Authorized collection of Kajaria, Simpolo, Hindware, Grohe, Jaquar & Somany.",
  alternates: {
    canonical: `${siteConfig.website}/brands`,
  },
  openGraph: {
    title: "Authorized Brands | Kajaria, Simpolo & Grohe Dealer in Sullia",
    description:
      "Browse top tile & sanitaryware brands available at Big4 Tiles & Sanitary in Sullia. Authorized collection of Kajaria, Simpolo, Hindware, Grohe, Jaquar & Somany.",
    url: `${siteConfig.website}/brands`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default async function BrandsPage() {
  let brands: any[] = [];
  try {
    brands = await prisma.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch brands during static build/render:", error);
  }

  return <BrandsClient brands={brands} />;
}