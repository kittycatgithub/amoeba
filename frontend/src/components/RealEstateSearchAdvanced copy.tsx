import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaBuilding, FaHome, FaSquare } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdApartment, MdVilla } from "react-icons/md";
import { useAppDispatch } from "../store/hooks";
import {
  setCategory, setSearchQuery, setCity,
  setMinBudget, setMaxBudget,
  toggleBedroom, togglePropertyType,
  toggleAvailability, setMinArea, setMaxArea,
  resetFilters,
} from "../store/slices/filterSlice";
import DualRangeSlider from "./DualRangeSlider";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ["Buy", "Rent", "Commercial", "Plots/Land", "Projects", "New Launch"];

const CITIES = [
  "All Cities","Mumbai","Delhi","Bangalore","Hyderabad","Chennai",
  "Pune","Kolkata","Ahmedabad","Nagpur","Noida","Gurugram",
  "Navi Mumbai","Thane","Jaipur","Lucknow","Surat",
];

const POPULAR_CITIES = ["Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Nagpur","Noida"];

const PROPERTY_TYPES = [
  { label: "Apartment",    icon: MdApartment,  value: "Residential Apartment" },
  { label: "Villa",        icon: MdVilla,       value: "Independent House/Villa" },
  { label: "Builder Floor",icon: FaBuilding,   value: "Builder Floor" },
  { label: "Plot/Land",   icon: FaSquare,      value: "Residential Land" },
  { label: "Studio/1RK",  icon: FaHome,        value: "1 RK/ Studio Apartment" },
  { label: "Commercial",  icon: FaBuilding,    value: "Commercial" },
];

const BHK_OPTIONS = [
  { label: "Single Room", value: 0 },
  { label: "1 RK", value: 1 },
  { label: "1 BHK", value: 2 },
  { label: "2 BHK", value: 3 },
  { label: "3 BHK", value: 4 },
  { label: "4+ BHK", value: 5 },
];

const AVAILABILITIES  = ["Ready to Move","Within 6 Months","Within 1 Year","More Than 1 Year"];
const FURNISHING_OPTS = ["Furnished","Semi-Furnished","Unfurnished"];
const POSTED_BY_OPTS  = ["Owner","Agent","Builder","Company","Dealer"];
const AVAILABLE_FOR   = ["Family","Bachelor","Company"];
const BATHROOM_OPTS   = [1, 2, 3, 4];

// ─── Budget ───────────────────────────────────────────────────────────────────

export const BUDGET_STEPS = [
  0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000,
  5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000, 100000000,
];

export function formatBudget(val: number, isMax = false): string {
  if (val === 0) return isMax ? "No max" : "No min";
  if (val >= 10000000) return `${(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 1)} Cr`;
  if (val >= 100000)   return `${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} L`;
  return val.toLocaleString("en-IN");
}

// ─── Area ─────────────────────────────────────────────────────────────────────

type AreaUnit = "sqft" | "sqm" | "acre" | "bigha" | "gaj";

const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  sqft:  "Sq.Ft",
  sqm:   "Sq.M",
  acre:  "Acre",
  bigha: "Bigha",
  gaj:   "Gaj",
};

// Steps are stored in Sq.Ft; conversion applied for display only
const AREA_STEPS_SQFT = [
  0, 300, 500, 750, 1000, 1200, 1500, 2000, 2500, 3000,
  4000, 5000, 7500, 10000, 15000, 20000, 50000,
];

const AREA_CONVERSION: Record<AreaUnit, number> = {
  sqft:  1,
  sqm:   0.0929,
  acre:  0.0000229568,
  bigha: 0.000826446,
  gaj:   0.111111,
};

function toAreaUnit(sqft: number, unit: AreaUnit): number {
  return sqft * AREA_CONVERSION[unit];
}

function formatArea(sqft: number, unit: AreaUnit, isMax = false): string {
  if (sqft === 0) return isMax ? "No max" : "No min";
  const val = toAreaUnit(sqft, unit);
  if (val < 0.01) return `${val.toFixed(4)} ${AREA_UNIT_LABELS[unit]}`;
  if (val < 1)    return `${val.toFixed(2)} ${AREA_UNIT_LABELS[unit]}`;
  if (val < 100)  return `${parseFloat(val.toFixed(1))} ${AREA_UNIT_LABELS[unit]}`;
  return `${Math.round(val).toLocaleString("en-IN")} ${AREA_UNIT_LABELS[unit]}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useOutsideClick(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  count?: number;
  className?: string;
}

function Pill({ label, active, onClick, count, className = "" }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all duration-150 select-none whitespace-nowrap
        ${active
          ? "bg-primary text-white border-primary"
          : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-primary bg-white"
        } ${className}`}
    >
      {label}{count ? ` (${count})` : ""}
      <FaChevronDown className={`text-[10px] transition-transform duration-200 ${active ? "rotate-180" : ""}`} />
    </button>
  );
}

interface CheckRowProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CheckRow({ label, checked, onChange }: CheckRowProps) {
  return (
    <label className="flex items-center gap-2.5 py-2 px-3 hover:bg-blue-50 rounded-lg cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-blue-600 w-3.5 h-3.5 flex-shrink-0 cursor-pointer"
      />
      <span className={`text-sm ${checked ? "text-blue-600 font-medium" : "text-gray-700"}`}>{label}</span>
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RealEstateSearchAdvanced() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();

  // tabs & basic search
  const [activeTab,   setActiveTab]   = useState("Buy");
  const [cityLocal,   setCityLocal]   = useState("");
  const [query,       setQuery]       = useState("");
  const [showMore,    setShowMore]    = useState(false);

  // dropdown open states
  const [openDD, setOpenDD] = useState<"city"|"type"|"budget"|"area"|null>(null);

  // filter selections
  const [selectedTypes,        setSelectedTypes]        = useState<string[]>([]);
  const [selectedBHK,          setSelectedBHK]          = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedFurnishing,   setSelectedFurnishing]   = useState<string[]>([]);
  const [selectedPostedBy,     setSelectedPostedBy]     = useState<string[]>([]);
  const [selectedBathrooms,    setSelectedBathrooms]    = useState<number[]>([]);
  const [selectedAvailFor,     setSelectedAvailFor]     = useState<string[]>([]);

  // budget slider
  const [budgetMinIdx, setBudgetMinIdx] = useState(0);
  const [budgetMaxIdx, setBudgetMaxIdx] = useState(BUDGET_STEPS.length - 1);

  // area slider + unit
  const [areaMinIdx, setAreaMinIdx] = useState(0);
  const [areaMaxIdx, setAreaMaxIdx] = useState(AREA_STEPS_SQFT.length - 1);
  const [areaUnit,   setAreaUnit]   = useState<AreaUnit>("sqft");

  // refs for outside-click
  const cityRef   = useRef<HTMLDivElement>(null!);
  const typeRef   = useRef<HTMLDivElement>(null!);
  const budgetRef = useRef<HTMLDivElement>(null!);
  const areaRef   = useRef<HTMLDivElement>(null!);

  useOutsideClick(cityRef,   () => { if (openDD === "city")   setOpenDD(null); });
  useOutsideClick(typeRef,   () => { if (openDD === "type")   setOpenDD(null); });
  useOutsideClick(budgetRef, () => { if (openDD === "budget") setOpenDD(null); });
  useOutsideClick(areaRef,   () => { if (openDD === "area")   setOpenDD(null); });

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const budgetActive = budgetMinIdx > 0 || budgetMaxIdx < BUDGET_STEPS.length - 1;
  const areaActive   = areaMinIdx  > 0 || areaMaxIdx  < AREA_STEPS_SQFT.length - 1;

  const budgetLabel = budgetActive
    ? `${formatBudget(BUDGET_STEPS[budgetMinIdx])} – ${formatBudget(BUDGET_STEPS[budgetMaxIdx], true)}`
    : "Budget";

  const areaLabel = areaActive
    ? `${formatArea(AREA_STEPS_SQFT[areaMinIdx], areaUnit)} – ${formatArea(AREA_STEPS_SQFT[areaMaxIdx], areaUnit, true)}`
    : "Area";

  function handleSearch() {
    dispatch(resetFilters());
    dispatch(setCategory(activeTab));
    if (cityLocal) dispatch(setCity(cityLocal));
    if (query.trim()) dispatch(setSearchQuery(query.trim()));
    dispatch(setMinBudget(BUDGET_STEPS[budgetMinIdx]));
    dispatch(setMaxBudget(budgetMaxIdx === BUDGET_STEPS.length - 1 ? 0 : BUDGET_STEPS[budgetMaxIdx]));
    dispatch(setMinArea(AREA_STEPS_SQFT[areaMinIdx]));
    dispatch(setMaxArea(areaMaxIdx === AREA_STEPS_SQFT.length - 1 ? 0 : AREA_STEPS_SQFT[areaMaxIdx]));
    selectedTypes.forEach(t => dispatch(togglePropertyType(t)));
    selectedBHK.forEach(b => dispatch(toggleBedroom(b)));
    selectedAvailability.forEach(a => dispatch(toggleAvailability(a)));
    navigate("/property-search");
  }

  function goToCity(c: string) {
    dispatch(resetFilters());
    dispatch(setCity(c));
    navigate("/property-search");
  }

  return (
    <section
      className="relative min-h-[600px] lg:min-h-[680px] flex flex-col items-center justify-center overflow-hidden px-4 py-16"
      style={{ background: "linear-gradient(135deg, #060e20 0%, #0d2549 50%, #060e20 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
           style={{ background: "rgba(29,111,229,0.18)", filter: "blur(60px)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"
           style={{ background: "rgba(99,102,241,0.12)", filter: "blur(72px)" }} />

      {/* Hero headline */}
      <div className="relative z-10 text-center mb-8">
        <p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-3">
          India's Trusted Property Portal
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-3">
          Find Your Dream Home<br className="hidden sm:block" /> Across India
        </h1>
      </div>

      {/* ── Search Card ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-visible">

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-2 pt-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-3.5 md:py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2
                ${activeTab === tab
                  ? "text-white border-primary bg-primary rounded-t-lg"
                  : "text-gray-500 border-transparent hover:text-gray-700 rounded-t-lg"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Row 1: City | Search | Button ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">

            {/* City dropdown */}
            <div ref={cityRef} className="relative sm:w-44 flex-shrink-0">
              <button
                onClick={() => setOpenDD(openDD === "city" ? null : "city")}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-primary transition bg-white"
              >
                <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                <span className={`flex-1 text-left truncate ${cityLocal ? "text-gray-800" : "text-gray-400"}`}>
                  {cityLocal || "Select city"}
                </span>
                <FaChevronDown className={`text-gray-400 text-xs flex-shrink-0 transition-transform duration-200
                  ${openDD === "city" ? "rotate-180" : ""}`} />
              </button>

              {openDD === "city" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
                    Popular cities
                  </p>
                  <div className="flex flex-wrap gap-2 px-4 pb-3">
                    {POPULAR_CITIES.map(c => (
                      <button
                        key={c}
                        onClick={() => { setCityLocal(c); setOpenDD(null); }}
                        className={`px-3 py-1 rounded-full border text-xs transition
                          ${cityLocal === c
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-2 pb-1">
                      All cities
                    </p>
                    <div className="max-h-40 overflow-y-auto">
                      {CITIES.map(c => (
                        <button
                          key={c}
                          onClick={() => { setCityLocal(c === "All Cities" ? "" : c); setOpenDD(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition
                            ${cityLocal === c ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search input */}
            <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-400 transition">
              <FaSearch className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Locality, project or builder"
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                  <IoClose />
                </button>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-semibold transition-colors sm:min-w-[130px]"
            >
              <FaSearch />
              <span>Search</span>
            </button>
          </div>

          {/* ── Row 2: Quick filters ── */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">

            {/* Property type */}
            <div ref={typeRef} className="relative">
              <Pill
                label="Property type"
                active={openDD === "type" || selectedTypes.length > 0}
                count={selectedTypes.length || undefined}
                onClick={() => setOpenDD(openDD === "type" ? null : "type")}
              />
              {openDD === "type" && (
                <div className="absolute z-50 top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                  {/* {PROPERTY_TYPES.map(({ label, icon: Icon, value }) => ( */}
                  {PROPERTY_TYPES.map(({ label, value }) => (
                    <CheckRow
                      key={value}
                      label={label}
                      checked={selectedTypes.includes(value)}
                      onChange={() => setSelectedTypes(prev => toggle(prev, value))}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* BHK chips */}
            {BHK_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setSelectedBHK(prev => toggle(prev, opt.value))}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150
                  ${selectedBHK.includes(opt.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-600 hover:border-blue-400 bg-white"}`}
              >
                {opt.label}
              </button>
            ))}

            {/* Budget */}
            <div ref={budgetRef} className="relative">
              <Pill
                label={budgetLabel}
                active={openDD === "budget" || budgetActive}
                onClick={() => setOpenDD(openDD === "budget" ? null : "budget")}
              />
              {openDD === "budget" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Price range
                  </p>
                  <DualRangeSlider
                    steps={BUDGET_STEPS}
                    minIdx={budgetMinIdx}
                    maxIdx={budgetMaxIdx}
                    onMinChange={setBudgetMinIdx}
                    onMaxChange={setBudgetMaxIdx}
                    formatLabel={(v, isMax) => formatBudget(v, isMax)}
                  />
                  {/* Quick presets */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {[
                      { label: "Under 50 L", min: 0, max: 9 },
                      { label: "50 L – 1 Cr", min: 9, max: 10 },
                      { label: "1–2 Cr", min: 10, max: 12 },
                      { label: "2 Cr+", min: 12, max: BUDGET_STEPS.length - 1 },
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => { setBudgetMinIdx(p.min); setBudgetMaxIdx(p.max); }}
                        className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {budgetActive && (
                    <button
                      onClick={() => { setBudgetMinIdx(0); setBudgetMaxIdx(BUDGET_STEPS.length - 1); }}
                      className="mt-3 text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Area */}
            <div ref={areaRef} className="relative">
              <Pill
                label={areaLabel}
                active={openDD === "area" || areaActive}
                onClick={() => setOpenDD(openDD === "area" ? null : "area")}
              />
              {openDD === "area" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5">
                  {/* Unit selector */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Area range</p>
                    <div className="flex gap-1">
                      {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map(u => (
                        <button
                          key={u}
                          onClick={() => setAreaUnit(u)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150
                            ${areaUnit === u
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                        >
                          {AREA_UNIT_LABELS[u]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <DualRangeSlider
                    steps={AREA_STEPS_SQFT}
                    minIdx={areaMinIdx}
                    maxIdx={areaMaxIdx}
                    onMinChange={setAreaMinIdx}
                    onMaxChange={setAreaMaxIdx}
                    formatLabel={(sqft, isMax) => formatArea(sqft, areaUnit, isMax)}
                  />

                  {/* Quick presets */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {[
                      { label: "< 1000 sq.ft",  min: 0, max: 4  },
                      { label: "1000–2000",       min: 4, max: 7  },
                      { label: "2000–5000",       min: 7, max: 11 },
                      { label: "5000+",           min: 11, max: AREA_STEPS_SQFT.length - 1 },
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => { setAreaMinIdx(p.min); setAreaMaxIdx(p.max); }}
                        className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {areaActive && (
                    <button
                      onClick={() => { setAreaMinIdx(0); setAreaMaxIdx(AREA_STEPS_SQFT.length - 1); }}
                      className="mt-3 text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* More filters toggle */}
            <button
              onClick={() => setShowMore(v => !v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ml-auto
                ${showMore
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
            >
              {showMore ? "− Less" : "+ More filters"}
            </button>
          </div>

          {/* ── More Filters Panel ── */}
          {showMore && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

              {/* Possession status */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Possession status</p>
                <div className="space-y-0.5">
                  {AVAILABILITIES.map(a => (
                    <CheckRow
                      key={a} label={a}
                      checked={selectedAvailability.includes(a)}
                      onChange={() => setSelectedAvailability(prev => toggle(prev, a))}
                    />
                  ))}
                </div>
              </div>

              {/* Furnishing */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Furnishing</p>
                <div className="space-y-0.5">
                  {FURNISHING_OPTS.map(f => (
                    <CheckRow
                      key={f} label={f}
                      checked={selectedFurnishing.includes(f)}
                      onChange={() => setSelectedFurnishing(prev => toggle(prev, f))}
                    />
                  ))}
                </div>
              </div>

              {/* Posted by */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Posted by</p>
                <div className="space-y-0.5">
                  {POSTED_BY_OPTS.map(p => (
                    <CheckRow
                      key={p} label={p}
                      checked={selectedPostedBy.includes(p)}
                      onChange={() => setSelectedPostedBy(prev => toggle(prev, p))}
                    />
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Bathrooms</p>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTS.map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBathrooms(prev => toggle(prev, b))}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-150
                        ${selectedBathrooms.includes(b)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-600 hover:border-blue-400 bg-white"}`}
                    >
                      {b === 4 ? "4+" : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available for */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Available for</p>
                <div className="space-y-0.5">
                  {AVAILABLE_FOR.map(a => (
                    <CheckRow
                      key={a} label={a}
                      checked={selectedAvailFor.includes(a)}
                      onChange={() => setSelectedAvailFor(prev => toggle(prev, a))}
                    />
                  ))}
                </div>
              </div>

              {/* Property type icons */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Property type</p>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.slice(0, 4).map(({ label, icon: Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedTypes(prev => toggle(prev, value))}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-xs transition-all duration-150
                        ${selectedTypes.includes(value)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 text-gray-600 hover:border-blue-400 bg-white"}`}
                    >
                      <Icon className="text-base" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Popular cities ── */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="text-blue-300/70 text-sm">Popular cities:</span>
        {POPULAR_CITIES.map(c => (
          <button
            key={c}
            onClick={() => goToCity(c)}
            className="text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1 rounded-full transition"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
