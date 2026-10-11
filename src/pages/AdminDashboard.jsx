import { useState, useEffect } from "react";
import {
  Download,
  CheckCircle,
  Save,
  MessageCircle
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
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
  const [pricingRules, setPricingRules] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [assignPartnerId, setAssignPartnerId] = useState("");

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, bkRes, inqRes, partRes, priceRes] = await Promise.all([
        api.admin.getStats(),
        api.bookings.list(),
        api.inquiries.list(),
        api.partners.list(),
        api.pricing.getRules()
      ]);
      setStats(statsRes);
      setBookings(bkRes.bookings || []);
      setInquiries(inqRes.inquiries || []);
      setPartners(partRes.partners || []);
      setPricingRules(priceRes.rules || null);
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
    const token = localStorage.getItem("movebandhu_token") || localStorage.getItem("movemate_token");
    window.location.href = `/api/admin/export/bookings-csv?token=${token}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-xs">
              <span>MoveBandhu Ops Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-heading">
              <span className="text-gold-pink">Kolhapur • Sangli • Satara</span> Administration & Dispatch
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Bookings CSV</span>
            </button>
          </div>
        </div>

        {actionNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-emerald-900 font-bold cursor-pointer">✕</button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-white/60 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
            <div className="text-3xl font-black text-gray-900 font-mono">{stats.metrics.totalBookings}</div>
            <span className="text-[11px] text-[#DD2A7B] font-semibold">{stats.metrics.activeBookings} currently active</span>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/60 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Booking Value</span>
            <div className="text-3xl font-black text-emerald-700 font-mono">₹{stats.metrics.totalRevenue.toLocaleString("en-IN")}</div>
            <span className="text-[11px] text-gray-500 font-medium">All non-cancelled trips</span>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/60 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Inquiries</span>
            <div className="text-3xl font-black text-blue-700 font-mono">{stats.metrics.totalInquiries}</div>
            <span className="text-[11px] text-gray-500 font-medium">WhatsApp & Web leads</span>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/60 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regional Transporters</span>
            <div className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] to-[#DD2A7B]">{stats.metrics.approvedPartners}</div>
            <span className="text-[11px] text-amber-700 font-semibold">{stats.metrics.pendingPartners} pending (MH 09/10/11)</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200/80 gap-6 text-sm font-bold">
          {[
            { id: "bookings", label: `Bookings (${bookings.length})` },
            { id: "inquiries", label: `Inquiries (${inquiries.length})` },
            { id: "partners", label: `Partners (${partners.length})` },
            { id: "pricing", label: "Pricing Engine" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition cursor-pointer font-bold ${
                activeTab === tab.id
                  ? "border-[#DD2A7B] text-[#DD2A7B]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === "bookings" && (
          <div className="glass-panel rounded-3xl border border-white/60 overflow-hidden shadow-xl backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/60 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/80 backdrop-blur-xs">
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
                <tbody className="divide-y divide-gray-100/80">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/60 transition">
                      <td className="p-4 font-mono font-bold text-[#DD2A7B]">
                        {b.referenceId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{b.customerName}</div>
                        <div className="text-gray-500">{b.phone}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        <span className="font-semibold text-gray-800">{b.serviceCategory}</span>
                        <div className="text-gray-500 truncate mt-0.5">
                          {b.pickupArea} ➔ {b.destinationArea}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{b.movingDate}</div>
                        <div className="text-gray-400">{b.preferredTime}</div>
                      </td>
                      <td className="p-4">
                        {b.assignedPartnerName ? (
                          <div className="font-bold text-emerald-800">{b.assignedPartnerName}</div>
                        ) : (
                          <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] to-[#DD2A7B]">
                        ₹{(b.finalCost || b.estimatedCost).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50">
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
                          className="px-3.5 py-1.5 rounded-xl btn-ig text-white font-bold shadow-xs transition cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries Management */}
        {activeTab === "inquiries" && (
          <div className="glass-panel rounded-3xl border border-white/60 overflow-hidden shadow-xl backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/60 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/80 backdrop-blur-xs">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Locations</th>
                    <th className="p-4">Date & Helpers</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-white/60 transition">
                      <td className="p-4 font-mono font-bold text-[#DD2A7B]">{inq.referenceId}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{inq.customerName}</div>
                        <div className="text-gray-500">{inq.phone}</div>
                      </td>
                      <td className="p-4 font-medium">{inq.serviceCategory}</td>
                      <td className="p-4 max-w-xs truncate text-gray-600">
                        {inq.pickupAddress} ➔ {inq.destinationAddress}
                      </td>
                      <td className="p-4">
                        <div>{inq.movingDate}</div>
                        <div className="text-gray-400">{inq.helpersCount} Helpers • {inq.propertyType}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-gray-100/80 text-gray-700">
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.customerName)}%2C%20regarding%20your%20MoveBandhu%20inquiry%20${inq.referenceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold inline-block hover:bg-emerald-700 transition"
                        >
                          Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Partners Management */}
        {activeTab === "partners" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((p) => (
              <div key={p._id} className="glass-card rounded-3xl p-6 border border-white/60 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{p.businessName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Driver: <strong className="text-gray-800">{p.driverName || "Verified Transporter"}</strong> • {p.phone}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${p.verificationStatus === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                    {p.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white/60 p-3.5 rounded-2xl border border-gray-100">
                  <div>Vehicle: <strong className="text-gray-800">{p.vehicleType}</strong></div>
                  <div>Plate: <strong className="text-gray-800">{p.vehicleNumber}</strong></div>
                  <div>Experience: <strong className="text-gray-800">{p.experienceYears} Yrs</strong></div>
                  <div>Helpers: <strong className="text-gray-800">{p.helpersCount}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500">
                    Status: {p.isAvailable ? "🟢 Online" : "⚪ Offline"}
                  </span>
                  <div className="flex gap-2">
                    {p.verificationStatus !== "approved" && (
                      <button
                        onClick={() => handlePartnerVerification(p._id, "approved")}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {p.verificationStatus !== "rejected" && (
                      <button
                        onClick={() => handlePartnerVerification(p._id, "rejected")}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Pricing Rules Engine */}
        {activeTab === "pricing" && pricingRules && (
          <form onSubmit={handleSavePricing} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/60 space-y-6 max-w-3xl shadow-xl backdrop-blur-2xl">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-heading">Configurable Kolhapur Pricing Rules</h3>
              <p className="text-xs text-gray-500">Admins can adjust the live benchmarks used by the Estimate Calculator.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Base Minimum Fare (₹)</label>
                <input
                  type="number"
                  value={pricingRules.baseRate}
                  onChange={(e) => setPricingRules({ ...pricingRules, baseRate: Number(e.target.value) })}
                  className="w-full p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Included Distance (KM)</label>
                <input
                  type="number"
                  value={pricingRules.baseCityDistanceKm}
                  onChange={(e) => setPricingRules({ ...pricingRules, baseCityDistanceKm: Number(e.target.value) })}
                  className="w-full p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Per-KM Extra Rate (₹/KM)</label>
                <input
                  type="number"
                  value={pricingRules.perKmRate}
                  onChange={(e) => setPricingRules({ ...pricingRules, perKmRate: Number(e.target.value) })}
                  className="w-full p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Rate per Helper / Hamal (₹)</label>
                <input
                  type="number"
                  value={pricingRules.helperRate}
                  onChange={(e) => setPricingRules({ ...pricingRules, helperRate: Number(e.target.value) })}
                  className="w-full p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Floor Surcharge (₹ per floor if no lift)</label>
                <input
                  type="number"
                  value={pricingRules.floorChargePerFloor}
                  onChange={(e) => setPricingRules({ ...pricingRules, floorChargePerFloor: Number(e.target.value) })}
                  className="w-full p-3 glass-input rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 btn-ig text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Pricing Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Manage Booking Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-modal rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in fade-in shadow-2xl border border-white/60">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black font-heading text-gray-900">
                    Manage Booking: <span className="text-[#DD2A7B] font-mono">{selectedBooking.referenceId}</span>
                  </h3>
                  <p className="text-xs text-gray-500">Customer: {selectedBooking.customerName}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-800 cursor-pointer">✕</button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 glass-input rounded-xl focus:outline-none"
                  >
                    {[
                      "Inquiry Received",
                      "Estimate Prepared",
                      "Awaiting Customer Confirmation",
                      "Booking Confirmed",
                      "Partner Assigned",
                      "Pickup in Progress",
                      "In Transit",
                      "Delivered",
                      "Completed",
                      "Cancelled"
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assign Partner Transporter</label>
                  <select
                    value={assignPartnerId}
                    onChange={(e) => setAssignPartnerId(e.target.value)}
                    className="w-full p-3 glass-input rounded-xl focus:outline-none"
                  >
                    <option value="">-- Select Kolhapur Partner --</option>
                    {partners.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.businessName} ({p.vehicleType} - {p.vehicleNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 border border-gray-200/80 bg-white/70 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateBookingStatus(selectedBooking._id)}
                  className="px-5 py-2 btn-ig text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 cursor-pointer"
                >
                  Save & Update
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
