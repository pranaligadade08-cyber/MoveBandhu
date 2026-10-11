import { useState, useEffect } from "react";
import { X, Lock, Mail, User, Phone, Truck, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "login",
  initialRole = "customer",
  onSuccess
}) => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
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
      if (onSuccess) {
        onSuccess(authedUser);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md glass-modal rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
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
                <span>MoveBandhu Security</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight">
            {mode === "login" ? t.login : t.register}
          </h2>
          <p className="text-xs text-white/90 mt-1">
            {mode === "login"
              ? "Sign in to manage your bookings and driver updates."
              : "Create an account to track shipments and access member benefits."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If registering, select Role */}
          {mode === "register" && (
            <div className="flex rounded-2xl bg-gray-100/80 p-1 mb-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  role === "customer" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
                }`}
              >
                Customer (ग्राहक)
              </button>
              <button
                type="button"
                onClick={() => setRole("partner")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  role === "partner" ? "bg-white shadow-sm text-purple-700" : "text-gray-500"
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
                <label className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-1">
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
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-1">
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
                    className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Extra fields if registering as Partner */}
              {role === "partner" && (
                <div className="p-4 bg-purple-50/50 border border-purple-200/60 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Transporter & Vehicle Details</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      Business or Transport Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patil Kolhapur Cargo"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full text-xs p-2.5 glass-input rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full text-xs p-2.5 glass-input rounded-xl focus:outline-none"
                      >
                        <option value="Tata Ace (Chhota Hathi)">Tata Ace (Chhota Hathi)</option>
                        <option value="Bolero Maxi Truck">Bolero Maxi Truck</option>
                        <option value="Piaggio Ape / 3-Wheeler">Piaggio Ape / 3-Wheeler</option>
                        <option value="14ft Eicher Container">14ft Eicher Container</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Vehicle No. (MH 09...)
                      </label>
                      <input
                        type="text"
                        placeholder="MH 09 CW 1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className="w-full text-xs p-2.5 glass-input rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-1">
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
                className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-1">
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
                className="w-full text-xs pl-9 pr-3 py-3 glass-input rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl btn-ig text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {isSubmitting ? "Processing..." : mode === "login" ? t.login : t.register}
          </button>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-gray-600">
            {mode === "login" ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
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
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
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
