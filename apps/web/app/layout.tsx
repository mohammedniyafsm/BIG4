import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/config/site";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.website),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.website,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/schema/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Big4 Tiles & Sanitary Showroom Sullia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/images/schema/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeImageUrl = `${siteConfig.website.replace(/\/$/, "")}/images/schema/schema-store.jpg`;

  return (
    <html lang="en" className={cn(inter.variable, "dark")}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["HomeGoodsStore", "Store"],
              "name": "Big4 Tiles & Sanitary",
              "image": storeImageUrl,
              "@id": siteConfig.website,
              "url": siteConfig.website,
              "telephone": "+91 93539 20365",
              "priceRange": "$$",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 12.5574228,
                "longitude": 75.3932359
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "H95V+467 Sarah Commercial Complex, Mangalore - Mysore Hwy, opp. KSRTC Bus Stand, Jattipalla",
                "addressLocality": "Sullia",
                "addressRegion": "Karnataka",
                "postalCode": "574239",
                "addressCountry": "IN"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  "opens": "10:00",
                  "closes": "19:00"
                }
              ]
            })
          }}
        />
        {children}
        <GoogleAnalytics gaId="G-WLEQPP4JVR" />
      </body>
    </html>
  );
}

