"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import FullscreenMenu from "./FullscreenMenu";

type NavbarProps = {
  menuOpen?: boolean;
  setMenuOpen?: (value: boolean) => void;
  theme?: 'light' | 'dark';
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export default function Navbar({
  menuOpen,
  setMenuOpen,
  theme = 'dark',
  bgColor = 'bg-transparent',
  textColor,
  className = '',
}: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isControlled = menuOpen !== undefined && setMenuOpen !== undefined;
  const activeSetMenuOpen = isControlled ? setMenuOpen! : setInternalMenuOpen;

  // Determine effective text color and light/dark visual style
  const computedTextColor = textColor || (theme === 'light' ? 'text-black' : 'text-white');
  const isLightStyle = theme === 'light' || textColor === 'text-black' || textColor?.includes('black');

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 1.2, // match loader
      });

      // Navbar fades in
      tl.from(navRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // Logo
      tl.from(
        ".nav-logo",
        {
          y: 100,
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "expo.out",
        },
        "-=0.2"
      );

      // Navigation Links
      tl.from(
        ".nav-link",
        {
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.5,
          ease: "power4.out",
        },
        "-=0.65"
      );

      // Right Menu Icon
      tl.from(
        ".nav-menu",
        {
          x: 60,
          opacity: 0,
          scale: 0.8,
          duration: 0.9,
          ease: "back.out(1.8)",
        },
        "-=0.7"
      );

      // Mobile Button
      tl.from(
        ".mobile-btn",
        {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "<"
      );

      // Mobile Burger
      tl.from(
        ".mobile-menu",
        {
          x: 30,
          opacity: 0,
          scale: 0.8,
          duration: 0.7,
          ease: "back.out(1.8)",
        },
        "-=0.5"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Hide navbar on scroll down, reveal it on scroll up
  useEffect(() => {
    if (!navRef.current) return;

    lastScrollY.current = window.scrollY;
    let ticking = false;

    const updateNav = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 15) {
        if (isHidden.current) {
          isHidden.current = false;
          gsap.to(navRef.current, {
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        lastScrollY.current = currentScrollY;
        ticking = false;
        return;
      }

      if (Math.abs(delta) < 2) {
        ticking = false;
        return;
      }

      if (delta > 0 && !isHidden.current) {
        // scrolling down -> hide instantly
        isHidden.current = true;
        gsap.to(navRef.current, {
          y: "-100%",
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (delta < 0 && isHidden.current) {
        // scrolling up -> reveal instantly
        isHidden.current = false;
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${bgColor} ${computedTextColor} ${className}`}
    >
      <div className="mx-auto flex h-16 sm:h-20 lg:h-24 items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Logo */}
        <Link href="/" className="nav-logo hidden lg:flex items-center">
          <Image
            src={isLightStyle ? "/images/branding/logo2.png" : "/images/branding/logo1.png"}
            alt="Logo"
            width={200}
            height={43}
            className="hidden lg:flex h-7 sm:h-8 lg:h-9 xl:h-10 w-auto object-contain cursor-pointer"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="flex items-center gap-8 xl:gap-8">
            <div className="nav-link">
              <NavLink title="Home" href="/" />
            </div>

            <div className="nav-link">
              <NavLink title="About" href="/about" />
            </div>

            <div className="nav-link">
              <NavLink title="Products" href="/products" />
            </div>

            <div className="nav-link">
              <NavLink title="Contact" href="/contact" />
            </div>

            <div className="nav-link">
              <Link
                href="/brands"
                className={`inline-flex items-center justify-center cursor-pointer border px-4 py-2 sm:px-5 sm:py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ease-in-out ${
                  isLightStyle 
                    ? 'border-black bg-black text-white hover:bg-white hover:text-black hover:border-black' 
                    : 'border-white bg-white text-black hover:bg-black hover:text-white hover:border-white'
                }`}
              >
                Brands
              </Link>
            </div>
          </div>

          <div className="ml-14 flex items-center">
            <Image
              src="/images/icons/burger-icon.svg"
              alt="Menu"
              width={42}
              height={42}
              className={`nav-menu h-8 w-8 sm:h-10 sm:w-10 cursor-pointer ${isLightStyle ? 'invert' : ''}`}
              onClick={() => activeSetMenuOpen(true)}
            />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex w-full justify-between items-center gap-3 sm:gap-5 lg:hidden">
          <div className="flex items-center">
            <Link href="/" className="nav-logo flex items-center">
              <Image
                src={isLightStyle ? "/images/branding/logo2.png" : "/images/branding/logo1.png"}
                alt="Logo"
                width={200}
                height={43}
                className="h-7 sm:h-8 lg:h-9 xl:h-10 w-auto object-contain cursor-pointer"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="mobile-btn">
              <Link
                href="/brands"
                className={`inline-flex items-center justify-center cursor-pointer border px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ease-in-out ${
                  isLightStyle 
                    ? 'border-black bg-black text-white hover:bg-white hover:text-black hover:border-black' 
                    : 'border-white bg-white text-black hover:bg-black hover:text-white hover:border-white'
                }`}
              >
                Brands
              </Link>
            </div>

            <Image
              src="/images/icons/burger-icon.svg"
              alt="Menu"
              width={40}
              height={40}
              className={`mobile-menu h-8 w-8 sm:h-10 sm:w-10 cursor-pointer ${isLightStyle ? 'invert' : ''}`}
              onClick={() => activeSetMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {!isControlled && (
        <FullscreenMenu menuOpen={internalMenuOpen} setMenuOpen={setInternalMenuOpen} />
      )}
    </header>
  );
}