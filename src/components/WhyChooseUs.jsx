import {
  BadgePercent,
  MapPin,
  Users,
  CalendarClock,
  MessageSquareShare,
  ShieldCheck,
  CheckCircle2,
  Phone
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const WhyChooseUs = () => {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: BadgePercent,
      title: t.transparentPricing,
      desc: t.transparentPricingDesc
    },
    {
      icon: MapPin,
      title: t.triadFleet,
      desc: t.triadFleetDesc
    },
    {
      icon: Users,
      title: t.trainedHelpers,
      desc: t.trainedHelpersDesc
    },
    {
      icon: CalendarClock,
      title: t.punctualService,
      desc: t.punctualServiceDesc
    },
    {
      icon: MessageSquareShare,
      title: t.directWhatsapp,
      desc: t.directWhatsappDesc
    },
    {
      icon: ShieldCheck,
      title: t.safeSecure,
      desc: t.safeSecureDesc
    }
  ];

  return (
    <section id="why-us" className="py-20 border-b border-pink-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Kolhapur Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading">
            <span className="text-gold-pink">{t.whyMoveMateTitle}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            {t.whyMoveMateSubtitle}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-card p-7 rounded-3xl border border-white/60 hover:border-pink-300 transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center mb-5 shadow-lg shadow-pink-500/25">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 font-heading">
                  <span>{item.title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Local Kolhapur Assurance Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl glass-panel border border-white/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-black text-gray-900 font-heading">
              Need an urgent shifting or heavy load tempo in Kolhapur today?
            </h4>
            <p className="text-sm text-gray-600">
              Call our direct dispatch desk or chat with our logistics coordinator.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+918855029692"
              className="px-6 py-3.5 rounded-2xl btn-ig text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call +91 88550 29692</span>
            </a>
            <a
              href="https://wa.me/918855029692?text=Hello%20MoveBandhu%20Kolhapur%2C%20I%20need%20urgent%20shifting%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
