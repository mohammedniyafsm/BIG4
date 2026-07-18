import React from 'react';

const courses = [
  {
    title: "Google Veo 3.1 Complete Mastery",
    badge: "Bestseller",
    platform: "Udemy",
    gradient: "from-blue-900/50 to-purple-900/50"
  },
  {
    title: "HeyGen + ElevenLabs: Viral AI Videos",
    badge: "Most Popular",
    platform: "Skillshare",
    gradient: "from-pink-900/50 to-orange-900/50"
  },
  {
    title: "UI/UX Design With Figma: 5+ Projects",
    badge: "Bestseller + Highest Rated",
    platform: "Udemy",
    gradient: "from-green-900/50 to-emerald-900/50"
  },
  {
    title: "Mastering ChatGPT Prompt Engineering",
    badge: "Highest Rated",
    platform: "TutorialsPoint",
    gradient: "from-indigo-900/50 to-blue-900/50"
  },
  {
    title: "Master Notion: All-in-One Productivity",
    badge: "Highest Rated",
    platform: "Udemy",
    gradient: "from-zinc-800 to-zinc-900"
  },
  {
    title: "Canva Masterclass for Social Media",
    badge: "Bestseller",
    platform: "Skillshare",
    gradient: "from-cyan-900/50 to-blue-900/50"
  }
];

export default function Courses() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center"
          style={{ letterSpacing: '-0.03em' }}
        >
          Featured Courses
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div 
              key={idx}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden group hover:border-white/30 transition-all duration-300 flex flex-col"
            >
              {/* Image Placeholder area using gradient */}
              <div className={`h-48 w-full bg-gradient-to-br ${course.gradient} relative flex items-center justify-center p-6 text-center`}>
                <h4 className="text-xl font-bold text-white/80 group-hover:text-white transition-colors">{course.title}</h4>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                  {course.platform}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <h3 className="text-xl font-bold tracking-tight leading-snug group-hover:text-accent transition-colors">
                  {course.title}
                </h3>
                
                <div>
                  <span className="inline-block bg-accent/20 text-accent font-bold text-xs px-3 py-1 rounded-full">
                    {course.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
