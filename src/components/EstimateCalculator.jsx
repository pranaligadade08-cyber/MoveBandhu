import { useState, useEffect } from "react";
import {
  Calculator,
  Truck,
  Users,
  Package,
  Building,
  ArrowRight,
  Check,
  Info,
  MapPin
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { DISTRICT_AREAS, ALL_COVERED_AREAS } from "../translations";

export const EstimateCalculator = ({ onBookWithEstimate }) => {
  const { t } = useLanguage();
  const [pickupArea, setPickupArea] = useState(ALL_COVERED_AREAS[0]);
  const [dropArea, setDropArea] = useState(DISTRICT_AREAS[1].areas[0]);
  const [distanceKm, setDistanceKm] = useState(45);
  const [propertyType, setPropertyType] = useState("1_bhk");
  const [vehicleType, setVehicleType] = useState("tata_ace");
  const [helpersCount, setHelpersCount] = useState(2);
  const [packingType, setPackingType] = useState("standard");
  const [pickupFloor, setPickupFloor] = useState(2);
  const [hasPickupLift, setHasPickupLift] = useState(true);
  const [dropFloor, setDropFloor] = useState(1);
  const [hasDropLift, setHasDropLift] = useState(true);

  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState(2450);
  const [breakdown, setBreakdown] = useState({
    baseAndDistanceCost: 1450,
    helpersCost: 800,
    packingCost: 600,
    floorCharges: 0
  });

  const runCalculation = async () => {
    setIsCalculating(true);
    try {
      const res = await api.pricing.calculate({
        distanceKm,
        propertyType,
        vehicleType,
        helpersCount,
        packingType,
        pickupFloor,
        hasPickupLift,
        dropFloor,
        hasDropLift
      });
      setEstimatedTotal(res.estimatedTotal);
      setBreakdown(res.breakdown);
    } catch (err) {
      console.error("Calculation error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runCalculation();
    }, 250);
    return () => clearTimeout(timer);
  }, [
    distanceKm,
    propertyType,
    vehicleType,
    helpersCount,
    packingType,
    pickupFloor,
    hasPickupLift,
    dropFloor,
    hasDropLift
  ]);

  const handleBook = () => {
    onBookWithEstimate({
      pickupArea,
      destinationArea: dropArea,
      estimatedDistanceKm: distanceKm,
      propertyType,
      vehiclePreference: vehicleType,
      helpersCount,
      packingRequired: packingType,
      floorPickup: pickupFloor,
      hasLiftPickup: hasPickupLift,
      floorDrop: dropFloor,
      hasLiftDrop: hasDropLift,
      estimatedCost: estimatedTotal
    });
  };

  return (
    <section id="calculator" className="py-20 border-b border-pink-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 text-[#DD2A7B] border border-pink-200/50 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading">
            <span className="text-gold-pink">{t.calculatorTitle}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            {t.calculatorSubtitle}
          </p>
        </div>

        {/* Main Grid: Form Left, Sticky Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Controls (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-7 backdrop-blur-2xl">
            
            {/* Step 1: Kolhapur Route & Distance */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DD2A7B]" />
                <span>1. Route in Kolhapur, Sangli or Satara</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t.pickupLocation}
                  </label>
                  <select
                    value={pickupArea}
                    onChange={(e) => setPickupArea(e.target.value)}
                    className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-3 text-gray-800"
                  >
                    {DISTRICT_AREAS.map((group) => (
                      <optgroup key={group.district} label={`📍 ${group.district} (${group.rtoCode})`}>
                        {group.areas.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t.dropLocation}
                  </label>
                  <select
                    value={dropArea}
                    onChange={(e) => setDropArea(e.target.value)}
                    className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-3 text-gray-800"
                  >
                    {DISTRICT_AREAS.map((group) => (
                      <optgroup key={group.district} label={`🏁 ${group.district} (${group.rtoCode})`}>
                        {group.areas.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>{t.approxDistance}</span>
                  <span className="text-[#DD2A7B] font-bold text-sm bg-pink-50 border border-pink-200/50 px-2.5 py-0.5 rounded-full">{distanceKm} KM</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="160"
                  step="1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#DD2A7B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 font-mono">
                  <span>5 KM (Local Town)</span>
                  <span>45 KM (Kolhapur ⇄ Sangli)</span>
                  <span>120 KM (Kolhapur ⇄ Satara)</span>
                  <span>160 KM (Highway Triad)</span>
                </div>
              </div>
            </div>

            {/* Step 2: Property Size / Load Type */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#DD2A7B]" />
                <span>2. {t.propertyType}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "single_item", label: "Single Item", sub: "1-2 Large Items" },
                  { id: "1_rk", label: "1 RK", sub: "Bachelor / Minimal" },
                  { id: "1_bhk", label: "1 BHK", sub: "Small Family" },
                  { id: "2_bhk", label: "2 BHK", sub: "Standard Household" },
                  { id: "3_bhk", label: "3 BHK", sub: "Large Apartment" },
                  { id: "villa_office", label: "Villa / Office", sub: "Heavy Load" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPropertyType(opt.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      propertyType === opt.id
                        ? "border-[#DD2A7B] bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 text-gray-900 shadow-sm ring-1 ring-[#DD2A7B]"
                        : "border-gray-200/80 bg-white/70 text-gray-600 hover:border-pink-300"
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Vehicle Category */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#DD2A7B] mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#DD2A7B]" />
                <span>3. {t.vehicleType}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "three_wheeler", name: "Piaggio Ape / 3-Wheeler", desc: "Up to 500 KG • Compact luggage" },
                  { id: "tata_ace", name: "Tata Ace (Chhota Hathi)", desc: "Up to 850 KG • 1 BHK / Sofas / Beds" },
                  { id: "bolero_pickup", name: "Mahindra Bolero Maxi Truck", desc: "Up to 1.5 Ton • 2 BHK & Heavy Goods" },
                  { id: "eicher_14ft", name: "14ft Eicher Container", desc: "Up to 3.5 Ton • 3 BHK & Office Shifting" }
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between ${
                      vehicleType === v.id
                        ? "border-[#DD2A7B] bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 text-gray-900 ring-1 ring-[#DD2A7B] shadow-xs"
                        : "border-gray-200/80 bg-white/70 text-gray-600 hover:border-pink-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-900">{v.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{v.desc}</div>
                    </div>
                    {vehicleType === v.id && <Check className="w-4 h-4 text-[#DD2A7B] flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Helpers & Packing */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Helpers Count */}
              <div>
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                  <Users className="w-4 h-4 text-[#DD2A7B]" />
                  <span>{t.helpersRequired}</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setHelpersCount(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        helpersCount === num
                          ? "btn-ig shadow-md shadow-pink-500/25"
                          : "bg-white/70 border border-gray-200/80 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {num === 0 ? "None" : `${num}`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">₹400 per helper • Stairs climbing & loading</p>
              </div>

              {/* Packing Type */}
              <div>
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                  <Package className="w-4 h-4 text-[#DD2A7B]" />
                  <span>{t.packingRequired}</span>
                </label>
                <select
                  value={packingType}
                  onChange={(e) => setPackingType(e.target.value)}
                  className="w-full text-xs font-semibold glass-input rounded-xl px-3.5 py-2.5 text-gray-800"
                >
                  <option value="none">No Packing (Self Packed) - ₹0</option>
                  <option value="standard">Standard Bubble Wrap & Sheets - ₹600</option>
                  <option value="premium">Premium 3-Layer + Fragile Box Crates - ₹1,400</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">Industrial bubble roll, stretch wrap & tape</p>
              </div>

            </div>

            {/* Step 5: Floor & Lift Details */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                {t.floorDetails}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pickup Floor */}
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-800">{t.pickupFloor}</span>
                    <span className="text-xs font-bold text-[#DD2A7B]">Floor {pickupFloor}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={pickupFloor}
                    onChange={(e) => setPickupFloor(Number(e.target.value))}
                    className="w-full accent-[#DD2A7B] cursor-pointer"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 font-medium">
                      <input
                        type="checkbox"
                        checked={hasPickupLift}
                        onChange={(e) => setHasPickupLift(e.target.checked)}
                        className="rounded accent-[#DD2A7B]"
                      />
                      <span>{t.hasLift}</span>
                    </label>
                  </div>
                </div>

                {/* Drop Floor */}
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-800">{t.dropFloor}</span>
                    <span className="text-xs font-bold text-[#DD2A7B]">Floor {dropFloor}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={dropFloor}
                    onChange={(e) => setDropFloor(Number(e.target.value))}
                    className="w-full accent-[#DD2A7B] cursor-pointer"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 font-medium">
                      <input
                        type="checkbox"
                        checked={hasDropLift}
                        onChange={(e) => setHasDropLift(e.target.checked)}
                        className="rounded accent-[#DD2A7B]"
                      />
                      <span>{t.hasLift}</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Sticky Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="glass-modal rounded-3xl p-6 sm:p-7 border border-white/80 shadow-2xl backdrop-blur-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {t.indicativeEstimate}
                </span>
                <span className="bg-pink-100/80 text-[#DD2A7B] text-[11px] font-bold px-3 py-0.5 rounded-full border border-pink-200/50">
                  Kolhapur Standard
                </span>
              </div>

              {/* Big Price Display */}
              <div className="my-6 text-center">
                <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] to-[#DD2A7B] tracking-tight">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {isCalculating ? "Recalculating rates..." : "All-inclusive indicative estimate"}
                </p>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-2.5 py-4 border-y border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t.baseAndTransit} ({distanceKm} KM)</span>
                  <span className="font-semibold text-gray-900">₹{breakdown.baseAndDistanceCost}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.helpersFee} ({helpersCount} Hamals)</span>
                  <span className="font-semibold text-gray-900">₹{breakdown.helpersCost}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.packingFee}</span>
                  <span className="font-semibold text-gray-900">₹{breakdown.packingCost}</span>
                </div>
                {breakdown.floorCharges > 0 && (
                  <div className="flex justify-between text-pink-700 bg-pink-50 px-2 py-1 rounded-xl">
                    <span>{t.floorFee}</span>
                    <span className="font-semibold">₹{breakdown.floorCharges}</span>
                  </div>
                )}
              </div>

              {/* Summary Route Preview */}
              <div className="mt-4 bg-white/60 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-1">
                <div className="font-bold text-gray-900">📍 {pickupArea} ➔ {dropArea}</div>
                <div className="text-gray-500 text-[11px]">Vehicle: {vehicleType.replace("_", " ").toUpperCase()} • {helpersCount} Helpers</div>
              </div>

              {/* CTA Action */}
              <button
                type="button"
                onClick={handleBook}
                className="w-full mt-5 py-4 px-4 rounded-2xl btn-ig text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.bookWithThisEstimate}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Disclaimer */}
              <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-500 bg-white/50 p-3 rounded-xl border border-gray-100">
                <Info className="w-3.5 h-3.5 text-[#DD2A7B] flex-shrink-0 mt-0.5" />
                <p>{t.indicativeNotice}</p>
              </div>

            </div>

            {/* Direct Support Strip */}
            <div className="glass-card border border-pink-500/20 rounded-2xl p-4 flex items-center justify-between text-xs shadow-xs">
              <span className="font-semibold text-gray-800">Need a customized commercial or industrial quote?</span>
              <a
                href="https://wa.me/918855029692?text=Hi%20MoveBandhu%2C%20I%20need%20a%20custom%20commercial%20quote%20in%20Kolhapur"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#DD2A7B] hover:underline"
              >
                Chat on WhatsApp ➔
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
