'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';

export default function ScrollyCanvas({ heroRef }: { heroRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    // Check if mobile on mount
    const isMobile = window.innerWidth < 768;
    const frameCount = 151; // Both sequence and sequence2 have 151 frames
    const folder = isMobile ? 'images/sequence2' : 'images/sequence';

    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameStr = i.toString().padStart(3, '0');
      img.src = `/${folder}/frame_${frameStr}_delay-0.066s.webp`;
      img.onload = () => {
        loaded++;
        setLoadingProgress(Math.floor((loaded / frameCount) * 100));
        if (loaded === frameCount) {
          setImages(loadedImages);
        }
      };
      loadedImages[i] = img;
    }
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (images.length > 0) {
      const img = images[index];
      if (!img) return;

      const width = canvas.width;
      const height = canvas.height;

      const hRatio = width / img.width;
      const vRatio = height / img.height;

      // Use Math.max to make it cover the entire screen (no black bars)
      const ratio = Math.max(hRatio, vRatio);

      const centerShift_x = (width - img.width * ratio) / 2;
      const centerShift_y = (height - img.height * ratio) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);

      // Erase watermark in bottom-right corner with smooth dark radial gradient
      const patchW = Math.max(260, width * 0.16);
      const patchH = Math.max(160, height * 0.16);
      const grad = ctx.createRadialGradient(
        width, height, 0,
        width, height, Math.max(patchW, patchH)
      );
      grad.addColorStop(0, "rgba(0, 0, 0, 1)");
      grad.addColorStop(0.65, "rgba(0, 0, 0, 0.95)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(width - patchW, height - patchH, patchW, patchH);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0) return;
    const maxIndex = images.length - 1;
    const index = Math.round(latest * maxIndex);
    renderFrame(index);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      if (images.length > 0) {
        const maxIndex = images.length - 1;
        renderFrame(Math.round(scrollYProgress.get() * maxIndex));
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {loadingProgress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <span className="text-white text-2xl font-bold tracking-widest">LOADING {loadingProgress}%</span>
        </div>
      )}

      {/* Mobile Sleek Floating Glass Bar */}
      <div className="sm:hidden absolute bottom-5 left-4 right-4 z-50 flex items-center justify-between bg-black/85 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl shadow-2xl">
        <div className="flex flex-col pl-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#d4af37]">
              Authorized Partner
            </span>
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-tight">
            SIMPOLO
          </h3>
        </div>

        <Link
          href="/brands"
          className="flex items-center gap-1.5 bg-white text-black px-4 py-2.5 rounded-xl uppercase text-[10px] font-black tracking-widest shadow-md active:scale-95 transition-transform"
        >
          <span>Explore</span>
          <span className="text-xs">↗</span>
        </Link>
      </div>

      {/* Desktop Brand Showcase Card */}
      <div className="hidden sm:block absolute sm:bottom-12 sm:right-8 md:bottom-16 md:right-10 z-50 sm:w-[350px] md:w-[380px] bg-black/90 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30 whitespace-nowrap">
            Authorized Partner
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest whitespace-nowrap">
            Featured
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
          SIMPOLO
        </h3>

        <p className="font-inter text-xs text-zinc-300 font-normal leading-relaxed mb-5">
          Luxury Vitrified Tiles &amp; Architectural Surfaces
        </p>

        <Link
          href="/brands"
          className="group flex items-center justify-between h-11 w-full bg-white text-black px-5 rounded-xl uppercase font-bold text-xs tracking-[0.12em] transition-colors hover:bg-zinc-200"
        >
          <span>Explore Brands</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
        </Link>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
