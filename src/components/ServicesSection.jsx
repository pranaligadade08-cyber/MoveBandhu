import {
  Home,
  Armchair,
  Truck,
  Users,
  PackageCheck,
  Wrench,
  Building2,
  Box,
  Boxes,
  Hammer,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const ServicesSection = ({ onSelectService }) => {
  const { language, t } = useLanguage();

  const services = [
    {
      key: "home-shifting",
      icon: Home,
      title: t.homeShifting,
      descEn: "Full flat, bungalow and apartment shifting with packing, careful loading, and safe transport anywhere in Kolhapur.",
      descMr: "कोल्हापुरात फ्लॅट, बंगला आणि घरांचे सुरक्षित पॅकिंग, लोडिंग आणि वाहतूक सेवेसह संपूर्ण स्थलांतर.",
      descHi: "अपार्टमेंट और घरों की सुरक्षित पैकिंग, लोडिंग और परिवहन के साथ आसान और संपूर्ण शिफ्टिंग।",
      vehicle: "Tata Ace / 14ft Eicher",
      basePrice: "₹2,200",
      badge: "Most Popular"
    },
    {
      key: "furniture-transport",
      icon: Armchair,
      title: t.furnitureTransport,
      descEn: "Scratch-guard transit for wooden almirahs, double beds, dining sets, sofa suites, and electronics.",
      descMr: "सोफा, कपाट, डायनिंग टेबल, लाकडी बेड इत्यादींचे स्क्रॅच-प्रूफ ब्लँकेटने सुरक्षित वहन.",
      descHi: "सोफा, अलमारी, डाइनिंग टेबल और पलंग की स्क्रैच-फ्री सुरक्षित ढुलाई।",
      vehicle: "Tata Ace / Piaggio Ape",
      basePrice: "₹950",
      badge: "Zero Scratches"
    },
    {
      key: "mini-truck-tempo",
      icon: Truck,
      title: t.miniTruckTempo,
      descEn: "Instant booking for verified local Tata Ace (Chhota Hathi), Bolero Maxi Truck, and Piaggio commercial tempos.",
      descMr: "स्थानिक विश्वसनीय टाटा एस (छोटा हाथी), बोलेरो मॅक्सी ट्रक व टेम्पो त्वरित भाड्याने.",
      descHi: "लोकल विश्वसनीय टाटा एस, बोलेरो पिकअप और टेम्पो तत्काल बुकिंग के लिए।",
      vehicle: "Tata Ace / Bolero Pickup",
      basePrice: "₹750",
      badge: "Fast Dispatch"
    },
    {
      key: "loading-unloading",
      icon: Users,
      title: t.loadingUnloading,
      descEn: "Disciplined and experienced local loading workers (hamals) for climbing stairs and lifting heavy appliances safely.",
      descMr: "जड वस्तू, कपाटे आणि फ्रिज सुरक्षित जिन्यावरून चढवणे व उतरवण्यासाठी अनुभवी हमाल मदतनिस.",
      descHi: "भारी सामान, सीढ़ियों से चढ़ाना-उतारना और सुरक्षित लोडिंग के लिए कुशल सहायक।",
      vehicle: "Labor Only",
      basePrice: "₹400 / worker",
      badge: "Trained Staff"
    },
    {
      key: "packing-wrapping",
      icon: PackageCheck,
      title: t.packingWrapping,
      descEn: "Industrial 3-layer bubble wrap, edge protectors, corrugated rolls, and heavy carton boxes for fragile goods.",
      descMr: "इलेक्ट्रॉनिक्स, टीव्ही आणि काचेच्या नाजूक साहित्यासाठी बबल रॅप, बॉक्स व मजबूत पॅकिंग.",
      descHi: "टीवी, फ्रिज और कांच के बर्तनों के लिए बबल रैप व प्रीमियम बॉक्स पैकिंग।",
      vehicle: "Materials & Packing Crew",
      basePrice: "₹600",
      badge: "Safe Guard"
    },
    {
      key: "dismantle-assemble",
      icon: Wrench,
      title: t.dismantleAssemble,
      descEn: "Professional carpentry for modular wardrobes, king-size storage beds, dining tables, and curtain fittings.",
      descMr: "हायड्रॉलिक बेड, मॉड्युलर कपाट आणि कर्टन रॉड व्यवस्थित खोलणे व नवीन घरी बसवून देणे.",
      descHi: "हाइड्रोलिक बेड, मॉड्यूलर अलमारी खोलना और नए घर में सही तरीके से दोबारा फिट करना।",
      vehicle: "Skilled Carpenter",
      basePrice: "₹500",
      badge: "Expert Carpenter"
    },
    {
      key: "office-relocation",
      icon: Building2,
      title: t.officeRelocation,
      descEn: "Planned commercial moving for clinics, IT firms, shops, and coaching centers with minimum downtime.",
      descMr: "दुकान, क्लिनिक, शोरूम आणि ऑफिसचे त्वरित व नियोजनबद्ध शिफ्टिंग.",
      descHi: "कमर्शियल ऑफिस, क्लिनिक और दुकानों की बिना रुकावट सुगम शिफ्टिंग।",
      vehicle: "14ft / 17ft Closed Container",
      basePrice: "₹3,500",
      badge: "Commercial"
    },
    {
      key: "single-item-transport",
      icon: Box,
      title: t.singleItemTransport,
      descEn: "Affordable transport for single items like a single refrigerator, washing machine, cupboard, or mattress.",
      descMr: "फक्त एक फ्रिज, वॉशिंग मशीन किंवा गादी हलवण्यासाठी परवडणाऱ्या दरात जलद सेवा.",
      descHi: "केवल एक फ्रिज, वाशिंग मशीन या गद्दा किफायती दर पर ले जाने की सेवा।",
      vehicle: "Piaggio Ape / 3-Wheeler",
      basePrice: "₹550",
      badge: "Budget Friendly"
    },
    {
      key: "goods-transport",
      icon: Boxes,
      title: t.localGoodsTransport,
      descEn: "Daily business logistics between Laxmipuri, Gandhinagar cloth market, and Shiroli/Gokul Shirgaon MIDC.",
      descMr: "लक्ष्मीपुरी, गांधीनगर मार्केट आणि शिरोली/गोकुळ शिरगाव एमआयडीसी दरम्यान नियमित मालवाहतूक.",
      descHi: "लक्ष्मीपुरी और गांधीनगर मार्केट से शहर के विभिन्न हिस्सों में नियमित माल ढुलाई।",
      vehicle: "Tata Ace / Bolero Pickup",
      basePrice: "₹850",
      badge: "B2B Logistics"
    },
    {
      key: "construction-materials",
      icon: Hammer,
      title: t.constructionMaterial,
      descEn: "Direct site delivery for tiles, bathroom fixtures, paint containers, plumbing pipes, and hardware supplies.",
      descMr: "टाईल्स, सॅनिटरी, पेंट्स, पाईप्स व हार्डवेअर साहित्य साईटवर थेट पोहोचवणे.",
      descHi: "टाइल्स, हार्डवेयर, पाइप और पेंट ड्रम कंस्ट्रक्शन साइट पर सीधे पहुँचाना।",
      vehicle: "Bolero Pickup / Tipper",
      basePrice: "₹900",
      badge: "Heavy Duty"
    }
  ];

  const getServiceDesc = (s) => {
    if (language === "mr") return s.descMr;
    if (language === "hi") return s.descHi;
    return s.descEn;
  };

  return (
    <section id="services" className="py-20 border-b border-pink-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Kolhapur Shifting Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading">
            <span className="text-gold-pink">{t.servicesTitle}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.key}
                className="group relative glass-card rounded-3xl p-6 sm:p-7 border border-white/60 hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-pink-200/50 text-[#DD2A7B] shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-[#DD2A7B] transition-colors mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {getServiceDesc(item)}
                  </p>

                  {/* Vehicle Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-gray-200/80 text-gray-700 text-xs font-semibold mb-6">
                    <Truck className="w-3.5 h-3.5 text-[#DD2A7B]" />
                    <span>{item.vehicle}</span>
                  </div>
                </div>

                {/* Footer with Price & Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-gray-400 block">
                      {t.startingFrom}
                    </span>
                    <span className="text-lg font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] to-[#DD2A7B]">
                      {item.basePrice}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(item.key)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-ig shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    <span>{t.bookService}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
