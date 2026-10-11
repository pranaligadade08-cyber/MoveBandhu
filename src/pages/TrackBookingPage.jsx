import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
  PhoneCall,
  MessageCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

const ALL_STATUS_STEPS = [
  "Inquiry Received",
  "Estimate Prepared",
  "Awaiting Customer Confirmation",
  "Booking Confirmed",
  "Partner Assigned",
  "Pickup in Progress",
  "In Transit",
  "Delivered",
  "Completed"
];

export const TrackBookingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const [referenceInput, setReferenceInput] = useState(initialRef);
  const [booking, setBooking] = useState(null);
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchRecord = async (ref) => {
    if (!ref.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setBooking(null);
    setInquiry(null);

    try {
      try {
        const res = await api.bookings.getById(ref.trim());
        if (res.booking) {
          setBooking(res.booking);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to checking inquiry store
      }

      const inqRes = await api.inquiries.getById(ref.trim());
      if (inqRes.inquiry) {
        setInquiry(inqRes.inquiry);
      } else {
        setErrorMsg(`No record found matching reference "${ref}". Please check the ID or contact support.`);
      }
    } catch {
      setErrorMsg(`No record found matching reference "${ref}". Please verify the code.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchRecord(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecord(referenceInput);
  };

  const getTranslatedStatus = (statusStr) => {
    switch (statusStr) {
      case "Inquiry Received":
        return t.statusInquiryReceived;
      case "Estimate Prepared":
        return t.statusEstimatePrepared;
      case "Awaiting Customer Confirmation":
        return t.statusAwaitingConfirmation;
      case "Booking Confirmed":
        return t.statusBookingConfirmed;
      case "Partner Assigned":
        return t.statusPartnerAssigned;
      case "Pickup in Progress":
        return t.statusPickupInProgress;
      case "In Transit":
        return t.statusInTransit;
      case "Delivered":
        return t.statusDelivered;
      case "Completed":
        return t.statusCompleted;
      case "Cancelled":
        return t.statusCancelled;
      default:
        return statusStr;
    }
  };

  const currentStatus = booking ? booking.status : inquiry ? inquiry.status : null;
  const currentStepIndex = currentStatus ? ALL_STATUS_STEPS.indexOf(currentStatus) : -1;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link & Header */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#DD2A7B] mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-3xl font-black tracking-tight font-heading">
            {t.trackBooking}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your booking or inquiry reference (e.g. <span className="font-mono font-bold text-[#DD2A7B]">BK-KOP-9102</span> or <span className="font-mono font-bold text-[#DD2A7B]">MB-KOP-8421</span>) to see the current status.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="glass-card p-3 rounded-2xl border shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            required
            placeholder="Enter reference ID (e.g. BK-KOP-9102)"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
            className="flex-1 text-sm font-bold uppercase tracking-wider bg-transparent focus:outline-none px-2"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl btn-ig text-white text-xs font-bold shadow-md hover:opacity-95 transition cursor-pointer"
          >
            {isLoading ? "Checking..." : "Track"}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Container */}
        {(booking || inquiry) && (
          <div className="glass-panel rounded-3xl border shadow-xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Top Bar with Status Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-500/15">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Reference ID
                </span>
                <span className="text-2xl font-black font-mono text-gold-pink">
                  {booking ? booking.referenceId : inquiry.referenceId}
                </span>
                <div className="text-xs text-gray-400 mt-0.5">
                  Customer: <span className="font-bold text-current">{booking ? booking.customerName : inquiry.customerName}</span> ({booking ? booking.phone : inquiry.phone})
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Current Status
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm ${
                  currentStatus === "Cancelled"
                    ? "bg-red-500/15 text-red-500 border border-red-500/30"
                    : currentStatus === "Completed"
                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                    : "btn-ig text-white"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span>{getTranslatedStatus(currentStatus)}</span>
                </span>
              </div>
            </div>

            {/* Visual Workflow Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Shipment Progression
              </h3>

              {currentStatus === "Cancelled" ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                  This booking has been cancelled. If this was a mistake, please contact our helpline.
                </div>
              ) : (
                <div className="relative">
                  {/* Step Indicators */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                    {ALL_STATUS_STEPS.map((step, idx) => {
                      const isPast = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? "btn-ig text-white ring-4 ring-pink-500/30 scale-110 shadow-lg"
                                : isPast
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-gray-500/15 text-gray-400"
                            }`}
                          >
                            {isPast ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-2 leading-tight font-medium ${
                              isCurrent
                                ? "font-bold text-[#DD2A7B]"
                                : isPast
                                ? "font-semibold"
                                : "text-gray-400"
                            }`}
                          >
                            {getTranslatedStatus(step)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Partner Details (if assigned) */}
            {booking && booking.assignedPartnerName && (
              <div className="glass-card border border-pink-500/25 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#DD2A7B]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DD2A7B]">
                      Assigned Driver & Vehicle
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold">
                    {booking.assignedPartnerName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Vehicle: <span className="font-semibold text-current">{booking.assignedVehicle || "Tata Ace"}</span>
                  </p>
                </div>

                {booking.assignedPartnerPhone && (
                  <a
                    href={`tel:${booking.assignedPartnerPhone}`}
                    className="px-4 py-2 rounded-xl btn-ig text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-95 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                    <span>Call Driver: {booking.assignedPartnerPhone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Route & Shipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-500/15 text-xs">
              
              {/* Pickup */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{t.pickupLocation}</span>
                </div>
                <p className="glass-card p-3 rounded-xl border">
                  {booking ? booking.pickupAddress : inquiry.pickupAddress}
                  <span className="block font-bold text-gray-400 text-[11px] mt-1">
                    Area: {booking ? booking.pickupArea : inquiry.pickupArea}
                  </span>
                </p>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <MapPin className="w-4 h-4 text-[#DD2A7B]" />
                  <span>{t.dropLocation}</span>
                </div>
                <p className="glass-card p-3 rounded-xl border">
                  {booking ? booking.destinationAddress : inquiry.destinationAddress}
                  <span className="block font-bold text-gray-400 text-[11px] mt-1">
                    Area: {booking ? booking.destinationArea : inquiry.destinationArea}
                  </span>
                </p>
              </div>

              {/* Schedule */}
              <div className="space-y-1 glass-card p-3 rounded-xl border">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Moving Date:</span>
                </div>
                <div className="font-bold text-sm">
                  {booking ? booking.movingDate : inquiry.movingDate} ({booking ? booking.preferredTime : inquiry.preferredTime})
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-1 glass-card p-3 rounded-xl border">
                <span className="text-gray-400">Indicative Cost:</span>
                <div className="font-black text-xl text-gold-pink font-mono">
                  ₹{(booking ? booking.finalCost || booking.estimatedCost : inquiry.estimatedCost || 1500).toLocaleString("en-IN")}
                </div>
              </div>

            </div>

            {/* Help / WhatsApp Strip */}
            <div className="pt-4 border-t border-gray-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-400">Questions about your move schedule?</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/918855029692?text=Hello%20MoveBandhu%2C%20inquiring%20about%20reference%20${booking ? booking.referenceId : inquiry.referenceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Coordinator</span>
                </a>
                <a
                  href="tel:+918855029692"
                  className="px-3.5 py-2 rounded-xl glass-card border font-bold hover:text-[#DD2A7B] transition"
                >
                  Call +91 88550 29692
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
