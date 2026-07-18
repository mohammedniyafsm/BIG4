'use client';

import { useRef } from 'react';
import ScrollyCanvas from './components/ScrollyCanvas';

export default function ThreeDComponent() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-black w-full relative z-10">
      
      {/* Spacer and Arrow */}
      <div className="w-full flex flex-col items-center justify-center pt-12 pb-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/50 animate-bounce mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>

        <h2 className="text-center uppercase font-black leading-[1.0] tracking-[-0.04em] mix-blend-difference text-white select-none text-[9vw] sm:text-[10vw] md:text-[10vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[7vw]">
          Experience The <br/> Elegant Designs
        </h2>
      </div>

      {/* 400vh container for faster scroll progress (fixes timing) */}
      <div ref={heroRef} style={{ position: 'relative', height: '400vh' }}>
        <ScrollyCanvas heroRef={heroRef} />
      </div>
    </section>
  );
}
