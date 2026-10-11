import { Truck, CheckCircle2, IndianRupee, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const PartnerSection = ({ onJoinPartner }) => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-[#18121E] via-[#201426] to-[#18121E] text-white relative overflow-hidden border-b border-pink-500/20">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#F58529]/15 via-[#DD2A7B]/20 to-[#8134AF]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span>Kolhapur • Sangli • Satara Transporter Network</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-heading leading-tight">
              <span className="text-gold-pink">{t.partnerTitle}</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
              {t.partnerSubtitle}
            </p>

            {/* Partner Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F58529] to-[#DD2A7B] text-white mt-0.5 shadow-md shadow-pink-500/20">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Daily Guaranteed Payouts</h4>
                  <p className="text-xs text-gray-400">Zero commission deductions on your hard work</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#DD2A7B] to-[#8134AF] text-white mt-0.5 shadow-md shadow-pink-500/20">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Direct WhatsApp Dispatch</h4>
                  <p className="text-xs text-gray-400">Clear pickup and drop details with customer phone</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mt-0.5 shadow-md">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Tata Ace, Ape & Bolero Fleet</h4>
                  <p className="text-xs text-gray-400">All commercial tempo categories welcome</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mt-0.5 shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Respect & Fair Treatment</h4>
                  <p className="text-xs text-gray-400">Fixed loading-unloading rates for helpers and drivers</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onJoinPartner}
                className="px-7 py-3.5 rounded-2xl btn-ig text-white font-bold text-sm shadow-xl shadow-pink-500/30 transition flex items-center gap-2 cursor-pointer"
              >
                <span>{t.becomePartner}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <a
                href="tel:+918855029692"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition backdrop-blur-md"
              >
                Talk to Partner Desk: +91 88550 29692
              </a>
            </div>

          </div>

          {/* Right Partner Stat Card */}
          <div className="lg:col-span-5 bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-2xl shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2 font-heading">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Transporter Onboarding: MH 09 • MH 10 • MH 11</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DD2A7B] flex-shrink-0" />
                <span>Commercial vehicles registered in MH 09 (Kolhapur), MH 10 (Sangli), or MH 11 (Satara)</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DD2A7B] flex-shrink-0" />
                <span>Valid Commercial Driving License & Vehicle Insurance</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DD2A7B] flex-shrink-0" />
                <span>Protective tarpaulin (ताडपत्री) and shifting ropes/straps</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DD2A7B] flex-shrink-0" />
                <span>Local intra-city and NH-48 inter-district highway trips</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/30 text-center backdrop-blur-md">
              <span className="text-[11px] text-pink-200 uppercase font-bold tracking-wider block">
                Partner Onboarding Helpline
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                +91 88550 29692
              </span>
              <span className="text-[10px] text-gray-300 mt-1 block">
                Regional Hubs: Kolhapur • Sangli • Satara • Karad • Miraj
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
