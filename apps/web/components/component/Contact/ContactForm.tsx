"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function ContactForm() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".contact-animate");

            gsap.set(items, {
                opacity: 0,
                y: 36,
                scale: 0.98,
            });

            gsap.to(items, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.3,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="pt-32 pb-20 bg-black text-white flex justify-center">
            <div className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl px-4 md:px-0">
                {/* Heading */}
                <h1 className="contact-animate text-4xl lg:text-4xl font-bold text-center tracking-wider">
                    CONTACT
                </h1>

                <div className="md:flex md:py-8 md:gap-10 lg:gap-16 lg:justify-center md:items-start">

                    {/* Image */}
                    <div className="contact-animate mt-8 md:mt-10 md:w-1/2">
                        <Image
                            src="/contact.webp"
                            alt="Contact"
                            width={1000}
                            height={350}
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </div>

                    {/* Form */}
                    <form className="contact-animate mt-10 md:mt-10 md:w-1/2 flex flex-col gap-8">
                        {/* Full Name */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Full Name:
                            </label>
                            <input
                                type="text"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Phone Number:
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Select */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-4">
                                I'm Interested In
                            </label>

                            <select className="w-full bg-transparent border-b border-gray-600 pb-3 outline-none text-gray-300">
                                <option className="bg-black">Buying Products</option>
                                <option className="bg-black">Business collaboration</option>
                            </select>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-white text-black py-4 uppercase tracking-[0.3em] font-semibold hover:bg-gray-200 transition"
                        >
                            Send
                        </button>
                    </form>

                </div>
            </div>
        </section>
    );
}