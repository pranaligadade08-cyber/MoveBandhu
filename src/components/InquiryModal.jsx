import { useState, useEffect } from "react";
import {
  X,
  Send,
  MapPin,
  Truck,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  Package,
  Users
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { DISTRICT_AREAS, ALL_COVERED_AREAS } from "../translations";

export const InquiryModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceCategory, setServiceCategory] = useState("home-shifting");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupArea, setPickupArea] = useState(ALL_COVERED_AREAS[0]);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationArea, setDestinationArea] = useState(DISTRICT_AREAS[1].areas[0]);
  const [movingDate, setMovingDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (09:00 AM - 12:00 PM)");
  const [propertyType, setPropertyType] = useState("1_bhk");
  const [vehiclePreference, setVehiclePreference] = useState("Tata Ace (Chhota Hathi)");
  const [helpersCount, setHelpersCount] = useState(2);
  const [packingRequired, setPackingRequired] = useState("standard");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(undefined);

  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (initialData) {
      if (initialData.serviceCategory) setServiceCategory(initialData.serviceCategory);
      if (initialData.pickupArea) setPickupArea(initialData.pickupArea);
      if (initialData.destinationArea) setDestinationArea(initialData.destinationArea);
      if (initialData.propertyType) setPropertyType(initialData.propertyType);
      if (initialData.helpersCount !== undefined) setHelpersCount(initialData.helpersCount);
      if (initialData.packingRequired) setPackingRequired(initialData.packingRequired);
      if (initialData.estimatedCost) setEstimatedCost(initialData.estimatedCost);
    }
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setMovingDate(tomorrow);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg(t.fieldRequiredMsg + ": " + t.fullName);
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg(t.phoneValidationMsg);
      return;
    }
    if (!pickupAddress.trim()) {
      setErrorMsg(t.fieldRequiredMsg + ": " + t.pickupLocation);
      return;
    }
    if (!destinationAddress.trim()) {
      setErrorMsg(t.fieldRequiredMsg + ": " + t.dropLocation);
      return;
    }
    if (!movingDate) {
      setErrorMsg(t.fieldRequiredMsg + ": " + t.movingDate);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName,
        phone: cleanPhone,
        email: email || undefined,
        serviceCategory,
        pickupAddress,
        destinationAddress,
        pickupArea,
        destinationArea,
        movingDate,
        preferredTime,
        propertyType,
        vehiclePreference,
        helpersCount: Number(helpersCount),
        packingRequired,
        additionalNotes,
        estimatedCost: estimatedCost || 2200
      };

      const res = await api.inquiries.create(payload);
      onSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit booking inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl glass-modal rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MoveBandhu"
              className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-white/40"
            />
            <div>
              <h2 className="text-xl font-black font-heading tracking-tight">
                {t.inquireNow} — MoveBandhu
              </h2>
              <p className="text-xs text-white/90">
                Kolhapur • Sangli • Satara Shifting & Transport Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#DD2A7B]" />
              <span>Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.fullName} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Patil"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.mobileNumber} (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 88550 29692"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.emailAddress}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Addresses & Regions */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#DD2A7B]" />
              <span>Locations & Route</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.pickupLocation} (Area) *
                </label>
                <select
                  value={pickupArea}
                  onChange={(e) => setPickupArea(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl p-3 focus:outline-none mb-2 font-semibold"
                >
                  {DISTRICT_AREAS.map((group) => (
                    <optgroup key={group.district} label={`📍 ${group.district} (${group.rtoCode})`}>
                      {group.areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <textarea
                  rows={2}
                  required
                  placeholder="Exact pickup building, floor, landmark (e.g. Flat 302, Royal Residency, Nagala Park)"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full text-xs p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.dropLocation} (Area) *
                </label>
                <select
                  value={destinationArea}
                  onChange={(e) => setDestinationArea(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl p-3 focus:outline-none mb-2 font-semibold"
                >
                  {DISTRICT_AREAS.map((group) => (
                    <optgroup key={group.district} label={`🏁 ${group.district} (${group.rtoCode})`}>
                      {group.areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <textarea
                  rows={2}
                  required
                  placeholder="Exact drop house/office address (e.g. Bungalow No. 4, Near Ganpati Temple, Vishrambag)"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full text-xs p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Shifting Details */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#DD2A7B]" />
              <span>Logistics & Moving Requirements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.movingDate} *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    required
                    value={movingDate}
                    onChange={(e) => setMovingDate(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  >
                    <option value="Early Morning (06:30 AM - 09:00 AM)">Early Morning (06:30 AM - 09:00 AM)</option>
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 03:30 PM)">Afternoon (12:00 PM - 03:30 PM)</option>
                    <option value="Evening (03:30 PM - 07:00 PM)">Evening (03:30 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Vehicle Preference
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={vehiclePreference}
                    onChange={(e) => setVehiclePreference(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  >
                    <option value="Tata Ace (Chhota Hathi)">Tata Ace (Chhota Hathi) - Up to 850 KG</option>
                    <option value="Bolero Maxi Truck">Mahindra Bolero Pickup - Up to 1.5 Ton</option>
                    <option value="Piaggio Ape / 3-Wheeler">Piaggio Ape / 3-Wheeler - Up to 500 KG</option>
                    <option value="14ft Eicher Container">14ft Eicher Container - 3.5 Ton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Helpers Required
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={helpersCount}
                    onChange={(e) => setHelpersCount(Number(e.target.value))}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  >
                    <option value={0}>0 - No Helpers (Driver only)</option>
                    <option value={1}>1 Helper (For small loads)</option>
                    <option value={2}>2 Helpers (Standard 1-2 BHK)</option>
                    <option value={3}>3 Helpers</option>
                    <option value={4}>4 Helpers (Recommended for 3 BHK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Packing Service
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <select
                    value={packingRequired}
                    onChange={(e) => setPackingRequired(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  >
                    <option value="none">None (Self Packed)</option>
                    <option value="standard">Standard Bubble Wrap & Blankets</option>
                    <option value="premium">Premium 3-Layer Heavy Box Packaging</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.additionalNotes}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 1 King-size double bed, 1 double door fridge, washing machine, dining table with 4 chairs..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full text-xs p-3 glass-input rounded-xl focus:outline-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200/80 bg-white/70 text-xs font-semibold text-gray-700 hover:bg-white cursor-pointer"
            >
              {t.close}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-ig text-white font-bold text-xs shadow-md shadow-pink-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : t.submitInquiry}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
