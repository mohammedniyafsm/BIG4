import React from 'react';

const services = [
  {
    title: "Course Education",
    desc: "400K+ students. 21+ platforms. Learn at your pace."
  },
  {
    title: "Web Development",
    desc: "Fast, modern websites. HTML/CSS/JS. Deployed on Vercel."
  },
  {
    title: "AI Automation",
    desc: "Chatbots, n8n workflows, smart agents. 24/7 automation."
  },
  {
    title: "Brand Building",
    desc: "LinkedIn strategy, Instagram growth, Substack newsletters."
  },
  {
    title: "Video Production",
    desc: "Scripting, editing, course videos, social media reels."
  },
  {
    title: "UI/UX Design",
    desc: "Figma wireframes to pixel-perfect prototypes."
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center"
          style={{ letterSpacing: '-0.03em' }}
        >
          What I Do
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5 flex flex-col justify-center space-y-4"
            >
              <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
