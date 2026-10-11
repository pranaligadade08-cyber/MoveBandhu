import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Globe,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Search,
  ChevronDown,
  UserPlus,
  Sun,
  Moon,
  Sparkles,
  Play
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useTheme, THEMES } from "../context/ThemeContext";

export const Navbar = ({ onOpenInquiry, onOpenAuth, onOpenProfile, onOpenIntro }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const languages = [
    { code: "en", label: "English", sub: "EN" },
    { code: "mr", label: "मराठी", sub: "MR" },
    { code: "hi", label: "हिंदी", sub: "HI" }
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* 1. Left: Clean Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/logo.png"
              alt="MoveBandhu Logo"
              className="w-8 h-8 rounded-full object-cover shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform duration-200 border border-white/40"
            />
            <span className="text-lg font-black tracking-tight font-heading">
              Move<span className="text-gold-pink">Bandhu</span>
            </span>
          </Link>

          {/* 2. Middle: Streamlined Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold tracking-tight opacity-90">
            <a href="/#services" className="hover:text-[#DD2A7B] transition-colors">
              {t.services}
            </a>
            <a href="/#how-it-works" className="hover:text-[#DD2A7B] transition-colors">
              {t.howItWorks}
            </a>
            <a href="/#why-us" className="hover:text-[#DD2A7B] transition-colors">
              {t.whyUs}
            </a>
            <a href="/#calculator" className="hover:text-[#DD2A7B] transition-colors">
              {t.calculator}
            </a>
            <Link to="/track" className="hover:text-[#DD2A7B] transition-colors flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#DD2A7B]" />
              <span>{t.trackBooking}</span>
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#9333EA] to-[#4338CA] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/25 hover:opacity-95 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Ops</span>
              </Link>
            )}
          </nav>

          {/* 3. Right: Sleek Utility Actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            
            {/* Quick Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="w-8.5 h-8.5 rounded-xl border glass-card text-xs font-bold hover:border-[#DD2A7B] hover:text-[#DD2A7B] transition-all shadow-xs cursor-pointer flex items-center justify-center"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-[#F58529] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#DD2A7B] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Compact Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-xl border glass-card text-xs font-bold hover:border-[#DD2A7B] hover:text-[#DD2A7B] transition-all shadow-xs cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#DD2A7B]" />
                <span className="uppercase text-[11px] font-mono tracking-wider">{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 glass-modal rounded-2xl shadow-xl border py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        language === lang.code
                          ? "bg-pink-500/20 text-[#DD2A7B] font-bold"
                          : "hover:bg-pink-500/10 hover:text-[#DD2A7B]"
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-mono">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Single Intro Video Button */}
            {onOpenIntro && (
              <button
                onClick={onOpenIntro}
                className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-xl border glass-card text-xs font-bold hover:border-[#DD2A7B] hover:text-[#DD2A7B] transition-all shadow-xs cursor-pointer group"
                title="Watch App Intro Video"
              >
                <Play className="w-3 h-3 text-[#DD2A7B] fill-[#DD2A7B] group-hover:scale-110 transition-transform" />
                <span>Intro</span>
              </button>
            )}

            {/* Inquire CTA */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth("register", "customer");
                } else {
                  onOpenInquiry();
                }
              }}
              className="h-8.5 px-3.5 rounded-xl text-xs font-bold btn-ig shadow-md transition-all cursor-pointer hover:opacity-95"
            >
              {t.inquireNow}
            </button>

            {/* User Account / Profile Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 h-9 px-2.5 rounded-xl glass-card border hover:border-[#DD2A7B]/50 transition cursor-pointer shadow-xs group"
                  title="Your Account"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-bold max-w-[85px] truncate leading-tight">
                    {user?.name?.split(" ")[0] || "Profile"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#DD2A7B] transition-colors" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-modal rounded-2xl shadow-xl border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-gray-500/20 glass-panel">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">MoveBandhu Account</p>
                      <p className="text-xs font-black truncate mt-0.5">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 bg-pink-500/15 text-[#DD2A7B] border border-pink-500/30 rounded-full">
                        {user?.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-pink-500/15 hover:text-[#DD2A7B] transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#DD2A7B]" />
                      <span>View & Edit Profile</span>
                    </button>

                    {user?.role === "admin" ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-pink-500/15 hover:text-[#DD2A7B] transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#DD2A7B]" />
                        {t.adminPanel}
                      </Link>
                    ) : user?.role === "partner" ? (
                      <Link
                        to="/partner"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-pink-500/15 hover:text-[#DD2A7B] transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#DD2A7B]" />
                        {t.partnerPortal}
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-pink-500/15 hover:text-[#DD2A7B] transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#DD2A7B]" />
                        {t.myBookings}
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/15 border-t border-gray-500/20 mt-1 cursor-pointer transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="h-8.5 px-3 text-xs font-bold hover:text-[#DD2A7B] glass-card border hover:border-pink-300 rounded-xl transition cursor-pointer"
                >
                  {t.login || "Sign In"}
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="h-8.5 flex items-center gap-1.5 px-3 text-xs font-bold text-white btn-ig rounded-xl transition cursor-pointer shadow-md hover:opacity-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.register || "Register"}</span>
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border glass-card flex items-center justify-center cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#F58529]" /> : <Moon className="w-4 h-4 text-[#DD2A7B]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl border glass-card flex items-center justify-center text-current cursor-pointer hover:border-[#DD2A7B]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-500/20 glass-panel px-4 pt-4 pb-6 space-y-4 backdrop-blur-2xl">
          
          {/* Theme selector row */}
          <div className="flex items-center justify-between py-2 border-b border-gray-500/20">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DD2A7B]" />
              Theme:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme(THEMES.GOLD_PINK_WHITE)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition ${
                  theme === THEMES.GOLD_PINK_WHITE
                    ? "btn-ig text-white shadow-xs"
                    : "glass-card border text-gray-400"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Gold-Pink</span>
              </button>
              <button
                onClick={() => setTheme(THEMES.DARK)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition ${
                  theme === THEMES.DARK
                    ? "btn-ig text-white shadow-xs"
                    : "glass-card border text-gray-400"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Language selector buttons */}
          <div className="flex items-center justify-between py-2 border-b border-gray-500/20">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#DD2A7B]" />
              Language:
            </span>
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                    language === l.code
                      ? "btn-ig text-white shadow-xs"
                      : "glass-card border text-gray-400"
                  }`}
                >
                  {l.sub}
                </button>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <a
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DD2A7B] transition py-1"
            >
              {t.services}
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DD2A7B] transition py-1"
            >
              {t.howItWorks}
            </a>
            <a
              href="/#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DD2A7B] transition py-1"
            >
              {t.whyUs}
            </a>
            <a
              href="/#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DD2A7B] transition py-1"
            >
              {t.calculator}
            </a>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DD2A7B] transition flex items-center gap-1.5 py-1"
            >
              <Search className="w-4 h-4 text-[#DD2A7B]" />
              <span>{t.trackBooking}</span>
            </Link>
          </div>

          {/* User Auth or Profile in Mobile */}
          <div className="pt-3 border-t border-gray-500/20 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2.5 rounded-xl glass-card border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-xs font-black">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#DD2A7B] bg-pink-500/15 border border-pink-500/30 rounded-lg hover:bg-pink-500/25 transition cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={user?.role === "admin" ? "/admin" : user?.role === "partner" ? "/partner" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 btn-ig text-white text-center rounded-xl font-bold text-xs shadow-md"
                  >
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2.5 glass-card border text-red-500 rounded-xl font-bold text-xs cursor-pointer hover:bg-red-500/15 transition"
                  >
                    {t.logout}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  className="py-2.5 glass-card border rounded-xl font-bold text-xs hover:border-[#DD2A7B] transition text-center cursor-pointer"
                >
                  {t.login || "Sign In"}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("register");
                  }}
                  className="py-2.5 btn-ig text-white rounded-xl font-bold text-xs shadow-md text-center cursor-pointer"
                >
                  {t.register || "Register"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
