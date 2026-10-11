import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  X,
  MapPin,
  Calendar
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const BookingSuccessModal = ({
  isOpen,
  onClose,
  referenceId,
  whatsappUrl,
  directCallNumber,
  details
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrack = () => {
    onClose();
    navigate(`/track?ref=${referenceId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl shadow-2xl border border-white/80 p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
          <span className="text-gold-pink">{t.successTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-sm mx-auto">
          Your shifting inquiry has been registered in the MoveBandhu Kolhapur network.
        </p>

        {/* Reference ID Pill */}
        <div className="my-5 p-4 rounded-2xl glass-card border border-pink-200/60 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {t.bookingRefLabel}
            </span>
            <span className="text-xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] to-[#DD2A7B] tracking-wide">
              {referenceId}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-pink-200/60 text-xs font-bold text-gray-700 hover:text-[#DD2A7B] transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Details snippet */}
        {details && (
          <div className="text-left bg-pink-50/70 border border-pink-200/60 rounded-2xl p-3.5 mb-5 text-xs text-gray-700 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#DD2A7B]" />
              <span className="truncate">{details.pickupAddress || details.pickupArea} ➔ {details.destinationAddress || details.destinationArea}</span>
            </div>
            {details.movingDate && (
              <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {details.movingDate} ({details.preferredTime || "Morning"})</span>
              </div>
            )}
          </div>
        )}

        {/* Primary Action 1: WhatsApp */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.whatsappInquiry}</span>
          </a>
          <p className="text-[11px] text-gray-500 italic px-2">
            {t.whatsappNotice}
          </p>
        </div>

        {/* Action 2: Direct Phone Call */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <a
            href={`tel:${directCallNumber}`}
            className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200/80 bg-white/70 text-xs font-bold text-gray-800 hover:bg-white flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-[#DD2A7B]" />
            <span>{t.callDirectly}</span>
          </a>

          <button
            onClick={handleTrack}
            className="flex-1 py-2.5 px-3 rounded-xl btn-ig text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-pink-500/20"
          >
            <span>{t.viewBookingStatus}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
