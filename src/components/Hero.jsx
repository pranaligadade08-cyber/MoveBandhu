import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Truck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { DISTRICT_AREAS, ALL_COVERED_AREAS } from "../translations";

export const Hero = ({ onOpenInquiry, onScrollToCalculator }) => {
  const { t } = useLanguage();
  const [pickupArea, setPickupArea] = useState(ALL_COVERED_AREAS[0]);
  const [dropArea, setDropArea] = useState(DISTRICT_AREAS[1].areas[0]);
  const [serviceType, setServiceType] = useState("home-shifting");

  const handleQuickInquire = (e) => {
    e.preventDefault();
    onOpenInquiry({
      pickupArea,
      destinationArea: dropArea,
      serviceCategory: serviceType
    });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-pink-500/10">
      {/* Subtle background radial dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#DD2A7B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-pink-500/20 text-[#DD2A7B] text-xs font-bold tracking-wide backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F58529] to-[#DD2A7B] animate-pulse" />
              <span>Kolhapur • Sangli • Satara Dedicated Shifting Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12] font-heading">
              {t.heroHeadline.includes("Move") ? (
                <span>
                  {t.heroHeadline.split("Move")[0]}
                  <span className="text-gold-pink">Move</span>
                  {t.heroHeadline.split("Move")[1]}
                </span>
              ) : (
                <span className="text-gold-pink">{t.heroHeadline}</span>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl font-normal">
              {t.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToCalculator}
                className="px-7 py-3.5 rounded-2xl btn-ig text-white font-bold text-base shadow-xl shadow-purple-500/25 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.getEstimate}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/15 dark:hover:bg-white/25 border border-slate-800 dark:border-white/20 font-bold text-base transition-all shadow-md cursor-pointer"
              >
                {t.exploreServices}
              </a>

              <a
                href="tel:+918855029692"
                className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span>{t.callNow}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">MH 09 • 10 • 11</h4>
                  <p className="text-[11px] text-gray-500">Verified regional drivers</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Highway Punctual</h4>
                  <p className="text-[11px] text-gray-500">NH-48 express moves</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-50 text-[#DD2A7B] flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Zero Scratch Policy</h4>
                  <p className="text-[11px] text-gray-500">Safe packing & straps</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero: Interactive Quick Booking & Animated Route Card */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Route Request Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/60 relative backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="MoveBandhu Logo"
                    className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-pink-500/20 border-2 border-white/80"
                  />
                  <div>
                    <h3 className="text-base font-black text-gray-900 font-heading">Quick Shifting Booking</h3>
                    <p className="text-xs text-gray-500">Kolhapur • Sangli • Satara</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Fleet
                </span>
              </div>

              <form onSubmit={handleQuickInquire} className="space-y-4 mt-5">
                
                {/* Pickup Area */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.pickupLocation}</span>
                  </label>
                  <select
                    value={pickupArea}
                    onChange={(e) => setPickupArea(e.target.value)}
                    className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-3 text-slate-900 dark:text-slate-100"
                  >
                    {DISTRICT_AREAS.map((group) => (
                      <optgroup key={group.district} label={`📍 ${group.district} (${group.rtoCode})`}>
                        {group.areas.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Drop Area */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.dropLocation}</span>
                  </label>
                  <select
                    value={dropArea}
                    onChange={(e) => setDropArea(e.target.value)}
                    className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-3 text-slate-900 dark:text-slate-100"
                  >
                    {DISTRICT_AREAS.map((group) => (
                      <optgroup key={group.district} label={`🏁 ${group.district} (${group.rtoCode})`}>
                        {group.areas.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Select Service</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-3 text-slate-900 dark:text-slate-100"
                  >
                    <option value="home-shifting">Complete Home Shifting (घर स्थलांतर)</option>
                    <option value="furniture-transport">Furniture Transport (फर्निचर वाहतूक)</option>
                    <option value="mini-truck-tempo">Mini Truck & Tempo (मिनी ट्रक / छोटा हाथी)</option>
                    <option value="single-item-transport">Single-Item Move (एकल वस्तू वाहतूक)</option>
                    <option value="office-relocation">Office Relocation (दुकान व ऑफिस)</option>
                    <option value="goods-transport">Goods Transport (व्यापारी मालवाहतूक)</option>
                  </select>
                </div>

                {/* Submit Quick CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl btn-ig font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <span>{t.inquireNow} & Get Quote</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Verified Corridor Strip */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>📍 Popular: Kolhapur ⇄ Sangli ⇄ Satara</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Highway Corridor</span>
              </div>
            </div>

            {/* Illustrated Route Badge Strip */}
            <div className="glass-card border border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                <span className="font-bold">NH-48 Corridor Fleet Active</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Tempos Ready</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
