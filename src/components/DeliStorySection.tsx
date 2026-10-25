import React, { useState } from 'react';
import { MapPin, Phone, Clock, Car, Instagram, Facebook, Twitter, Check } from 'lucide-react';

export const DeliStorySection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <div id="location" className="w-full bg-white text-[#161E1A] space-y-20 pt-16">
      {/* ---------------- FIND US SECTION (Matching Original Project) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#FA7D09]">
            Find Us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5A635B]">
            Visit our restaurant for the full Zeupreme experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Card: Location & Hours Details */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#FA7D09]/15 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#161E1A]">
                Our Location
              </h3>

              <div className="space-y-4 text-sm text-[#4A554E]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FA7D09] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#161E1A]">123 Flavor Street</p>
                    <p className="text-[#5A635B]">Westlands, Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FA7D09] shrink-0" />
                  <a href="tel:+254712345678" className="font-mono font-medium hover:text-[#FA7D09] transition-colors">
                    +254 712 345 678
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#FA7D09] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#161E1A]">Mon-Sat: 10am – 10pm</p>
                    <p className="text-[#5A635B]">Sun: 11am – 8pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking Available Box */}
            <div className="pt-6 border-t border-[#FA7D09]/15 space-y-1">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#FA7D09]" />
                <h4 className="font-serif text-base font-bold text-[#161E1A]">
                  Parking Available
                </h4>
              </div>
              <p className="text-xs text-[#5A635B] pl-6">
                Free parking for customers in our dedicated lot right outside the deli entrance.
              </p>
            </div>
          </div>

          {/* Right Card: Stylized Westlands Nairobi Map Graphic */}
          <div className="relative bg-[#E8EEF5] rounded-3xl border border-[#FA7D09]/15 overflow-hidden shadow-sm min-h-[340px] flex items-center justify-center p-6">
            {/* Visual SVG Map of Westlands Nairobi */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Stylized Street Grid */}
            <svg className="absolute inset-0 w-full h-full text-slate-300 stroke-current" strokeWidth="3" fill="none">
              <path d="M-50,80 Q200,120 500,70 T900,100" strokeWidth="5" stroke="#CBD5E1" />
              <path d="M-20,240 Q300,200 650,260 T1000,220" strokeWidth="6" stroke="#94A3B8" />
              <path d="M120,-20 L160,400" />
              <path d="M380,-20 L350,420" strokeWidth="4" />
              <path d="M560,-20 L600,400" />
            </svg>

            {/* Nairobi Westlands Landmarks */}
            <div className="absolute top-6 left-8 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-medium text-slate-600 shadow-2xs">
              Parklands Rd
            </div>
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-medium text-slate-600 shadow-2xs">
              Ojijo Rd · Westlands
            </div>
            <div className="absolute top-12 right-12 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-medium text-slate-600 shadow-2xs">
              Hyatt Regency
            </div>

            {/* Center Animated Pin for Zeupreme Deli */}
            <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
              <div className="bg-[#FA7D09] text-white p-3 rounded-full shadow-xl ring-4 ring-white">
                <MapPin className="w-7 h-7 fill-white text-[#FA7D09]" />
              </div>
              <div className="mt-2 bg-[#161E1A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[#FA7D09]">●</span>
                <span>Zeupreme Deli · 123 Flavor St</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FOLLOW US & NEWSLETTER (Vibrant Orange Banner from Original) ---------------- */}
      <section className="w-full bg-[#FA7D09] text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Follow Us
          </h2>
          <p className="text-sm sm:text-base text-white/95 max-w-lg mx-auto">
            Stay updated with our latest creations, special offers, and behind-the-scenes moments!
          </p>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#FA7D09] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Follow Zeupreme Deli on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#FA7D09] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Follow Zeupreme Deli on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#FA7D09] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Follow Zeupreme Deli on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Newsletter Form */}
          <div className="pt-6">
            <h3 className="font-serif text-xl font-bold mb-3">
              Subscribe to Our Newsletter
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-full text-xs sm:text-sm text-[#161E1A] bg-white placeholder-slate-400 focus:outline-none shadow-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-[#FA7D09] bg-white hover:bg-[#FFF3E8] transition-all cursor-pointer shadow-md whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
