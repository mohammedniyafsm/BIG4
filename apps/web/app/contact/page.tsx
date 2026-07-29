import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visit Our Showroom in Sullia | Big4 Tiles & Sanitary",
  description:
    "Contact Big4 Tiles & Sanitary in Jattipalla, Sullia (Opp. KSRTC Bus Stand). Call +91 93539 20365 or visit our showroom for expert tile & sanitary consultation in Dakshina Kannada.",
  alternates: {
    canonical: `${siteConfig.website}/contact`,
  },
  openGraph: {
    title: "Visit Our Showroom in Sullia | Big4 Tiles & Sanitary",
    description:
      "Contact Big4 Tiles & Sanitary in Jattipalla, Sullia (Opp. KSRTC Bus Stand). Call +91 93539 20365 or visit our showroom for expert tile & sanitary consultation in Dakshina Kannada.",
    url: `${siteConfig.website}/contact`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}