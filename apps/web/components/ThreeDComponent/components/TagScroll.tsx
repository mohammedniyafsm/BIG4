import React from 'react';

const tags = [
  "AI Educator", "400K+ Students", "UI/UX Designer", "Web Developer", 
  "Prompt Engineer", "n8n Automation", "Course Creator", "Workshop Speaker at NIT",
  "21+ Platforms", "190+ Countries"
];

const TagRow = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => {
  return (
    <div className="flex overflow-hidden group whitespace-nowrap">
      <div className={`flex w-max space-x-4 px-2 ${reverse ? 'animate-marquee-right' : 'animate-marquee-left'}`}>
        {[...items, ...items].map((tag, i) => (
          <div 
            key={i}
            className="flex items-center justify-center px-6 py-2 rounded-full border border-white/20 text-white font-medium bg-black/20"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TagScroll() {
  return (
    <section className="bg-[#111111] py-12 md:py-20 overflow-hidden space-y-6">
      <TagRow items={tags} />
      <TagRow items={tags.slice().reverse()} reverse />
    </section>
  );
}
