import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle,
  Power,
  Star
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

export const PartnerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const loadPartnerData = async () => {
    setIsLoading(true);
    try {
      const res = await api.partners.getMyProfile();
      setProfile(res.profile);
      setAssignedBookings(res.bookings || []);
    } catch (err) {
      console.error("Failed to load partner profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  const toggleAvailability = async () => {
    if (!profile) return;
    try {
      const res = await api.partners.updateAvailability(!profile.isAvailable);
      setProfile(res.profile);
      setActionMsg(`Status changed to ${!profile.isAvailable ? "Available for Trips" : "Offline"}`);
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleUpdateTripStatus = async (bookingId, nextStatus) => {
    try {
      await api.bookings.updateStatus(bookingId, nextStatus, `Partner marked as ${nextStatus}`);
      setActionMsg(`Trip status updated to: ${nextStatus}`);
      loadPartnerData();
    } catch (err) {
      alert(err.message || "Failed to update trip status");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header & Transporter Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl btn-ig text-white flex items-center justify-center font-black text-2xl shadow-md">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-heading">
                  {profile?.businessName || user?.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  profile?.verificationStatus === "approved"
                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                }`}>
                  {profile?.verificationStatus || "Pending Approval"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-4">
                <span>Vehicle: <strong className="text-current">{profile?.vehicleType}</strong> ({profile?.vehicleNumber})</span>
                <span>Experience: <strong className="text-current">{profile?.experienceYears} Yrs</strong></span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{profile?.rating || "4.9"}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Toggle Online Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAvailability}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-md ${
                profile?.isAvailable
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "glass-card border text-gray-400 hover:text-current"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{profile?.isAvailable ? "AVAILABLE (ONLINE)" : "OFFLINE"}</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Operating Areas Badge Strip */}
        <div className="glass-card border border-pink-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[#DD2A7B] block">Registered Kolhapur Operating Hubs:</span>
            <span className="text-gray-400 mt-0.5 block">
              {profile?.operatingLocations?.join(", ") || "Rajarampuri, Tarabai Park, Shiroli MIDC, Shahupuri"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-[11px] block">Completed Trips</span>
            <span className="text-2xl font-black text-gold-pink font-mono">{profile?.completedTrips || 0}</span>
          </div>
        </div>

        {/* Assigned Jobs & Trips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-heading flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#DD2A7B]" />
              <span>Assigned Shifting Trips</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-500/15 px-2.5 py-0.5 rounded-full">
                {assignedBookings.length}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="glass-card p-8 rounded-2xl border text-center text-xs text-gray-400">
              Loading partner trips...
            </div>
          ) : assignedBookings.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border text-center space-y-2">
              <p className="text-sm font-semibold">No active trips assigned at the moment.</p>
              <p className="text-xs text-gray-400">Keep your status marked "ONLINE" to receive new dispatches from the Kolhapur coordination desk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {assignedBookings.map((b) => (
                <div
                  key={b._id}
                  className="glass-card rounded-2xl p-6 border shadow-sm space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-500/15">
                    <div>
                      <span className="text-xs font-mono font-bold text-white btn-ig px-3 py-1 rounded-md shadow-xs">
                        {b.referenceId}
                      </span>
                      <span className="text-xs font-bold ml-2">
                        Customer: {b.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-pink-500/15 text-[#DD2A7B] border border-pink-500/30">
                        {b.status}
                      </span>
                      <span className="text-lg font-black text-gold-pink font-mono">
                        Payout: ₹{(b.finalCost || b.estimatedCost).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Route & Schedule */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="glass-panel p-3.5 rounded-xl border space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>Pickup: {b.pickupAddress} ({b.pickupArea})</span>
                      </div>
                      <div className="font-bold flex items-center gap-1.5 pt-1">
                        <MapPin className="w-4 h-4 text-[#DD2A7B]" />
                        <span>Drop: {b.destinationAddress} ({b.destinationArea})</span>
                      </div>
                    </div>

                    <div className="glass-panel p-3.5 rounded-xl border space-y-1">
                      <div>📅 <strong>Schedule:</strong> {b.movingDate} at {b.preferredTime}</div>
                      <div>👷 <strong>Helpers Required:</strong> {b.helpersCount} Hamals</div>
                      <div>📦 <strong>Packing:</strong> {b.packingRequired}</div>
                      <div className="pt-1">
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Customer: {b.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Operational Status Action Buttons */}
                  <div className="pt-3 border-t border-gray-500/15 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-400 font-semibold">
                      Update Transit Progress:
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {b.status === "Partner Assigned" && (
                        <button
                          onClick={() => handleUpdateTripStatus(b._id, "Pickup in Progress")}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-sm transition"
                        >
                          Start Pickup (सामान भरण्यास प्रारंभ)
                        </button>
                      )}

                      {b.status === "Pickup in Progress" && (
                        <button
                          onClick={() => handleUpdateTripStatus(b._id, "In Transit")}
                          className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 cursor-pointer shadow-sm transition"
                        >
                          Mark In Transit (गाडी निघाली)
                        </button>
                      )}

                      {b.status === "In Transit" && (
                        <button
                          onClick={() => handleUpdateTripStatus(b._id, "Delivered")}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer shadow-sm transition"
                        >
                          Mark Delivered (पोहोचले)
                        </button>
                      )}

                      {b.status === "Delivered" && (
                        <button
                          onClick={() => handleUpdateTripStatus(b._id, "Completed")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-sm transition"
                        >
                          Complete Job (काम पूर्ण झाले)
                        </button>
                      )}

                      {b.status === "Completed" && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Trip Completed & Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
