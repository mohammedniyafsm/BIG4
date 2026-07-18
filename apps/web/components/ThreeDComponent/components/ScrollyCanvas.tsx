'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

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
    const folder = isMobile ? 'sequence2' : 'sequence';

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

      {/* Brand Button */}
      <button className="absolute bottom-11 right-8 md:bottom-13 md:right-12 z-50 bg-white text-black px-6 py-3 md:px-10 md:py-4 rounded-full uppercase text-xs md:text-base font-bold tracking-widest shadow-lg hover:scale-105 transition-transform duration-300">
        Italus
      </button>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
