import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Utensils, Play, Pause, Volume2, VolumeX, Sparkles, MapPin } from 'lucide-react';
import { HeroFloatingIngredientsCanvas } from './HeroFloatingIngredientsCanvas';

interface HeroVideoProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  onOrderNow,
  onViewMenu,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-slicing-freshly-baked-bread-43285-large.mp4";
  const posterImg = "/src/assets/images/hero_pastrami_deli_sandwich_1792923468404.jpg";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        
        const bufferSize = audioCtxRef.current.sampleRate * 2;
        const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.035;
        }

        const whiteNoise = audioCtxRef.current.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 850;

        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        whiteNoise.start(0);
        noiseNodeRef.current = whiteNoise;
        setIsMuted(false);
      } catch {
        setIsMuted(false);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
          noiseNodeRef.current.disconnect();
        } catch {}
        noiseNodeRef.current = null;
      }
      setIsMuted(true);
    }
  };

  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <section id="hero" className="relative w-full min-h-[660px] lg:min-h-[740px] flex items-center justify-center overflow-hidden bg-[#161E1A] text-[#FDFBF7]">
      {/* 1. Background Video Layer with Fallback Poster */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={posterImg}
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-35 scale-105 transition-transform duration-[14000ms] ease-out' : 'opacity-25'
          }`}
          src={videoSrc}
        />
        
        {/* Warm Storefront Orange Glow Scrim (Inspired by the storefront lighting) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161E1A] via-[#161E1A]/85 to-[#161E1A]/55" />
        <div className="absolute inset-0 bg-radial at-center from-[#FA7D09]/20 via-[#161E1A]/60 to-[#161E1A]/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#FA7D09]/15 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Supporting 3D Floating Ingredients Canvas (Tomatoes, Lettuce, Cheese, Bread, Pickles) */}
      <HeroFloatingIngredientsCanvas />

      {/* 3. Foreground Hero Text & Actions */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Location & Storefront Kicker */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#FA7D09] mb-4">
          <MapPin className="w-4 h-4" />
          <span>123 Flavor Street · Westlands, Nairobi</span>
          <span aria-hidden="true">·</span>
          <span>Open Daily</span>
        </div>

        {/* Display Brand Headline from Original Project */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#FAF7F2] uppercase mb-4 text-balance drop-shadow-md">
          <span className="text-[#FA7D09]">ZEUPREME</span> DELI
        </h1>

        {/* Brand Tagline */}
        <p className="font-serif italic text-2xl sm:text-3xl text-[#FFE8D6] font-medium mb-4">
          Where Flavor Meets Passion
        </p>

        {/* Lead description */}
        <p className="text-sm sm:text-base lg:text-lg text-[#D8E2DC] max-w-2xl font-light leading-relaxed mb-10 text-balance">
          24-hour marinated crispy fried chicken, authentic street tacos, hand-tossed artisan pizzas, and slow-cured pastrami crafted with pure passion in Westlands.
        </p>

        {/* Action CTAs: Matching the original "Order Now" (Orange) and "View Menu" (White) buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOrderNow}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FA7D09] hover:bg-[#E06700] text-white font-bold rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
          >
            Order Now
          </button>

          <button
            onClick={onViewMenu}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#FFF3E8] text-[#FA7D09] font-bold rounded-xl text-base shadow-md transition-all duration-200 cursor-pointer border border-[#FA7D09]/20 hover:scale-105"
          >
            View Menu
          </button>
        </div>

        {/* Value Highlights */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#FDFBF7]/10 w-full text-left">
          <div className="space-y-0.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#FA7D09]">24 Hours</span>
            <p className="text-xs text-[#B2C2B9]">Spiced buttermilk chicken marinade</p>
          </div>
          <div className="space-y-0.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#FA7D09]">Hand-Tossed</span>
            <p className="text-xs text-[#B2C2B9]">Fresh sourdough pizza crusts daily</p>
          </div>
          <div className="space-y-0.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#FA7D09]">Street Style</span>
            <p className="text-xs text-[#B2C2B9]">Authentic tacos with signature lime crema</p>
          </div>
          <div className="space-y-0.5">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#FA7D09]">Westlands</span>
            <p className="text-xs text-[#B2C2B9]">Free customer parking & fast delivery</p>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Media Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#161E1A]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#FA7D09]/20 text-xs text-[#D8E2DC]">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          aria-label={isPlaying ? "Pause background reel" : "Play background reel"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause Reel" : "Play Reel"}</span>
        </button>
        <span className="text-[#FA7D09]/30">|</span>
        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          aria-label={isMuted ? "Unmute kitchen ambience" : "Mute kitchen ambience"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#FA7D09]" />}
          <span className="hidden sm:inline">{isMuted ? "Kitchen Sizzle: Off" : "Ambience: Sizzling"}</span>
        </button>
      </div>
    </section>
  );
};
