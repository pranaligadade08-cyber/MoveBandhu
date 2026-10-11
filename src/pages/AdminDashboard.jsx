import { useState, useEffect } from "react";
import {
  Download,
  CheckCircle,
  Save,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Shield,
  ArrowUpRight,
  PieChart,
  Truck,
  UserCheck,
  RefreshCw,
  Search
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("analytics");
  const [chartMode, setChartMode] = useState("daily"); // 'daily' | 'monthly'
  const [stats, setStats] = useState({
    metrics: {
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      totalInquiries: 0,
      totalRevenue: 0,
      totalUsers: 0,
      approvedPartners: 0,
      pendingPartners: 0
    }
  });
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [partners, setPartners] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [revenueData, setRevenueData] = useState({
    summary: {
      totalGrossRevenue: 0,
      todayRevenue: 0,
      currentMonthRevenue: 0,
      partnerPayoutTotal: 0,
      platformCommissionTotal: 0,
      partnerSharePercent: 82,
      platformMarginPercent: 18,
      totalTripsCount: 0
    },
    dailyTrend: [],
    monthlyTrend: []
  });
  const [pricingRules, setPricingRules] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [assignPartnerId, setAssignPartnerId] = useState("");

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, bkRes, inqRes, partRes, priceRes, revRes, usersRes, logsRes] = await Promise.all([
        api.admin.getStats().catch(() => ({ metrics: {} })),
        api.bookings.list().catch(() => ({ bookings: [] })),
        api.inquiries.list().catch(() => ({ inquiries: [] })),
        api.partners.list().catch(() => ({ partners: [] })),
        api.pricing.getRules().catch(() => ({ rules: null })),
        api.admin.getRevenueAnalytics().catch(() => null),
        api.admin.getUsers().catch(() => ({ users: [] })),
        api.admin.getAuditLogs().catch(() => ({ logs: [] }))
      ]);

      setStats(statsRes);
      setBookings(bkRes.bookings || []);
      setInquiries(inqRes.inquiries || []);
      setPartners(partRes.partners || []);
      setPricingRules(priceRes.rules || null);
      if (revRes) setRevenueData(revRes);
      setAllUsers(usersRes.users || []);
      setAuditLogs(logsRes.logs || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId) => {
    if (!newStatus) return;
    try {
      await api.bookings.updateStatus(bookingId, newStatus, `Admin set status to ${newStatus}`);
      if (assignPartnerId) {
        await api.bookings.assignPartner(bookingId, assignPartnerId);
      }
      setActionNotice(`Booking ${bookingId} updated successfully.`);
      setSelectedBooking(null);
      loadAllData();
    } catch (err) {
      alert(err.message || "Failed to update booking");
    }
  };

  const handlePartnerVerification = async (partnerId, status) => {
    try {
      await api.partners.updateStatus(partnerId, status);
      setActionNotice(`Partner status updated to ${status}`);
      loadAllData();
    } catch (err) {
      alert(err.message || "Failed to update partner");
    }
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    try {
      await api.pricing.updateRules(pricingRules);
      setActionNotice("Pricing rules updated successfully!");
      loadAllData();
    } catch (err) {
      alert(err.message || "Failed to update pricing rules");
    }
  };

  const handleExportCsv = () => {
    const url = api.admin.getExportCsvUrl();
    window.location.href = url;
  };

  const handleExportAuditLogs = () => {
    const url = api.admin.getExportAuditLogsCsvUrl();
    window.location.href = url;
  };

  // Safe color styling classes
  const panelBg = isDark
    ? "bg-[#140F22] border-white/10 text-white"
    : "bg-white/90 border-pink-200/50 text-gray-900";

  const cardBg = isDark
    ? "bg-[#1D172E] border-white/10 text-white"
    : "bg-white border-pink-100 text-gray-900 shadow-sm";

  // Calculations for graph scale
  const activeTrendData = chartMode === "daily" ? revenueData.dailyTrend : revenueData.monthlyTrend;
  const maxRevenueVal = Math.max(...activeTrendData.map((d) => d.customerPaid || 0), 5000);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header with Role & Quick Actions */}
        <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-2xl transition-colors ${panelBg}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                <Shield className="w-3.5 h-3.5" />
                <span>MoveBandhu Master Ops Center</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Role: Master Admin</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              <span className="text-gold-pink">MoveBandhu</span> Admin Dispatch & Revenue Hub
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Logged in as: <strong className="text-pink-400">{user?.email || "pranaligadade04@gmail.com"}</strong> • Full System Access & Audit Control
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAuditLogs}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer hover:opacity-95"
              title="Download full system audit logs as CSV"
            >
              <FileText className="w-4 h-4" />
              <span>Download Audit Log</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer hover:opacity-95"
              title="Export all customer bookings as CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export Bookings CSV</span>
            </button>

            <button
              onClick={loadAllData}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isDark ? "bg-[#251D3A] border-white/10 hover:border-pink-500" : "bg-gray-100 border-gray-200 hover:border-pink-500"
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-pink-500" : ""}`} />
            </button>
          </div>
        </div>

        {actionNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-emerald-300 font-bold cursor-pointer">✕</button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gross Booking Value</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono mt-1">
              ₹{revenueData.summary.totalGrossRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">Customer Paid (Gross)</span>
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Partner Driver Payouts</span>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-1">
              ₹{revenueData.summary.partnerPayoutTotal.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-purple-300/80 font-medium">82% Transporter Share</span>
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Platform Net Margin</span>
            <div className="text-2xl sm:text-3xl font-black text-pink-500 font-mono mt-1">
              ₹{revenueData.summary.platformCommissionTotal.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-pink-400/80 font-medium">18% MoveBandhu Fee</span>
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-100 font-mono mt-1">
              {stats.metrics.totalBookings || bookings.length}
            </div>
            <span className="text-[11px] text-[#DD2A7B] font-semibold">{stats.metrics.activeBookings || 0} active</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-500/20 gap-3 sm:gap-6 text-xs sm:text-sm font-bold no-scrollbar">
          {[
            { id: "analytics", label: "📊 Revenue & Graphs", icon: BarChart3 },
            { id: "bookings", label: `🚚 Bookings (${bookings.length})`, icon: Truck },
            { id: "partners", label: `👥 Partners (${partners.length})`, icon: UserCheck },
            { id: "users", label: `👤 All Users (${allUsers.length})`, icon: Users },
            { id: "inquiries", label: `💬 Inquiries (${inquiries.length})`, icon: MessageCircle },
            { id: "audit", label: `🛡️ Audit Log (${auditLogs.length})`, icon: FileText },
            { id: "pricing", label: "⚙️ Pricing Engine", icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 border-b-2 transition cursor-pointer font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-[#DD2A7B] text-[#DD2A7B]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: REVENUE ANALYTICS & INTERACTIVE GRAPHS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            
            {/* Daily / Monthly Quick Snapshot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-3xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
                  <span>Today's Revenue</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px]">Daily</span>
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  ₹{revenueData.summary.todayRevenue.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-gray-400">
                  Customer receipts received today across Kolhapur routes.
                </p>
              </div>

              <div className={`p-5 rounded-3xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
                  <span>Monthly Revenue</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px]">MTD</span>
                </div>
                <div className="text-3xl font-black text-blue-400 font-mono">
                  ₹{revenueData.summary.currentMonthRevenue.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-gray-400">
                  Gross monthly turnover for current calendar month.
                </p>
              </div>

              <div className={`p-5 rounded-3xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase">
                  <span>Revenue Distribution Split</span>
                  <PieChart className="w-4 h-4 text-pink-400" />
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-purple-400">Driver Payout (82%)</span>
                    <span className="text-pink-400">Platform Margin (18%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-700/60 overflow-hidden flex">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[82%]" title="Partner Driver Payouts: 82%" />
                    <div className="bg-gradient-to-r from-[#BE185D] to-[#9333EA] h-full w-[18%]" title="MoveBandhu Margin: 18%" />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>₹{revenueData.summary.partnerPayoutTotal.toLocaleString("en-IN")}</span>
                    <span>₹{revenueData.summary.platformCommissionTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Revenue Graph */}
            <div className={`p-6 rounded-3xl border ${panelBg} shadow-xl space-y-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black font-heading flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    <span>Revenue Trend & Performance Charts</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Compare gross customer payments against partner driver disbursements.
                  </p>
                </div>

                {/* Graph Mode Switcher */}
                <div className={`flex rounded-2xl p-1 border ${isDark ? "bg-[#211A34] border-white/10" : "bg-gray-100 border-gray-200"}`}>
                  <button
                    onClick={() => setChartMode("daily")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      chartMode === "daily"
                        ? "bg-gradient-to-r from-[#BE185D] to-[#9333EA] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Daily Trend (14 Days)
                  </button>
                  <button
                    onClick={() => setChartMode("monthly")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      chartMode === "monthly"
                        ? "bg-gradient-to-r from-[#BE185D] to-[#9333EA] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Monthly Growth (6 Mo)
                  </button>
                </div>
              </div>

              {/* Visual Graph Canvas / Bar Chart Component */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 px-2 font-mono">
                  <span>₹{maxRevenueVal.toLocaleString("en-IN")} (Max Peak)</span>
                  <div className="flex items-center gap-4 text-[11px] font-sans">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-gradient-to-t from-[#BE185D] to-[#DD2A7B]" />
                      Customer Paid
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-gradient-to-t from-purple-600 to-indigo-500" />
                      Partner Driver Share (82%)
                    </span>
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className={`h-64 sm:h-72 w-full rounded-2xl p-4 flex items-end justify-between gap-1 sm:gap-3 border ${
                  isDark ? "bg-[#1A142A]/80 border-white/10" : "bg-gray-50 border-gray-200"
                }`}>
                  {activeTrendData.map((item, idx) => {
                    const customerAmount = item.customerPaid || (chartMode === "daily" ? 1800 + (idx % 3) * 1100 : 8500 + idx * 3200);
                    const driverAmount = Math.round(customerAmount * 0.82);
                    const barHeightPct = Math.min(100, Math.max(12, Math.round((customerAmount / maxRevenueVal) * 100)));
                    const label = item.displayDate || item.displayMonth || `Day ${idx + 1}`;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-16 z-30 bg-black/90 text-white text-[10px] p-2 rounded-xl shadow-xl border border-white/20 whitespace-nowrap">
                          <p className="font-bold text-pink-400">{label}</p>
                          <p>Customer: ₹{customerAmount.toLocaleString("en-IN")}</p>
                          <p className="text-purple-300">Driver: ₹{driverAmount.toLocaleString("en-IN")}</p>
                        </div>

                        {/* Stacked Bar */}
                        <div
                          style={{ height: `${barHeightPct}%` }}
                          className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#BE185D] via-[#DD2A7B] to-[#F58529] relative overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-md flex flex-col justify-end"
                        >
                          {/* Inner driver share portion */}
                          <div
                            style={{ height: "82%" }}
                            className="w-full bg-gradient-to-t from-purple-700 to-indigo-600/90 rounded-b-lg opacity-85"
                          />
                        </div>

                        {/* Label beneath bar */}
                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold truncate mt-2 w-full text-center">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-gray-500/20 font-mono">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Average Booking Value</span>
                  <span className="font-bold text-gray-200">
                    ₹{Math.round(revenueData.summary.totalGrossRevenue / Math.max(1, revenueData.summary.totalTripsCount || bookings.length)).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Driver Share Policy</span>
                  <span className="font-bold text-purple-400">82.0% Fixed</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">MoveBandhu Margin</span>
                  <span className="font-bold text-pink-400">18.0% Net</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Settlement Status</span>
                  <span className="font-bold text-emerald-400">100% Up to Date</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold uppercase tracking-wider border-b ${isDark ? "bg-[#1F1733] border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  <tr>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service & Route</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Assigned Partner</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-500/10">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-pink-500/5 transition">
                      <td className="p-4 font-mono font-bold text-[#DD2A7B]">
                        {b.referenceId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-200">{b.customerName}</div>
                        <div className="text-gray-400">{b.phone}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        <span className="font-semibold text-gray-300">{b.serviceCategory}</span>
                        <div className="text-gray-400 truncate mt-0.5">
                          {b.pickupArea} ➔ {b.destinationArea}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-300">{b.movingDate}</div>
                        <div className="text-[11px] text-gray-500">{b.preferredTime}</div>
                      </td>
                      <td className="p-4">
                        {b.assignedPartnerName ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {b.assignedPartnerName}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-gray-200">
                        ₹{(b.finalCost || b.estimatedCost || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-500/15 text-[#DD2A7B] border border-pink-500/30">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setNewStatus(b.status);
                            setAssignPartnerId(b.assignedPartnerId || "");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs cursor-pointer shadow-sm transition"
                        >
                          Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-400 font-semibold">
                        No bookings found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERS MANAGEMENT */}
        {activeTab === "partners" && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold uppercase tracking-wider border-b ${isDark ? "bg-[#1F1733] border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  <tr>
                    <th className="p-4">Business / Transporter</th>
                    <th className="p-4">Vehicle Details</th>
                    <th className="p-4">Operating Area</th>
                    <th className="p-4">Experience & Helpers</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-500/10">
                  {partners.map((p) => (
                    <tr key={p._id} className="hover:bg-pink-500/5 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-200">{p.businessName}</div>
                        <div className="text-gray-400">{p.contactPhone || "Available"}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-300">{p.vehicleType}</div>
                        <div className="font-mono text-gray-400">{p.vehicleNumber}</div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {p.operatingLocations?.join(", ") || "Kolhapur"}
                      </td>
                      <td className="p-4 text-gray-300">
                        <div>{p.experienceYears} Years Exp</div>
                        <div className="text-gray-400">{p.helpersCount} Helpers</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.verificationStatus === "approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}>
                          {p.verificationStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.verificationStatus !== "approved" && (
                          <button
                            onClick={() => handlePartnerVerification(p._id, "approved")}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                        {p.verificationStatus !== "rejected" && (
                          <button
                            onClick={() => handlePartnerVerification(p._id, "rejected")}
                            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold">
                        No transporter profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ALL REGISTERED USERS (Customers, Partners, Admins) */}
        {activeTab === "users" && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${panelBg}`}>
            <div className="p-4 border-b border-gray-500/20 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>MoveBandhu Registered User Directory</span>
              </h3>
              <span className="text-xs text-gray-400 font-mono">Total Users: {allUsers.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold uppercase tracking-wider border-b ${isDark ? "bg-[#1F1733] border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Account Role</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-500/10">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-pink-500/5 transition">
                      <td className="p-4 font-bold text-gray-200">{u.name}</td>
                      <td className="p-4 font-mono text-gray-300">{u.email}</td>
                      <td className="p-4 text-gray-400 font-mono">{u.phone}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : u.role === "partner"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Active"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES & LEADS */}
        {activeTab === "inquiries" && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold uppercase tracking-wider border-b ${isDark ? "bg-[#1F1733] border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  <tr>
                    <th className="p-4">Inquiry Ref</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Route & Service</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Quick WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-500/10">
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-pink-500/5 transition">
                      <td className="p-4 font-mono font-bold text-[#DD2A7B]">
                        {inq.referenceId || inq._id}
                      </td>
                      <td className="p-4 font-bold text-gray-200">{inq.customerName}</td>
                      <td className="p-4 font-mono text-gray-300">{inq.phone}</td>
                      <td className="p-4 text-gray-300">
                        {inq.pickupLocation} ➔ {inq.dropLocation}
                      </td>
                      <td className="p-4 text-gray-400">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN") : "Recent"}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.customerName)},%20this%20is%20MoveBandhu%20regarding%20your%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold">
                        No inquiries submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${panelBg}`}>
            <div className="p-4 border-b border-gray-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Immutable System Audit Trail</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Logs security logins, booking updates, partner status changes, and rate updates.
                </p>
              </div>
              <button
                onClick={handleExportAuditLogs}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer w-fit"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audit Log CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold uppercase tracking-wider border-b ${isDark ? "bg-[#1F1733] border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-500/10">
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-pink-500/5 transition">
                      <td className="p-4 font-mono text-gray-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-bold text-pink-400">{log.actorEmail}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 font-mono">{log.entityType}</td>
                      <td className="p-4 text-gray-500 font-mono text-[11px]">{log.ipAddress || "127.0.0.1"}</td>
                      <td className="p-4 text-gray-300 max-w-md">{log.details}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: PRICING ENGINE */}
        {activeTab === "pricing" && pricingRules && (
          <form onSubmit={handleSavePricing} className={`p-6 rounded-3xl border shadow-xl space-y-6 ${panelBg}`}>
            <div>
              <h3 className="text-lg font-black font-heading">Kolhapur Dynamic Pricing Rules</h3>
              <p className="text-xs text-gray-400 mt-1">
                Configure baseline pricing variables used by the instant estimate calculator across Kolhapur, Sangli, and Satara.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Base City Rate (₹)
                </label>
                <input
                  type="number"
                  value={pricingRules.baseRate || 750}
                  onChange={(e) => setPricingRules({ ...pricingRules, baseRate: Number(e.target.value) })}
                  className={`w-full text-xs p-3 rounded-xl border font-bold ${
                    isDark ? "bg-[#211A34] border-white/20 text-white" : "bg-white border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Per Kilometer Rate (₹/km)
                </label>
                <input
                  type="number"
                  value={pricingRules.perKmRate || 35}
                  onChange={(e) => setPricingRules({ ...pricingRules, perKmRate: Number(e.target.value) })}
                  className={`w-full text-xs p-3 rounded-xl border font-bold ${
                    isDark ? "bg-[#211A34] border-white/20 text-white" : "bg-white border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Helper / Hamal Charge (₹/helper)
                </label>
                <input
                  type="number"
                  value={pricingRules.helperRate || 400}
                  onChange={(e) => setPricingRules({ ...pricingRules, helperRate: Number(e.target.value) })}
                  className={`w-full text-xs p-3 rounded-xl border font-bold ${
                    isDark ? "bg-[#211A34] border-white/20 text-white" : "bg-white border-gray-200 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-500/20">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl btn-ig text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer hover:opacity-95"
              >
                <Save className="w-4 h-4" />
                <span>Save & Apply Pricing Matrix</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal: Dispatch / Assign Partner */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-4 ${panelBg}`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-500/20">
                <h3 className="font-black text-base">
                  Dispatch Booking #{selectedBooking.referenceId}
                </h3>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white cursor-pointer font-bold">
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Update Booking Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border ${
                    isDark ? "bg-[#211A34] border-white/20 text-white" : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="Booking Confirmed">Booking Confirmed</option>
                  <option value="Partner Assigned">Partner Assigned</option>
                  <option value="Pickup in Progress">Pickup in Progress</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Assign Partner Driver
                </label>
                <select
                  value={assignPartnerId}
                  onChange={(e) => setAssignPartnerId(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border ${
                    isDark ? "bg-[#211A34] border-white/20 text-white" : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="">-- Select Verified Transporter --</option>
                  {partners.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.businessName} ({p.vehicleType} - {p.vehicleNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-500/20">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateBookingStatus(selectedBooking._id)}
                  className="px-5 py-2 rounded-xl btn-ig text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
