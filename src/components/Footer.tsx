import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0E1512] text-[#D8E2DC] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Tagline */}
        <div className="text-center md:text-left space-y-1">
          <div className="font-serif text-2xl font-black tracking-tight text-[#FAF7F2] uppercase">
            <span className="text-[#FA7D09]">ZEUPREME</span> DELI
          </div>
          <p className="text-xs text-[#8A958E] font-medium">
            Where Flavor Meets Passion
          </p>
        </div>

        {/* Right: Copyright and Original Credit */}
        <div className="text-center md:text-right space-y-1 text-xs text-[#8A958E]">
          <p>© {new Date().getFullYear()} Zeupreme Deli. All rights reserved.</p>
          <p>
            Designed by Zeus with <span className="text-red-500">❤️</span> for food lovers
          </p>
          <p className="text-[11px] text-[#A4B5AC]">
            123 Flavor Street, Westlands, Nairobi · Check out portfolio <span className="text-[#FA7D09] font-semibold">Zeus.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
