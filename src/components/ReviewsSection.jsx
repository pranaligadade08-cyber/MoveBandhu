import { useEffect, useState } from "react";
import { Star, MapPin, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

export const ReviewsSection = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await api.reviews.list();
        setReviews(res.reviews || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="py-20 border-b border-pink-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Customer Stories: MH 09 • MH 10 • MH 11</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading">
            <span className="text-gold-pink">Trusted by Homes & Businesses</span> Across Kolhapur, Sangli & Satara
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Real shifting experiences from Kolhapur (Rajarampuri, Tarabai Park), Sangli (Vishrambag, Miraj), and Satara (Powai Naka, Karad).
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="glass-card p-6 sm:p-7 rounded-3xl border border-white/60 shadow-sm hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3 text-amber-500">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F58529] text-[#F58529]" />
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-1.5">5.0</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 italic">
                  "{language === "mr" && rev.commentMr ? rev.commentMr : rev.commentEn}"
                </p>
              </div>

              {/* Author & Location */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>{rev.customerName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#DD2A7B]" />
                    <span>{rev.location}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#DD2A7B] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200/50">
                  {rev.serviceName}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
