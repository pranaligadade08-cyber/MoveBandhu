import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { TrackBookingPage } from "./pages/TrackBookingPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { InquiryModal } from "./components/InquiryModal";
import { BookingSuccessModal } from "./components/BookingSuccessModal";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { LandingIntro } from "./components/LandingIntro";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0B12] text-xs font-bold text-gray-400">
        Authenticating session...
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function MainApp() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("mb_intro_skipped"));
  const [pendingInquiryData, setPendingInquiryData] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryInitialData, setInquiryInitialData] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authRole, setAuthRole] = useState("customer");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleSkipIntro = () => {
    sessionStorage.setItem("mb_intro_skipped", "true");
    setShowIntro(false);
  };

  const handleRegisterFromIntro = () => {
    sessionStorage.setItem("mb_intro_skipped", "true");
    setShowIntro(false);
    handleOpenAuth("register", "customer");
  };

  const handleOpenIntro = () => {
    setShowIntro(true);
  };

  const handleOpenInquiry = (initialData) => {
    if (!isAuthenticated) {
      setPendingInquiryData(initialData || {});
      handleOpenAuth("register", "customer");
      return;
    }
    setInquiryInitialData(initialData || null);
    setInquiryModalOpen(true);
  };

  const handleOpenAuth = (mode = "login", role = "customer") => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (pendingInquiryData) {
      const data = pendingInquiryData;
      setPendingInquiryData(null);
      setInquiryInitialData(data);
      setInquiryModalOpen(true);
    }
  };

  const handleInquirySuccess = (result) => {
    setInquiryModalOpen(false);
    setSuccessData(result);
    setSuccessModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden ${
        isDark
          ? "bg-[#0E0B12] text-[#F3F4F6] selection:bg-pink-500/30 selection:text-pink-300"
          : "bg-[#FFFFFF] text-gray-900 selection:bg-pink-500/20 selection:text-pink-700"
      }`}
    >
      {/* Ambient background light orbs for Glassmorphism refraction across the entire website */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F58529]/25 via-[#DD2A7B]/20 to-transparent blur-[150px]" />
            <div className="absolute top-[30%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#DD2A7B]/25 via-[#C13584]/20 to-[#8134AF]/20 blur-[170px]" />
            <div className="absolute -bottom-40 left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#8134AF]/25 via-[#DD2A7B]/15 to-[#F58529]/20 blur-[160px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F58529]/15 via-[#DD2A7B]/12 to-transparent blur-[140px]" />
            <div className="absolute top-[25%] -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#DD2A7B]/12 via-[#F58529]/10 to-[#8134AF]/10 blur-[150px]" />
            <div className="absolute -bottom-40 left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8134AF]/12 via-[#DD2A7B]/10 to-[#F58529]/12 blur-[150px]" />
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenInquiry={() => handleOpenInquiry()}
          onOpenAuth={(mode) => handleOpenAuth(mode || "login", "customer")}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenIntro={handleOpenIntro}
        />

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onOpenInquiry={handleOpenInquiry}
                  onOpenAuth={handleOpenAuth}
                />
              }
            />

            <Route path="/track" element={<TrackBookingPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/partner"
              element={
                <ProtectedRoute allowedRoles={["partner", "admin"]}>
                  <PartnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Global Modals */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        onSuccess={handleInquirySuccess}
        initialData={inquiryInitialData}
      />

      {successData && (
        <BookingSuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          referenceId={successData.referenceId}
          whatsappUrl={successData.whatsappUrl}
          directCallNumber={successData.directCallNumber}
          details={successData.details}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={authRole}
        onSuccess={handleAuthSuccess}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Full-screen Landing Intro Video (Plays landing.mp4 with skip intro at right top corner) */}
      {showIntro && (
        <LandingIntro
          onSkip={handleSkipIntro}
          onRegister={handleRegisterFromIntro}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
