import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Chetan Pujari.</h2>
            <p className="text-gray-400 font-medium">
              I Make Tech, AI & Design Simple.
            </p>
            <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Center Column */}
          <div className="space-y-6 md:px-8">
            <h3 className="text-lg font-bold tracking-tight">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Journey</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-tight">Contact & More</h3>
            <ul className="space-y-3 flex flex-col">
              <a 
                href="mailto:chetanpujari92@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 w-max"
              >
                <Mail className="w-4 h-4" />
                <span>chetanpujari92@gmail.com</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Newsletter</a>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-8 text-center px-6">
        <p className="text-gray-500 text-sm">
          &copy; 2026 Chetan Pujari. Built with AI, designed with intention.
        </p>
      </div>
    </footer>
  );
}
