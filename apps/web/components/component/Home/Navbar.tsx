"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type NavbarProps = {
  menuOpen?: boolean;
  setMenuOpen?: (value: boolean) => void;
  theme?: 'light' | 'dark';
}

export default function Navbar({
  menuOpen,
  setMenuOpen,
  theme = 'dark'
}: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 1.2, // match your loader
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

      if (currentScrollY <= 80) {
        if (isHidden.current) {
          isHidden.current = false;
          gsap.to(navRef.current, {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        lastScrollY.current = currentScrollY;
        ticking = false;
        return;
      }

      if (Math.abs(delta) < 5) {
        ticking = false;
        return;
      }

      if (delta > 0 && !isHidden.current) {
        // scrolling down -> hide
        isHidden.current = true;
        gsap.to(navRef.current, {
          y: "-100%",
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      } else if (delta < 0 && isHidden.current) {
        // scrolling up -> reveal
        isHidden.current = false;
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.8,
          ease: "power3.out",
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
    <header ref={navRef} className={`fixed top-0 left-0 z-50 w-full ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      <div className="mx-auto flex h-16 sm:h-20 lg:h-24 items-center justify-between px-6 sm:px-6 lg:px-10 xl:px-16 py-12 lg:py-20">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <Image
            src={theme === 'light' ? "/logo2.png" : "/logo1.png"}
            alt="Logo"
            width={160}
            height={50}
            className="hidden lg:flex h-12 w-auto sm:h-12 lg:h-14 xl:h-14 cursor-pointer"
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
              <NavLink title="Brands" href="/brands" />
            </div>

            <div className="nav-link">
              <NavLink title="Products" href="/products" />
            </div>

            <div className="nav-link">
              <NavLink title="Contact" href="/contact" />
            </div>

            <div className="nav-link">
              <Link
                href="/catalog"
                className={`inline-flex items-center justify-center cursor-pointer border px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] font-semibold uppercase transition-all duration-300 ease-in-out ${
                  theme === 'light' 
                    ? 'border-black bg-black text-white hover:bg-white hover:text-black hover:border-black' 
                    : 'border-white bg-white text-black hover:bg-black hover:text-white hover:border-white'
                }`}
              >
                Catalog
              </Link>
            </div>
          </div>

          <div className="ml-14 flex items-center">
            <Image
              src="/677276fd561b48d392692df4_burger-icon.svg"
              alt="Menu"
              width={42}
              height={42}
              className={`nav-menu h-10 w-10 cursor-pointer ${theme === 'light' ? 'invert' : ''}`}
               onClick={() => setMenuOpen?.(true)}
            />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex w-full justify-between items-center gap-3 sm:gap-5 lg:hidden">
          <div className="">
            <Link href="/" className="nav-logo">
              <Image
                src={theme === 'light' ? "/logo2.png" : "/logo1.png"}
                alt="Logo"
                width={160}
                height={50}
                className=" h-12 w-auto sm:h-12 lg:h-14 xl:h-14 cursor-pointer"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="mobile-btn">
              <Link
                href="/catalog"
                className={`inline-flex items-center justify-center cursor-pointer border px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] font-semibold uppercase transition-all duration-300 ease-in-out ${
                  theme === 'light' 
                    ? 'border-black bg-black text-white hover:bg-white hover:text-black hover:border-black' 
                    : 'border-white bg-white text-black hover:bg-black hover:text-white hover:border-white'
                }`}
              >
                Catalog
              </Link>
            </div>

            <Image
              src="/677276fd561b48d392692df4_burger-icon.svg"
              alt="Menu"
              width={40}
              height={40}
              className={`mobile-menu h-8 w-8 sm:h-10 sm:w-10 cursor-pointer ${theme === 'light' ? 'invert' : ''}`}
               onClick={() => setMenuOpen?.(true)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}