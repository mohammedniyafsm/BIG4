'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

function AnimatedCounter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [inView, motionValue, to]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
}

export default function AboutMeSplit() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[40%_60%] gap-16 md:gap-24 items-center">
        
        {/* Left: Stats */}
        <div className="grid grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col space-y-2">
            <h3 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              <AnimatedCounter from={0} to={400} />K+
            </h3>
            <p className="text-gray-400 font-medium">Students Worldwide</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              <AnimatedCounter from={0} to={21} />+
            </h3>
            <p className="text-gray-400 font-medium">Platforms</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              <AnimatedCounter from={0} to={190} />+
            </h3>
            <p className="text-gray-400 font-medium">Countries</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              <AnimatedCounter from={0} to={6} />+
            </h3>
            <p className="text-gray-400 font-medium">Years Teaching</p>
          </div>
        </div>

        {/* Right: Story */}
        <div className="space-y-6">
          <h2 
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            From Curious Kid to 400K+ Students
          </h2>
          <div className="space-y-4 text-gray-300 md:text-lg leading-relaxed">
            <p>
              My journey began as a curious kid fascinated by technology, and today I have the privilege of teaching over 400,000 students worldwide. I believe that tech, AI, and design should be accessible to everyone, and I have dedicated myself to breaking down complex subjects into simple, actionable lessons.
            </p>
            <p>
              I build modern digital experiences and educate thousands across 21+ platforms, helping aspiring developers and designers build real-world skills. Through my courses, workshops, and speaking engagements, my goal is to empower others to harness the latest AI tools and web technologies to do more.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
