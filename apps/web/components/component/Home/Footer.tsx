"use client";

import { useState } from "react";
import Link from "next/link";

type SiteFooterProps = {
  brandName?: string;
  year?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

function NavItem({ label }: { label: string }) {
  const getHref = (label: string) => {
    switch (label) {
      case "HOME": return "/";
      case "ABOUT": return "/about";
      case "BRANDS": return "/brands";
      case "CONTACT": return "/contact";
      case "PRODUCTS": return "/products";
      case "CATALOG": return "/products";
      default: return "/";
    }
  };

  return (
    <Link
      href={getHref(label)}
      className="group inline-block [perspective:1000px]"
    >
      <span className="relative block h-[1.25em] overflow-hidden">
        {/* Front */}
        <span
          className="
            block
            origin-bottom
            transition-all
            duration-500
            ease-[cubic-bezier(.76,0,.24,1)]
            group-hover:-translate-y-full
            group-hover:-rotate-x-90
            [transform-style:preserve-3d]
          "
        >
          {label}
        </span>

        {/* Bottom */}
        <span
          className="
            absolute
            left-0
            top-full
            block
            origin-top
            transition-all
            duration-500
            ease-[cubic-bezier(.76,0,.24,1)]
            group-hover:-translate-y-full
            group-hover:rotate-x-0
            [transform:rotateX(90deg)]
            [transform-style:preserve-3d]
          "
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

import { siteConfig } from "@/lib/config/site";

export default function SiteFooter({
  brandName = siteConfig.name,
  year = new Date().getFullYear(),
  bgColor = "bg-background",
  textColor = "text-foreground",
  className = "",
}: SiteFooterProps) {
  const [lang, setLang] = useState<"EN" | "HE">("EN");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navLinks = [
    "HOME",
    "ABOUT",
    "BRANDS",
    "CONTACT",
    "PRODUCTS",
  ];

  return (
    <footer className={`relative overflow-hidden transition-colors duration-300 ${bgColor} ${textColor} ${className}`}>
      {/* ================= MOBILE ================= */}

      <div className="flex flex-col justify-between gap-16 px-6 py-8 lg:hidden">
        <div className="flex justify-between">
          <nav className="flex flex-col items-start gap-3 text-2xl font-black">
            {navLinks.map((link) => (
              <NavItem key={link} label={link} />
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={scrollToTop}
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-current
                transition-all
                duration-300
                hover:opacity-80
                hover:rotate-90
              "
            >
              ↑
            </button>
          </div>
        </div>

        <div>
          <div className="text-[24vw] font-black leading-none">
            {brandName}
          </div>

          <span className="text-xs">
            {brandName}® {year}
          </span>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}

      <div className="hidden items-center justify-between px-12 py-12 lg:flex">
        <div>
          <div className="text-[11vw] font-black leading-none">
            {brandName}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="flex gap-24">
            <nav className="flex flex-col items-start gap-2 text-3xl font-bold">
              {navLinks.map((link) => (
                <NavItem key={link} label={link} />
              ))}
            </nav>

            <div className="flex flex-col items-center gap-28">
              <button
                onClick={scrollToTop}
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-current
                  transition-all
                  duration-300
                  hover:opacity-80
                  hover:rotate-90
                "
              >
                ↑
              </button>

              <span className="text-xs font-semibold">
                {brandName}® {year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}