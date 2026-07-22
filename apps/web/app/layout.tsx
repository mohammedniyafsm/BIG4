import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.website,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "dark")}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": siteConfig.legalName,
              "image": "", 
              "@id": siteConfig.website,
              "url": siteConfig.website,
              "telephone": siteConfig.contact.phone,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": `${siteConfig.address.building}, ${siteConfig.address.landmark}, ${siteConfig.address.area}`,
                "addressLocality": siteConfig.address.city,
                "addressRegion": siteConfig.address.state,
                "postalCode": siteConfig.address.postalCode,
                "addressCountry": "IN"
              },
              "openingHoursSpecification": siteConfig.businessHours.map((bh) => ({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": bh.days.includes("-") ? bh.days.split(" - ").map(d => d.trim()) : bh.days,
                "opens": bh.hours.includes("Closed") ? "00:00" : "10:00",
                "closes": bh.hours.includes("Closed") ? "00:00" : "19:00"
              }))
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
