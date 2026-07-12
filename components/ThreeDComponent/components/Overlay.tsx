'use client';

import { useScroll, useTransform, motion } from 'framer-motion';

export default function Overlay({ heroRef }: { heroRef: React.RefObject<HTMLDivElement> }) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // Phase 1: Ghost watermark
  const opacity1 = useTransform(scrollYProgress, [0, 0.10, 0.18, 0.28], [1, 1, 1, 0]);

  // Phase 2: Name intro block
  const opacity2 = useTransform(scrollYProgress, [0.28, 0.38, 0.44, 0.52], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.28, 0.52], [60, -60]);

  // Phase 3: Role statement
  const opacity3 = useTransform(scrollYProgress, [0.52, 0.62, 0.70, 0.78], [0, 1, 1, 0]);

  // Phase 4: Main headline
  const opacity4 = useTransform(scrollYProgress, [0.78, 0.88, 0.96, 1.00], [0, 1, 1, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
      
      {/* PHASE 1 */}
      <motion.div
        style={{ opacity: opacity1, willChange: 'opacity, transform' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span 
          className="text-white/10 font-black whitespace-nowrap"
          style={{ fontSize: 'clamp(5rem, 15vw, 14rem)' }}
        >
          Chetan Pujari.
        </span>
      </motion.div>

      {/* PHASE 2 */}
      <motion.div
        style={{ opacity: opacity2, y: y2, willChange: 'opacity, transform' }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-4"
      >
        <p className="text-gray-400 font-medium tracking-wide uppercase text-sm md:text-base">
          I Make Tech, AI & Design
        </p>
        <h1 
          className="text-white font-extrabold whitespace-nowrap"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.04em' }}
        >
          Chetan Pujari.
        </h1>
        <p className="text-gray-400 font-medium md:text-lg">
          400K+ Students &middot; 21+ Platforms
        </p>
      </motion.div>

      {/* PHASE 3 */}
      <motion.div
        style={{ opacity: opacity3, willChange: 'opacity, transform' }}
        className="absolute inset-0 flex items-center justify-center text-center px-4"
      >
        <h2 
          className="text-white font-bold whitespace-pre-wrap leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)', letterSpacing: '-0.03em' }}
        >
          {`AI Educator &\nCreative Developer.`}
        </h2>
      </motion.div>

      {/* PHASE 4 */}
      <motion.div
        style={{ opacity: opacity4, willChange: 'opacity, transform' }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-4"
      >
        <h2 
          className="text-white font-bold whitespace-pre-wrap leading-tight max-w-5xl"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)', letterSpacing: '-0.03em' }}
        >
          {`I Make Tech, AI & Design Simple —\nSo You Can Do More.`}
        </h2>
        <p className="text-gray-400 font-medium md:text-xl">
          400K+ Students &middot; 21+ Platforms &middot; 190+ Countries
        </p>
      </motion.div>
      
    </div>
  );
}
