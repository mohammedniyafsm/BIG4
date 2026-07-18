"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
type GalleryItem = {
    src: string;
    desktop: {
        top: string;
        left?: string;
        right?: string;
        width: string;
    };
    mobile: {
        top: string;
        left?: string;
        right?: string;
        width: string;
    };
};

export default function ScrollGallery() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const images: GalleryItem[] = useMemo(
        () => [
            {
                src: "/animation-2/677276fd561b48d392692e32_h-g-image-1-min.png",
                desktop: {
                    top: "6%",
                    left: "23%",
                    width: "32vw",
                },
                mobile: {
                    top: "10%",
                    left: "16%",
                    width: "38%",
                },
            },

            {
                src: "/animation-2/677276fd561b48d392692e34_h-g-image-2-min.png",
                desktop: {
                    top: "26%",
                    right: "12%",
                    width: "27vw",
                },
                mobile: {
                    top: "27%",
                    right: "8%",
                    width: "31%",
                },
            },

            {
                src: "/animation-2/677276fd561b48d392692e35_h-g-image-3-min.png",
                desktop: {
                    top: "39%",
                    left: "6%",
                    width: "48vw",
                },
                mobile: {
                    top: "45%",
                    left: "7%",
                    width: "46%",
                },
            },

            {
                src: "/animation-2/677276fd561b48d392692e33_h-g-image-4-min.png",
                desktop: {
                    top: "54%",
                    right: "6%",
                    width: "34vw",
                },
                mobile: {
                    top: "58%",
                    right: "6%",
                    width: "32%",
                },
            },

            {
                src: "/animation-2/677276fd561b48d392692e31_h-g-image-5-min.png",
                desktop: {
                    top: "76%",
                    left: "31%",
                    width: "24vw",
                },
                mobile: {
                    top: "75%",
                    left: "22%",
                    width: "28%",
                },
            },
        ],
        []
    );

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".gallery-item");

            const directions = [
                { rotationX: 8, rotationY: -8 },  // top left
                { rotationX: 8, rotationY: 8 },   // top right
                { rotationX: -8, rotationY: 8 },  // bottom right
                { rotationX: -8, rotationY: -8 }, // bottom left
            ];

            items.forEach((item, i) => {
                const img = item.querySelector(".gallery-image");

                if (!img) return;

                const dir = directions[i % directions.length];

                gsap.set(item, {
                    perspective: 1200,
                });

                // First entrance animation (plays once)
                gsap.fromTo(
                    img,
                    {
                        scale: 0.9,
                        rotationX: dir.rotationX,
                        rotationY: dir.rotationY,
                        z: -200,
                        opacity: 0,
                        transformOrigin: "center center",
                    },
                    {
                        scale: 1,
                        rotationX: 0,
                        rotationY: 0,
                        z: 0,
                        opacity: 1,
                        duration: 1.5,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            once: true,
                        },
                    }
                );

                // Continuous depth feeling while scrolling
                gsap.to(img, {
                    scale: 1.06,
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            });
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-black overflow-hidden"
        >
            {/* Desktop */}

            <div className="relative hidden lg:block h-[220vh]">
                {images.map((item, index) => (
                    <div
                        key={index}
                        className="gallery-item absolute overflow-hidden"
                        style={{
                            top: item.desktop.top,
                            left: item.desktop.left,
                            right: item.desktop.right,
                            width: item.desktop.width,
                        }}
                    >
                        <div className="gallery-inner overflow-hidden">
                            <Image
                                src={item.src}
                                alt=""
                                width={1800}
                                height={1300}
                                priority={index === 0}
                                className="
gallery-image
w-full
h-auto
object-cover
will-change-transform
transition-transform
duration-700
"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile */}

            <div className="relative lg:hidden h-[70vh]">
                {images.map((item, index) => (
                    <div
                        key={index}
                        className="
gallery-item
absolute
overflow-hidden
rounded-none
"
                        style={{
                            top: item.mobile.top,
                            left: item.mobile.left,
                            right: item.mobile.right,
                            width: item.mobile.width,
                        }}
                    >
                        <div className="gallery-inner">
                            <Image
                                src={item.src}
                                alt=""
                                width={1200}
                                height={900}
                                priority={index === 0}
                                className="gallery-image h-auto w-full object-cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}