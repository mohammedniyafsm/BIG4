'use client';

import { motion } from 'framer-motion';

const timelineData = [
  { year: "2020", title: "First Course on Udemy", desc: "Zero audience. Zero budget. Something clicked." },
  { year: "2021", title: "Expanded to Skillshare", desc: "Multi-platform presence begins." },
  { year: "2023", title: "TutorialsPoint & Starweaver", desc: "Reached enterprise learners." },
  { year: "2024", title: "350K+ Students & Packt Deal", desc: "Distributed to Coursera & O'Reilly." },
  { year: "2025", title: "NIT Workshops & 539K LinkedIn Impressions", desc: "Took AI education to India's top colleges." },
  { year: "2026", title: "400K+ Students. AI Agents. 21+ Platforms.", desc: "Building the future of applied AI." },
];

export default function JourneyTimeline() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 
          className="text-3xl md:text-5xl font-bold tracking-tight mb-20 text-center"
          style={{ letterSpacing: '-0.03em' }}
        >
          The Journey So Far
        </h2>
        
        <div className="relative border-l-2 border-white/10 md:border-none">
          {/* Center line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2" />

          <div className="space-y-16">
            {timelineData.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="relative flex flex-col md:flex-row items-start md:items-center w-full"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] md:left-1/2 top-1 md:top-1/2 w-[10px] h-[10px] bg-accent rounded-full md:-translate-x-1/2 md:-translate-y-1/2" />

                  {/* Desktop Layout Wrapper */}
                  <div className={`pl-8 md:pl-0 w-full flex flex-col md:flex-row ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    
                    {/* Content Block */}
                    <div className={`md:w-[45%] flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right md:order-first'} space-y-2`}>
                      <span className="text-accent font-bold text-xl">{item.year}</span>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
