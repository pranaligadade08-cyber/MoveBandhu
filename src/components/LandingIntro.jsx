import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  UserPlus,
  Volume2,
  VolumeX
} from "lucide-react";

export const LandingIntro = ({ onSkip, onRegister }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser policy:", err);
      });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black flex flex-col justify-between text-white font-sans animate-in fade-in duration-300">
      
      {/* Background Video with 95% Opacity and Crisp Overlays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-95 scale-105 transition-opacity duration-700"
        >
          <source src="/landing.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Minimal gradient overlays for maximum video visibility and text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Top Bar with Brand & "Skip Intro" at Right Top Corner */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="MoveBandhu Logo"
            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/40"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight font-heading flex items-center gap-1 drop-shadow-md">
              Move<span className="text-gold-pink">Bandhu</span>
            </span>
            <span className="text-[10px] text-pink-300 font-semibold tracking-wider uppercase drop-shadow">
              Kolhapur • Sangli • Satara
            </span>
          </div>
        </div>

        {/* Right Controls: Audio Toggle & Skip Intro */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-full bg-black/75 hover:bg-black/90 border border-white/30 text-white flex items-center justify-center transition cursor-pointer shadow-xl backdrop-blur-md"
            title={isMuted ? "Unmute video" : "Mute video"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-pink-300" />}
          </button>

          <button
            onClick={onSkip}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black/75 hover:bg-black/90 border border-white/30 hover:border-pink-400 text-white text-xs sm:text-sm font-bold shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 backdrop-blur-md"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-4 h-4 text-pink-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Center Informative Content: Clear, Open, and Feature-Grid Free */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-auto text-center space-y-8">
        
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-pink-500/50 text-pink-200 text-xs font-bold tracking-wide backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#F58529] animate-pulse" />
          <span>Western Maharashtra's Dedicated Shifting & Logistics Platform</span>
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-heading drop-shadow-lg">
            Shift Anything Across <br />
            <span className="text-gold-pink">Kolhapur, Sangli & Satara</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
            From single furniture moves to complete multi-room home & industrial relocations. 
            Transparent rates, verified local drivers (MH 09, MH 10, MH 11), and zero bargaining headache.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onSkip}
            className="px-8 py-3.5 rounded-2xl btn-ig text-white font-bold text-sm shadow-xl shadow-purple-500/40 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Explore MoveBandhu App</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={onRegister}
            className="px-8 py-3.5 rounded-2xl bg-black/75 hover:bg-black/90 border border-white/30 hover:border-pink-400 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 backdrop-blur-md"
          >
            <UserPlus className="w-4 h-4 text-pink-300" />
            <span>Create Free Account</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar info */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-300 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 drop-shadow">
        <span>© {new Date().getFullYear()}• MoveBandhu Logistics •</span>
        <span> MADE BY 458</span>
      </div>

    </div>
  );
};
