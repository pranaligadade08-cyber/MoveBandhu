import { Link } from "react-router-dom";
import { Truck, Phone, MessageCircle, Mail, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-[#120F17] text-[#A0A5AC] pt-16 pb-12 border-t border-pink-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="MoveBandhu"
                className="w-11 h-11 rounded-full object-cover shadow-lg shadow-pink-500/25 border border-white/20"
              />
              <span className="text-2xl font-black text-white tracking-tight font-heading">
                Move<span className="text-gold-pink">Bandhu</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.footerAbout}
            </p>

            <div className="text-xs text-pink-200/90 bg-white/5 p-3.5 rounded-2xl border border-white/10 max-w-sm backdrop-blur-md">
              <p className="font-bold text-white mb-0.5">पश्चिम महाराष्ट्र वाहतूक केंद्र:</p>
              <p>Kolhapur (MH 09) • Sangli-Miraj (MH 10) • Satara-Karad (MH 11) NH-48 Corridor</p>
            </div>

            {/* Language buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Globe className="w-4 h-4 text-[#DD2A7B]" />
              {["en", "mr", "hi"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                    language === lang
                      ? "btn-ig text-white shadow-xs"
                      : "bg-white/10 text-gray-300 hover:bg-white/15"
                  }`}
                >
                  {lang === "en" ? "English" : lang === "mr" ? "मराठी" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.services}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#services" className="hover:text-pink-300 transition">Home Shifting (घर स्थलांतर)</a></li>
              <li><a href="/#services" className="hover:text-pink-300 transition">Furniture Moving (फर्निचर)</a></li>
              <li><a href="/#services" className="hover:text-pink-300 transition">Mini Truck & Tempo (टेम्पो)</a></li>
              <li><a href="/#services" className="hover:text-pink-300 transition">Loading Helpers (हमाल)</a></li>
              <li><a href="/#services" className="hover:text-pink-300 transition">Office Relocation (ऑफिस)</a></li>
              <li><a href="/#services" className="hover:text-pink-300 transition">Packing & Wrapping (पॅकिंग)</a></li>
            </ul>
          </div>

          {/* Covered Districts & Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.regionHubs}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-gray-300 font-semibold">Kolhapur:</span> <span className="text-gray-400">Rajarampuri, Shiroli, Ichalkaranji</span></li>
              <li><span className="text-gray-300 font-semibold">Sangli:</span> <span className="text-gray-400">Vishrambag, Miraj, Kupwad, Islampur</span></li>
              <li><span className="text-gray-300 font-semibold">Satara:</span> <span className="text-gray-400">Powai Naka, Karad, MIDC, Wai</span></li>
              <li><span className="text-pink-400 font-medium">NH-48 Corridor Transit Daily</span></li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.contactUs}
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="tel:+918855029692"
                  className="flex items-center gap-2 text-white font-bold hover:text-pink-300 transition"
                >
                  <Phone className="w-4 h-4 text-[#DD2A7B]" />
                  <span>+91 88550 29692</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918855029692?text=Hello%20MoveBandhu%20Kolhapur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 font-bold hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>support@movebandhu.in</span>
                </div>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-gray-400 block">Operating Hours:</span>
                <span className="text-xs text-white font-medium">Daily 06:30 AM – 10:00 PM IST</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} MoveBandhu Kolhapur. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/track" className="hover:text-pink-300 transition">{t.trackBooking}</Link>
            <a href="#calculator" className="hover:text-pink-300 transition">{t.calculator}</a>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Local Transport License MH-KOP-2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
