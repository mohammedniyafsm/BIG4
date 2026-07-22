"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/config/site";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: string;
};

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  icon,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
        {label}
      </label>
      <div
        className={`relative flex items-center bg-[#0d0d0d] border rounded-sm transition-all duration-300 ${
          focused ? "border-white" : "border-[#1e1e1e]"
        }`}
      >
        {icon && (
          <span className="pl-3 text-[#333]">{icon}</span>
        )}
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent py-2.5 px-3 text-xs text-white placeholder:text-[#2a2a2a] outline-none font-inter"
        />
      </div>
    </div>
  );
}

function ContactInfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  href?: string;
}) {
  const lines = Array.isArray(value) ? value : [value];
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-0.5 w-9 h-9 rounded-full border border-[#2a2a2a] bg-transparent flex items-center justify-center text-[#555] group-hover:border-white group-hover:text-white transition-all duration-300 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="uppercase tracking-[0.2em] text-[9px] text-[#444] font-semibold">
          {label}
        </span>
        {lines.map((l, i) =>
          href ? (
            <a
              key={i}
              href={href}
              className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200 leading-relaxed font-medium"
            >
              {l}
            </a>
          ) : (
            <span key={i} className="text-[13px] text-[#aaa] leading-relaxed font-medium">
              {l}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */

export default function ContactForm() {
  const heroRef        = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const whyRef         = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    interest: "Buying Products",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* ── Hero: entrance + scroll parallax ── */
  useEffect(() => {
    if (!heroRef.current || !heroContentRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-eyebrow",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4 }
      )
        .fromTo(
          ".title-line",
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.0, stagger: 0.15 },
          "-=0.5"
        )
        .fromTo(
          ".copy-word",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.015, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta-btn",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.55"
        )
        .fromTo(
          ".h-scroll",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.55"
        );

      /* — scroll-driven parallax: content drifts up & fades — */
      gsap.to(heroContentRef.current, {
        yPercent: -28,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      /* — scroll hint fades faster — */
      gsap.to(".h-scroll", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "25% top",
          scrub: true,
        },
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Card section animation ── */
  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".card-left", {
        x: -60, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 75%", once: true },
      });
      gsap.from(".card-right", {
        x: 60, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 75%", once: true },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  /* ── Why section animation ── */
  useEffect(() => {
    if (!whyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".why-item", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: whyRef.current, start: "top 80%", once: true },
      });
    }, whyRef);
    return () => ctx.revert();
  }, []);

  /* ── Map animation ── */
  useEffect(() => {
    if (!mapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".map-el", {
        y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: mapRef.current, start: "top 80%", once: true },
      });
    }, mapRef);
    return () => ctx.revert();
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setSending(false);

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || "Failed to send message");
      }
    } catch {
      setSending(false);
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <main className="bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative px-6 pb-12 pt-40 md:pt-28 lg:pt-40 sm:px-8 max-w-3xl mx-auto text-center flex flex-col items-center justify-center min-h-[90vh] lg:min-h-screen border-b border-[#141414]"
      >
        {/* ── parallax content wrapper ── */}
        <div
          ref={heroContentRef}
          className="relative z-10 flex flex-col items-center text-center select-none will-change-transform w-full"
        >
          <p className="hero-eyebrow mb-4 text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.3em] text-[#555] whitespace-nowrap">
            Response Within 24 Hours
          </p>
          
          <h1
            className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="block overflow-hidden">
              <span className="inline-block title-line">GET IN TOUCH,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block title-line">WITH US.</span>
            </span>
          </h1>

          <p
            className="font-inter mt-4 w-full max-w-xl text-xs leading-5 text-[#aaa] sm:text-xs font-light flex flex-wrap justify-center gap-x-[0.28em] gap-y-0 mx-auto"
          >
            {"Whether you have a question about our collections, need design advice, or want to partner with us, our team is ready to help."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="inline-block overflow-hidden py-0.5">
                  <span className="inline-block copy-word">{word}</span>
                </span>
              ))}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row w-full max-w-[280px] sm:max-w-none mx-auto items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById("contact-form-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hero-cta-btn flex w-full sm:w-auto items-center justify-center rounded-full bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-200"
            >
              Send A Message
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div className="h-scroll absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="font-inter uppercase tracking-[0.3em] text-[7px] sm:text-[8px] text-[#555] font-semibold">Scroll</span>
          <div className="w-px h-8 sm:h-10 overflow-hidden">
            <div
              className="w-px h-full bg-gradient-to-b from-transparent via-[#888] to-transparent"
              style={{ animation: "scrollLine 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>

        <style>{`
          @keyframes scrollLine {
            0%   { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTACT CARD
      ══════════════════════════════════════════ */}
      <section id="contact-form-section" ref={cardRef} className="px-4 sm:px-8 lg:px-16 xl:px-24 py-10 lg:py-14 bg-black">
        <div className="mx-auto max-w-6xl">

          {/* outer card */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr] rounded-md overflow-hidden border border-[#1a1a1a]">

            {/* ── LEFT PANEL ── */}
            <div className="card-left relative bg-[#080808] p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-10 border-b border-[#1a1a1a] lg:border-b-0 lg:border-r lg:border-[#1a1a1a]">

              {/* decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#222] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#1a1a1a] pointer-events-none" />

              <div>
                <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.95] text-3xl sm:text-4xl lg:text-[2.2rem] text-white">
                  Get in <br />touch
                </h2>
                <p className="font-inter mt-4 text-[12px] leading-[1.8] text-[#555] max-w-sm">
                  Whether you have a question about our collections, need design advice, or want to partner with us, our team is ready to help.
                </p>
              </div>

              {/* contact rows */}
              <div className="flex flex-col gap-5">
                <ContactInfoRow
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                  label="Email Us"
                  value={[siteConfig.contact.email]}
                  href={`mailto:${siteConfig.contact.email}`}
                />
                <ContactInfoRow
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  }
                  label="Visit Showroom"
                  value={[`${siteConfig.address.building}, ${siteConfig.address.landmark},`, `${siteConfig.address.city} — ${siteConfig.address.postalCode}`]}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#181818]">
                <p className="font-inter uppercase tracking-[0.2em] text-[8px] text-[#555] mb-1 font-semibold">
                  Quick Connect
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={siteConfig.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-sm transition-colors duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="font-bold text-[10px] uppercase tracking-wider">WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="group flex items-center justify-center gap-2 py-3 px-4 bg-[#1a1a1a] border border-[#333] hover:bg-[#2a2a2a] text-white rounded-sm transition-colors duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.17a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    <span className="font-bold text-[10px] uppercase tracking-wider">Call Us</span>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              {(siteConfig.social.instagram || siteConfig.social.facebook || siteConfig.social.youtube || siteConfig.social.linkedin) && (
                <div className="flex flex-col gap-3 pt-4 border-t border-[#181818]">
                  <p className="font-inter uppercase tracking-[0.2em] text-[8px] text-[#555] mb-1 font-semibold">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-4">
                    {siteConfig.social.facebook && (
                      <a href={siteConfig.social.facebook} className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] hover:text-white hover:border-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                      </a>
                    )}
                    {siteConfig.social.instagram && (
                      <a href={siteConfig.social.instagram} className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] hover:text-white hover:border-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </a>
                    )}
                    {siteConfig.social.youtube && (
                      <a href={siteConfig.social.youtube} className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] hover:text-white hover:border-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/></svg>
                      </a>
                    )}
                    {siteConfig.social.linkedin && (
                      <a href={siteConfig.social.linkedin} className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] hover:text-white hover:border-white transition-colors duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL — FORM ── */}
            <div className="card-right bg-[#050505] p-8 sm:p-10 lg:p-12 relative overflow-hidden">
              {submitted ? (
                /* ── success state ── */
                <div className="h-full min-h-[420px] flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-white">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="uppercase font-black tracking-[0.1em] text-2xl text-white">Message Sent</h3>
                    <p className="mt-3 text-[12px] text-[#555] leading-relaxed max-w-xs mx-auto">
                      Thank you for reaching out. Our team will contact you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:"", email:"", phone:"", subject:"", message:"", interest:"Buying Products" }); }}
                    className="mt-4 uppercase text-[9px] tracking-[0.3em] text-[#555] border-b border-[#333] pb-1 hover:text-white hover:border-white transition-all duration-300 font-semibold"
                  >
                    Send Another →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                  <div className="mb-2">
                    <h3 className="font-black uppercase tracking-[-0.02em] text-xl text-white">Send a Message</h3>
                    <p className="text-[11px] text-[#555] mt-1">Fill out the form below and we will get back to you shortly.</p>
                    {errorMessage && (
                      <p className="mt-2 text-xs text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">{errorMessage}</p>
                    )}
                  </div>

                  {/* row 1: name + email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Full Name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>

                  {/* row 2: phone + interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Phone / WhatsApp"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
                        I&apos;m Interested In
                      </label>
                      <select
                        value={form.interest}
                        onChange={(e) => set("interest")(e.target.value)}
                        className="font-inter w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-white rounded-sm py-2.5 px-3 text-xs text-white outline-none transition-colors duration-300 cursor-pointer"
                      >
                        <option value="Buying Products">Buying Products</option>
                        <option value="Business Collaboration">Business Collaboration</option>
                        <option value="Interior Design Consultation">Interior Design Consultation</option>
                        <option value="Wholesale / Trade Enquiry">Wholesale / Trade Enquiry</option>
                        <option value="Project Sourcing">Project Sourcing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* message */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
                      Project Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Briefly describe your vision, space requirements, and timeline…"
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      className="font-inter w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-white rounded-sm py-3 px-4 text-xs text-white placeholder:text-[#2a2a2a] outline-none resize-none transition-colors duration-300"
                    />
                  </div>

                  {/* submit */}
                  <div className="flex flex-col gap-3 pt-2 mt-auto">
                    <button
                      type="submit"
                      disabled={sending}
                      className="group w-full py-3.5 overflow-hidden bg-white text-black uppercase tracking-[0.25em] text-[10px] font-bold flex items-center justify-center gap-2.5 hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                            <path d="M12 2a10 10 0 0110 10" strokeOpacity="0.9"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <>
                          Send Message
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="font-inter text-center text-[9px] text-[#2e2e2e]">
                      By submitting you agree to our{" "}
                      <a href="#" className="text-[#444] hover:text-white underline underline-offset-2 transition-colors duration-200">privacy policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY VISIT US — numbered grid
      ══════════════════════════════════════════ */}
      <section ref={whyRef} className="border-t border-[#141414] px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28 bg-black">
        <div className="mx-auto max-w-7xl">

          {/* section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <p className="why-item uppercase tracking-[0.3em] text-[9px] text-[#444] mb-4 font-semibold">Why Choose BIG4</p>
              <h2 className="why-item uppercase font-black tracking-[-0.04em] leading-none text-[8vw] sm:text-5xl lg:text-6xl text-white">
                VISIT OUR<br />SHOWROOM
              </h2>
            </div>
            <p className="why-item text-[12px] text-[#444] max-w-xs leading-relaxed font-medium">
              Step inside and discover why thousands of homeowners and designers trust BIG4 for their premium spaces.
            </p>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111] border-none">
            {[
              { num: "01", title: "10,000+ Products", desc: "One of the largest curated collections of premium tiles, sanitaryware, and surface solutions under one roof." },
              { num: "02", title: "Expert Consultants", desc: "Trained design specialists help you find the perfect combination for your style, space, and budget." },
              { num: "03", title: `Trusted Since ${siteConfig.founded}`, desc: "A legacy of quality, reliability, and strong partnerships with world-class global brands." },
              { num: "04", title: "Exclusive Showroom Deals", desc: "Access showroom-only pricing, bundle offers, and limited collections not available anywhere online." },
              { num: "05", title: "After-Sales Support", desc: "Dedicated after-sales assistance, warranty coordination, and replacement service for every product." },
              { num: "06", title: "Easy Access & Parking", desc: "Centrally located with ample parking. Open 6 days a week for your convenience." },
            ].map((item) => (
              <div
                key={item.num}
                className="why-item group bg-black px-8 py-12 flex flex-col gap-6 hover:bg-[#070707] transition-colors duration-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#2a2a2a] group-hover:text-[#555] transition-colors duration-300 font-bold">
                    {item.num}
                  </span>
                  <div className="w-6 h-px bg-[#1e1e1e] group-hover:w-10 group-hover:bg-white transition-all duration-500" />
                </div>
                <h3 className="uppercase font-black text-sm tracking-[0.08em] leading-tight text-white">{item.title}</h3>
                <p className="text-[12px] leading-[1.9] text-[#444] group-hover:text-[#666] transition-colors duration-300 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAP / LOCATION
      ══════════════════════════════════════════ */}
      <section ref={mapRef} className="border-t border-[#141414] px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28 bg-black">
        <div className="mx-auto max-w-7xl">

          <div className="map-el flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-6">
            <div>
              <p className="uppercase tracking-[0.3em] text-[9px] text-[#444] mb-4 font-semibold">Find Us</p>
              <h2 className="uppercase font-black tracking-[-0.04em] leading-none text-4xl lg:text-6xl text-white">
                OUR<br />SHOWROOM
              </h2>
            </div>
            <a
              href={siteConfig.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 uppercase text-[10px] tracking-[0.25em] text-[#444] hover:text-white transition-colors duration-300 font-bold"
            >
              Open in Google Maps
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300">
                <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
              </svg>
            </a>
          </div>

          {/* map embed */}
          <div className="map-el w-full h-[360px] sm:h-[420px] lg:h-[500px] bg-[#080808] border border-[#141414] overflow-hidden rounded-md shadow-sm">
            <iframe
              src={siteConfig.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg) saturate(0.3) brightness(0.85)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BIG4 Tiles & Sanitary Showroom Location"
            />
          </div>

          {/* address bar below map */}
          <div className="map-el mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#141414] bg-transparent px-6 py-5 rounded-md shadow-sm">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#555] flex-shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span className="text-[12px] text-[#666] font-medium">
                {siteConfig.address.building}, {siteConfig.address.landmark}, {siteConfig.address.area}, {siteConfig.address.city} — {siteConfig.address.postalCode}, {siteConfig.address.state}, {siteConfig.address.country}
              </span>
            </div>
            <div className="flex gap-8">
              {siteConfig.businessHours.map((bh, idx) => (
                <div key={idx} className="text-right hidden sm:block">
                  <p className="uppercase tracking-[0.2em] text-[9px] text-[#444] mb-1 font-bold">{bh.days}</p>
                  <p className="text-[12px] text-[#777] font-semibold">{bh.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}