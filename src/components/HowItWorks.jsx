import { ClipboardList, MapPinned, Calculator, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: ClipboardList,
      title: t.step1Title,
      desc: t.step1Desc
    },
    {
      num: "02",
      icon: MapPinned,
      title: t.step2Title,
      desc: t.step2Desc
    },
    {
      num: "03",
      icon: Calculator,
      title: t.step3Title,
      desc: t.step3Desc
    },
    {
      num: "04",
      icon: CheckCircle,
      title: t.step4Title,
      desc: t.step4Desc
    }
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-pink-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading">
            <span className="text-gold-pink">{t.howItWorksTitle}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative glass-card rounded-3xl p-7 border border-white/60 shadow-sm hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/25">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-4xl font-black font-heading text-pink-200/60">
                      {step.num}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-gray-900 mb-2.5 font-heading">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Sub indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1 text-[11px] font-bold text-[#DD2A7B]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
