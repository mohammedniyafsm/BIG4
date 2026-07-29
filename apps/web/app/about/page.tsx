import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Big4 Tiles & Sanitary Showroom in Sullia",
  description:
    "Learn about Big4 Tiles & Sanitary in Sullia. Delivering top-tier tiles, sanitaryware, and interior fitting solutions across Dakshina Kannada since 2017.",
  alternates: {
    canonical: `${siteConfig.website}/about`,
  },
  openGraph: {
    title: "About Us | Big4 Tiles & Sanitary Showroom in Sullia",
    description:
      "Learn about Big4 Tiles & Sanitary in Sullia. Delivering top-tier tiles, sanitaryware, and interior fitting solutions across Dakshina Kannada since 2017.",
    url: `${siteConfig.website}/about`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}