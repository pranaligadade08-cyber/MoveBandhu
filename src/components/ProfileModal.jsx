import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Save,
  Calendar
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, refreshUser, logout } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      await api.auth.updateProfile({ name, phone });
      await refreshUser();
      setStatusMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return { label: "Administrator", color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "partner":
        return { label: "Transporter Partner", color: "bg-blue-100 text-blue-700 border-blue-200" };
      default:
        return { label: "Customer", color: "bg-pink-100 text-[#DD2A7B] border-pink-200" };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with MoveBandhu Gradient */}
        <div className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center text-2xl font-black shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1 border border-white/30 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>MoveBandhu Verified Profile</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-white/90">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {statusMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Account Overview Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 block mb-1">Account Role</span>
              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 block mb-1">Member ID</span>
              <span className="text-xs font-mono font-bold text-gray-800 truncate block">
                {user.id || user._id || "MB-USER"}
              </span>
            </div>
          </div>

          {/* Partner Extra Details if applicable */}
          {user.role === "partner" && user.partnerProfile && (
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#DD2A7B]">
                <Truck className="w-4 h-4" />
                <span>Partner Driver Credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
                <div>
                  <span className="text-gray-500 text-[10px] block">Business:</span>
                  <span className="font-bold">{user.partnerProfile.businessName}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Vehicle:</span>
                  <span className="font-bold">{user.partnerProfile.vehicleType}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Registration No:</span>
                  <span className="font-bold">{user.partnerProfile.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Status:</span>
                  <span className="font-bold text-emerald-600 capitalize">{user.partnerProfile.verificationStatus || "Approved"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Profile Details Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#DD2A7B]" />
                  <span>Full Name</span>
                </label>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-[#DD2A7B] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              <input
                type="text"
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full text-xs px-3.5 py-3 rounded-xl border focus:outline-none transition ${
                  isEditing
                    ? "glass-input border-pink-300 ring-2 ring-pink-500/20 bg-white"
                    : "bg-gray-50/80 border-gray-200 text-gray-700"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-[#DD2A7B]" />
                <span>Email Address (Primary Login)</span>
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full text-xs px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-[#DD2A7B]" />
                <span>Mobile Number (10-digit Indian)</span>
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`w-full text-xs px-3.5 py-3 rounded-xl border focus:outline-none transition ${
                  isEditing
                    ? "glass-input border-pink-300 ring-2 ring-pink-500/20 bg-white"
                    : "bg-gray-50/80 border-gray-200 text-gray-700"
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 rounded-xl btn-ig text-white font-extrabold text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name);
                    setPhone(user.phone);
                    setIsEditing(false);
                    setErrorMsg(null);
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Action Links */}
          <div className="pt-3 border-t border-gray-200/70 flex flex-col sm:flex-row items-center gap-2.5">
            <Link
              to={user.role === "admin" ? "/admin" : user.role === "partner" ? "/partner" : "/dashboard"}
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white border border-gray-200 hover:border-pink-300 text-gray-800 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-[#DD2A7B]" />
              <span>
                {user.role === "admin"
                  ? "Open Admin Panel"
                  : user.role === "partner"
                  ? "Open Partner Portal"
                  : "View My Bookings"}
              </span>
            </Link>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-red-600 font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
