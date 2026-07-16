"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

type Props = {
    menuOpen: boolean;
    setMenuOpen: (v: boolean) => void;
};

export default function FullscreenMenu({
    menuOpen,
    setMenuOpen,
}: Props) {
    const menuRef = useRef<HTMLDivElement>(null);

    // helper to render per-letter spans for animated text
    const renderLetters = (text: string) => {
        return (
            <>
                <span className="sr-only">{text}</span>
                <span aria-hidden className="letters inline-flex items-center leading-none">
                    {Array.from(text).map((ch, idx) => (
                        <span key={idx} className="letter inline-block">
                            {ch === " " ? "\u00A0" : ch}
                        </span>
                    ))}
                </span>
            </>
        );
    };

    const renderDualLayerText = (text: string) => {
        return (
            <>
                <span aria-hidden className="menu-face menu-face--front">
                    {renderLetters(text)}
                </span>
                <span aria-hidden className="menu-face menu-face--back">
                    {renderLetters(text)}
                </span>
            </>
        );
    };

    useEffect(() => {
        if (!menuRef.current) return;

        if (menuOpen) {
            document.body.style.overflow = "hidden";

            gsap.set(menuRef.current, {
                display: "block",
                yPercent: -100,
            });

            gsap.set(".menu-logo", {
                opacity: 0,
                y: 25,
            });

            gsap.set(".menu-close", {
                opacity: 0,
                y: 25,
            });

            gsap.set(".menu-item", {
                opacity: 0,
                y: 80,
            });

            gsap.set(".catalog-btn", {
                opacity: 0,
                y: 25,
                scale: .95,
            });

            const tl = gsap.timeline();

            tl.to(menuRef.current, {
                yPercent: 0,
                duration: .85,
                ease: "expo.inOut",
            });

            tl.to(
                [".menu-logo", ".menu-close"],
                {
                    opacity: 1,
                    y: 0,
                    duration: .45,
                    stagger: .05,
                    ease: "power3.out",
                },
                "-=.35"
            );

            tl.to(
                ".menu-item",
                {
                    opacity: 1,
                    y: 0,
                    stagger: .08,
                    duration: .7,
                    ease: "power4.out",
                },
                "-=.15"
            );

            // animate letters individually after menu-item animation starts
            const letters = menuRef.current.querySelectorAll('.letter');
            if (letters && letters.length) {
                gsap.fromTo(
                    letters,
                    { rotationX: -80, opacity: 0, y: 16 },
                    { rotationX: 0, opacity: 1, y: 0, stagger: 0.02, duration: 0.6, ease: 'power3.out' },
                );
            }

            tl.to(
                ".catalog-btn",
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: .45,
                    ease: "back.out(1.6)",
                },
                "-=.25"
            );
        } else {
            document.body.style.overflow = "";

            const tl = gsap.timeline();

            tl.to(".catalog-btn", {
                opacity: 0,
                y: 20,
                duration: .2,
            });

            tl.to(
                ".menu-item",
                {
                    opacity: 0,
                    y: -40,
                    stagger: .04,
                    duration: .22,
                },
                "-=.1"
            );

            tl.to(
                [".menu-logo", ".menu-close"],
                {
                    opacity: 0,
                    y: -20,
                    duration: .2,
                },
                "-=.18"
            );

            tl.to(
                menuRef.current,
                {
                    yPercent: -100,
                    duration: .75,
                    ease: "expo.inOut",
                    onComplete: () => {
                        gsap.set(menuRef.current, {
                            display: "none",
                        });
                    },
                },
                "-=.08"
            );
        }
    }, [menuOpen]);

    // premium two-face cube hover effect for the active menu item only
    const handleItemEnter = (e: React.MouseEvent<HTMLElement>) => {
        const front = e.currentTarget.querySelector('.menu-face--front') as HTMLElement | null;
        const back = e.currentTarget.querySelector('.menu-face--back') as HTMLElement | null;

        if (!front || !back) return;

        gsap.killTweensOf([front, back]);

        gsap.set(front, {
            transformOrigin: '50% 50%',
            rotationX: 0,
            yPercent: 0,
            opacity: 1,
        });

        gsap.set(back, {
            transformOrigin: '50% 50%',
            rotationX: 90,
            yPercent: 100,
            opacity: 1,
        });

        const tl = gsap.timeline({ defaults: { duration: 0.55, ease: 'power4.out' } });

        tl.to(front, {
            rotationX: -90,
            yPercent: -100,
            opacity: 0,
        });

        tl.to(back, {
            rotationX: 0,
            yPercent: 0,
            opacity: 1,
        }, 0);
    };

    const handleItemLeave = (e: React.MouseEvent<HTMLElement>) => {
        const front = e.currentTarget.querySelector('.menu-face--front') as HTMLElement | null;
        const back = e.currentTarget.querySelector('.menu-face--back') as HTMLElement | null;

        if (!front || !back) return;

        gsap.killTweensOf([front, back]);

        const tl = gsap.timeline({ defaults: { duration: 0.55, ease: 'expo.out' } });

        tl.to(back, {
            rotationX: 90,
            yPercent: 100,
            opacity: 1,
        });

        tl.to(front, {
            rotationX: 0,
            yPercent: 0,
            opacity: 1,
        }, 0);
    };

    return (
        <div
            ref={menuRef}
            className="fixed inset-0 z-[15000] hidden bg-white "
        >
            <div className="flex h-screen flex-col px-6 sm:px-6 lg:px-8 xl:px-8 py-8 lg:py-10">

                {/* Header */}

                <header className="flex items-center justify-between px-6 md:px-10 xl:px-16 py-6">

                    <Link href="/" className="menu-logo">
                        <Image
                            src="/logo1.png"
                            alt="Logo"
                            width={160}
                            height={50}
                            className="h-10 w-auto sm:h-12 lg:h-14 xl:h-14 cursor-pointer"
                            priority
                        />
                    </Link>

                    <button
                        onClick={() => setMenuOpen(false)}
                        className="menu-close text-black text-3xl leading-none hover:opacity-70 transition-opacity"
                        aria-label="Close menu"
                    >
                        ×
                    </button>

                </header>

                {/* CENTER */}

                <div className="flex-1 flex flex-col items-center justify-center text-black font-black  ">

                    <div className="flex flex-col items-center ">

                        {/* HOME */}
                        <Link href="/" onClick={() => setMenuOpen(false)} className="menu-item overflow-hidden cursor-pointer" onMouseEnter={handleItemEnter} onMouseLeave={handleItemLeave}>
                            <div className="menu-cube  relative inline-flex w-fit items-center justify-center overflow-hidden leading-none whitespace-nowrap">
                                {renderDualLayerText("HOME")}
                            </div>
                        </Link>

                        {/* ABOUT */}
                        <Link href="/about" onClick={() => setMenuOpen(false)} className="menu-item overflow-hidden cursor-pointer" onMouseEnter={handleItemEnter} onMouseLeave={handleItemLeave}>
                            <div className="menu-cube relative inline-flex w-fit items-center justify-center overflow-hidden leading-none whitespace-nowrap">
                                {renderDualLayerText("ABOUT")}
                            </div>
                        </Link>

                        {/* BRANDS */}
                        <Link href="/brands" onClick={() => setMenuOpen(false)} className="menu-item overflow-hidden cursor-pointer" onMouseEnter={handleItemEnter} onMouseLeave={handleItemLeave}>
                            <div className="menu-cube relative inline-flex w-fit items-center justify-center overflow-hidden leading-none whitespace-nowrap">
                                {renderDualLayerText("BRANDS")}
                            </div>
                        </Link>

                        {/* CONTACT */}
                        <Link href="/contact" onClick={() => setMenuOpen(false)} className="menu-item overflow-hidden cursor-pointer" onMouseEnter={handleItemEnter} onMouseLeave={handleItemLeave}>
                            <div className="menu-cube relative inline-flex w-fit items-center justify-center overflow-hidden leading-none whitespace-nowrap">
                                {renderDualLayerText("CONTACT")}
                            </div>
                        </Link>

                    </div>

                    <button
                        className="
            mt-12
            px-10
            py-3
            uppercase
            tracking-[.18em]
            text-sm
            transition-all
            duration-300
            bg-black
            text-white
            hover:bg-white
            hover:text-black
            border-black
            border 
            cursor-pointer
            "
                        onClick={() => setMenuOpen(false)}
                    >
                        <span data-text="CATALOG">CATALOG</span>
                    </button>

                </div>

            </div>
        </div>
    );
}