import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Truck,
  MapPin,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Edit2,
  Check,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

export const CustomerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [phoneInput, setPhoneInput] = useState(user?.phone || "");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bkRes, inqRes] = await Promise.all([
        api.bookings.list(),
        api.inquiries.list()
      ]);
      setBookings(bkRes.bookings || []);
      setInquiries(inqRes.inquiries || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone);
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.bookings.cancel(bookingId);
      setActionMsg("Booking has been cancelled.");
      loadData();
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile({ name: nameInput, phone: phoneInput });
      await refreshUser();
      setIsEditingProfile(false);
      setActionMsg("Profile updated successfully");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header & Profile Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl btn-ig text-white flex items-center justify-center font-black text-2xl font-heading shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-heading">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-500/15 text-[#DD2A7B] border border-pink-500/30">
                  Customer
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#DD2A7B]" /> {user?.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#DD2A7B]" /> {user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl glass-card border text-xs font-bold hover:text-[#DD2A7B] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? "Cancel" : "Edit Profile"}</span>
            </button>
            <a
              href="/#calculator"
              className="px-5 py-2.5 rounded-xl btn-ig text-white text-xs font-bold shadow-md hover:opacity-95 transition"
            >
              New Booking
            </a>
          </div>
        </div>

        {/* Profile Edit Inline Form */}
        {isEditingProfile && (
          <form onSubmit={handleUpdateProfile} className="glass-card border border-pink-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#DD2A7B]">
              Update Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full text-xs p-2.5 glass-input rounded-xl border focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full text-xs p-2.5 glass-input rounded-xl border focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 btn-ig text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {actionMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Bookings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-heading flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#DD2A7B]" />
              <span>{t.myBookings}</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-500/15 px-2.5 py-0.5 rounded-full">
                {bookings.length}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="glass-card p-8 rounded-2xl border text-center text-gray-400 text-xs">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border text-center space-y-3">
              <p className="text-sm text-gray-400">You haven't placed any bookings yet.</p>
              <a
                href="/#calculator"
                className="inline-block px-5 py-2.5 btn-ig text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95"
              >
                Estimate & Book Move
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="glass-card rounded-2xl p-6 border shadow-xs hover:border-pink-500/40 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-500/15">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-gold-pink bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-md">
                        {b.referenceId}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 font-medium">
                        Service: <span className="font-bold text-current">{b.serviceCategory}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold btn-ig text-white">
                        {b.status}
                      </span>
                      <Link
                        to={`/track?ref=${b.referenceId}`}
                        className="p-1.5 text-gray-400 hover:text-[#DD2A7B] rounded-lg glass-card border"
                        title="View Detailed Tracking"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Route & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-0.5">Route:</span>
                      <div className="font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{b.pickupAddress}</span>
                      </div>
                      <div className="font-bold flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#DD2A7B] flex-shrink-0" />
                        <span>{b.destinationAddress}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-0.5">Schedule & Vehicle:</span>
                      <div className="font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{b.movingDate} ({b.preferredTime})</span>
                      </div>
                      <div className="text-gray-400 mt-1">
                        🚛 {b.vehiclePreference} • {b.helpersCount} Helpers
                      </div>
                    </div>

                    <div className="md:text-right">
                      <span className="text-gray-400 block mb-0.5">Estimated Fare:</span>
                      <div className="text-xl font-black font-mono text-gold-pink">
                        ₹{(b.finalCost || b.estimatedCost).toLocaleString("en-IN")}
                      </div>
                      {b.assignedPartnerName && (
                        <div className="text-[11px] text-emerald-500 font-bold mt-1">
                          Driver: {b.assignedPartnerName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-500/15 flex items-center justify-between">
                    <a
                      href={`https://wa.me/918855029692?text=Hi%20MoveBandhu%2C%20regarding%20my%20booking%20${b.referenceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat with Support</span>
                    </a>

                    {!["Pickup in Progress", "In Transit", "Delivered", "Completed", "Cancelled"].includes(b.status) && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-400 transition cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiries Section */}
        {inquiries.length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-black font-heading flex items-center gap-2">
              <span>My Inquiries</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-500/15 px-2.5 py-0.5 rounded-full">
                {inquiries.length}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div key={inq._id} className="glass-card p-5 rounded-2xl border space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-gold-pink">{inq.referenceId}</span>
                    <span className="px-2.5 py-0.5 bg-gray-500/15 font-bold text-gray-400 rounded text-[11px]">
                      {inq.status}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    📍 {inq.pickupAddress} ➔ {inq.destinationAddress}
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Date: {inq.movingDate} • {inq.vehiclePreference}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
