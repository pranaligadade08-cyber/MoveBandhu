import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Lock, Mail, User, Phone, Truck, AlertCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "login",
  initialRole = "customer",
  onSuccess
}) => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vehicleType, setVehicleType] = useState("Tata Ace (Chhota Hathi)");
  const [vehicleNumber, setVehicleNumber] = useState("MH 09 CW ");
  const [experienceYears, setExperienceYears] = useState(3);
  const [helpersCount, setHelpersCount] = useState(2);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRole(initialRole);
      setErrorMsg(null);
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      let authedUser;
      if (mode === "login") {
        authedUser = await login(email, password);
      } else {
        authedUser = await register({
          name,
          email,
          phone,
          password,
          role,
          partnerDetails:
            role === "partner"
              ? {
                  businessName,
                  vehicleType,
                  vehicleNumber,
                  experienceYears: Number(experienceYears) || 3,
                  helpersCount: Number(helpersCount) || 2,
                  operatingLocations: ["Rajarampuri", "Tarabai Park", "Shiroli MIDC"]
                }
              : undefined
        });
      }

      onClose();

      if (authedUser?.role === "admin") {
        navigate("/admin");
      } else if (onSuccess) {
        onSuccess(authedUser);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme-aware styles to eliminate blurry whitish boxes in dark mode
  const modalBoxClass = isDark
    ? "bg-[#140F22] border border-white/15 text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)]"
    : "bg-white border border-pink-200/60 text-gray-900 shadow-[0_25px_60px_rgba(221,42,123,0.15)]";

  const inputClass = isDark
    ? "bg-[#211A34] border border-white/20 text-white placeholder-gray-500 focus:border-[#DD2A7B] focus:ring-2 focus:ring-[#DD2A7B]/30"
    : "bg-gray-50/80 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#DD2A7B] focus:ring-2 focus:ring-[#DD2A7B]/20";

  const labelClass = isDark ? "text-gray-200 font-bold" : "text-gray-800 font-bold";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 transition-colors ${modalBoxClass}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#BE185D] via-[#9333EA] to-[#4338CA] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo.png"
              alt="MoveBandhu"
              className="w-10 h-10 rounded-2xl object-cover border-2 border-white/60 shadow-md bg-white"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider border border-white/30 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-pink-200" />
                <span>MoveBandhu Secure Portal</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight">
            {mode === "login" ? t.login : t.register}
          </h2>
          <p className="text-xs text-white/90 mt-1">
            {mode === "login"
              ? "Sign in to access your customer bookings, partner driver portal, or admin ops center."
              : "Create an account to book moves and manage shipments."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Role Selector (Customers & Partner Drivers Only) */}
          {mode === "register" && (
            <div className={`flex rounded-2xl p-1 mb-2 border ${isDark ? "bg-[#211A34] border-white/10" : "bg-gray-100 border-gray-200"}`}>
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  role === "customer"
                    ? isDark
                      ? "bg-gradient-to-r from-[#BE185D] to-[#9333EA] text-white shadow-md"
                      : "bg-white shadow-sm text-gray-900 border border-pink-200"
                    : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Customer (ग्राहक)
              </button>
              <button
                type="button"
                onClick={() => setRole("partner")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  role === "partner"
                    ? isDark
                      ? "bg-gradient-to-r from-[#BE185D] to-[#9333EA] text-white shadow-md"
                      : "bg-white shadow-sm text-purple-700 border border-purple-200"
                    : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Partner Driver (वाहतूकदार)
              </button>
            </div>
          )}

          {/* Registration Name & Phone */}
          {mode === "register" && (
            <>
              <div>
                <label className={`text-xs block mb-1 ${labelClass}`}>
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santosh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-3 rounded-xl focus:outline-none transition-colors ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs block mb-1 ${labelClass}`}>
                  {t.mobileNumber} (Indian 10-digit)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="98223 45678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-3 rounded-xl focus:outline-none transition-colors ${inputClass}`}
                  />
                </div>
              </div>

              {/* Partner Driver Details */}
              {role === "partner" && (
                <div className={`p-4 rounded-2xl space-y-3 border ${
                  isDark ? "bg-[#211A34]/70 border-purple-500/30" : "bg-purple-50/80 border-purple-200"
                }`}>
                  <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                    <Truck className="w-4 h-4" />
                    <span>Transporter & Vehicle Details</span>
                  </div>

                  <div>
                    <label className={`text-[11px] font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Business or Transport Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patil Kolhapur Cargo"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl focus:outline-none transition-colors ${inputClass}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-[11px] font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className={`w-full text-xs p-2.5 rounded-xl focus:outline-none transition-colors ${inputClass}`}
                      >
                        <option value="Tata Ace (Chhota Hathi)">Tata Ace (Chhota Hathi)</option>
                        <option value="Bolero Maxi Truck">Bolero Maxi Truck</option>
                        <option value="Piaggio Ape / 3-Wheeler">Piaggio Ape / 3-Wheeler</option>
                        <option value="14ft Eicher Container">14ft Eicher Container</option>
                      </select>
                    </div>

                    <div>
                      <label className={`text-[11px] font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Vehicle No. (MH 09...)
                      </label>
                      <input
                        type="text"
                        placeholder="MH 09 CW 1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className={`w-full text-xs p-2.5 rounded-xl focus:outline-none transition-colors ${inputClass}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email Address */}
          <div>
            <label className={`text-xs block mb-1 ${labelClass}`}>
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-xs pl-9 pr-3 py-3 rounded-xl focus:outline-none transition-colors ${inputClass}`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`text-xs block mb-1 ${labelClass}`}>
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-xs pl-9 pr-3 py-3 rounded-xl focus:outline-none transition-colors ${inputClass}`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl btn-ig text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition disabled:opacity-50 cursor-pointer mt-2 hover:opacity-95"
          >
            {isSubmitting ? "Processing..." : mode === "login" ? t.login : t.register}
          </button>

          {/* Toggle Login / Register */}
          <div className={`pt-2 text-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {mode === "login" ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg(null);
                  }}
                  className={`font-bold hover:underline cursor-pointer ${isDark ? "text-pink-400" : "text-purple-600"}`}
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg(null);
                  }}
                  className={`font-bold hover:underline cursor-pointer ${isDark ? "text-pink-400" : "text-purple-600"}`}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
