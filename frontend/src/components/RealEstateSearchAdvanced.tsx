import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaBuilding, FaSquare } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdApartment, MdVilla } from "react-icons/md";
import DualRangeSlider from "./DualRangeSlider";
import { AMENITIES_LIST, AVAILABLE_FOR_OPTIONS } from "../assets/assets";

// ─── Constants ────────────────────────────────────────────────────────────────

// const TABS = ["Buy", "Rent", "Commercial Buy", "Commercial Rent", "Plots/Land", "Projects", "New Launch"];
const TABS = ["Buy", "Rent", "Commercial Buy", "Commercial Rent", "Plots/Land"];

const CITIES = [
  "All Cities","Mumbai","Delhi","Bangalore","Hyderabad","Chennai",
  "Pune","Kolkata","Ahmedabad","Nagpur","Noida","Gurugram",
  "Navi Mumbai","Thane","Jaipur","Lucknow","Surat",
];

const POPULAR_CITIES = ["Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Nagpur","Noida"];

// Property types per category
const PROPERTY_TYPES_MAP: Record<string, { label: string; icon: React.ElementType; value: string }[]> = {
  Buy: [
    // { label: "Studio/1RK",   icon: FaHome,       value: "1 RK/ Studio Apartment" },
    { label: "Apartment",     icon: MdApartment, value: "Residential Apartment" },
    { label: "Villa",         icon: MdVilla,      value: "Independent House/Villa" },
    { label: "Builder Floor", icon: FaBuilding,  value: "Builder Floor" },
    { label: "1 RK / Studio Apartment", icon: FaBuilding,  value: "1 RK / Studio Apartment" },
    // { label: "Plot/Land",     icon: FaSquare,    value: "Residential Land" },
  ],
  Rent: [
    // { label: "Studio/1RK",   icon: FaHome,       value: "1 RK/ Studio Apartment" },
    { label: "Apartment",     icon: MdApartment, value: "Residential Apartment" },
    { label: "Villa",         icon: MdVilla,      value: "Independent House/Villa" },
    { label: "Builder Floor", icon: FaBuilding,  value: "Builder Floor" },
    { label: "PG",            icon: FaBuilding,  value: "PG" },
    // { label: "Hostel",        icon: FaBuilding,  value: "Hostel" },
    { label: "Co-living",     icon: FaBuilding,  value: "Co-living" },
  ],
  "Commercial Buy": [
    { label: "Office Space",    icon: FaBuilding, value: "Office Space" },
    { label: "Shop/Showroom",   icon: FaBuilding, value: "Shop/Showroom" },
    { label: "Warehouse",       icon: FaBuilding, value: "Warehouse/Godown" },
    { label: "Industrial",      icon: FaBuilding, value: "Industrial Building" },
    { label: "Commercial Land", icon: FaSquare,   value: "Commercial Land" },
  ],
  "Commercial Rent": [
    { label: "Office Space",    icon: FaBuilding, value: "Office Space" },
    { label: "Shop/Showroom",   icon: FaBuilding, value: "Shop/Showroom" },
    { label: "Warehouse",       icon: FaBuilding, value: "Warehouse/Godown" },
    { label: "Industrial",      icon: FaBuilding, value: "Industrial Building" },
    { label: "Commercial Land", icon: FaSquare,   value: "Commercial Land" },
  ],
  "Plots/Land": [
    { label: "Residential Plot", icon: FaSquare, value: "Residential Land" },
    { label: "Commercial Plot",  icon: FaSquare, value: "Commercial Land" },
    { label: "Agricultural",     icon: FaSquare, value: "Agricultural Land" },
    { label: "Industrial Plot",  icon: FaSquare, value: "Industrial Land" },
  ],
  // Projects: [
  //   { label: "Apartment",     icon: MdApartment, value: "Residential Apartment" },
  //   { label: "Villa",         icon: MdVilla,      value: "Independent House/Villa" },
  //   { label: "Plotted Dev.",  icon: FaSquare,    value: "Plotted Development" },
  //   { label: "Commercial",   icon: FaBuilding,   value: "Commercial" },
  // ],
  // "New Launch": [
  //   { label: "Apartment",     icon: MdApartment, value: "Residential Apartment" },
  //   { label: "Villa",         icon: MdVilla,      value: "Independent House/Villa" },
  //   { label: "Plotted Dev.",  icon: FaSquare,    value: "Plotted Development" },
  //   { label: "Commercial",   icon: FaBuilding,   value: "Commercial" },
  // ],
};

const BHK_OPTIONS = [
  { label: "Single Room", value: 1 },
  { label: "1 RK",        value: 2 },
  { label: "1 BHK",       value: 3 },
  { label: "2 BHK",       value: 4 },
  { label: "3 BHK",       value: 5 },
  { label: "4+ BHK",      value: 6 },
];

const AVAILABILITIES   = ["Ready to Move","Within 6 Months","Within 1 Year","More Than 1 Year"];
const FURNISHING_OPTS  = ["Furnished","Semi-Furnished","Unfurnished"];
const POSTED_BY_OPTS   = ["Owner","Agent","Builder","Company","Dealer"];
const BATHROOM_OPTS    = [1, 2, 3, 4];
const POSSESSION_YEARS = ["2024","2025","2026","2027","2028","2029+"];

// ─── Filter visibility config per category ───────────────────────────────────

interface FilterVisibility {
  propertyType:   boolean;
  bhk:            boolean;
  budget:         boolean;
  area:           boolean;
  possession:     boolean;
  furnishing:     boolean;
  availableFor:   boolean;
  postedBy:       boolean;
  builder:        boolean;
  amenities:      boolean;
  bathrooms:      boolean;
  possessionYear: boolean;
}

const FILTER_VISIBILITY: Record<string, FilterVisibility> = {
  Buy: {
    propertyType:   true,
    bhk:            true,
    budget:         true,
    area:           true,
    possession:     true,
    furnishing:     true,
    availableFor:   false,
    postedBy:       true,
    builder:        false,
    amenities:      true,
    bathrooms:      true,
    possessionYear: false,
  },
  Rent: {
    propertyType:   true,
    bhk:            true,
    budget:         true,
    area:           true,
    possession:     false,
    furnishing:     true,
    availableFor:   true,
    postedBy:       true,
    builder:        false,
    amenities:      true,
    bathrooms:      true,
    possessionYear: false,
  },
  "Commercial Buy": {
    propertyType:   true,
    bhk:            false,
    budget:         true,
    area:           true,
    possession:     true,
    furnishing:     true,
    availableFor:   false,
    postedBy:       true,
    builder:        false,
    amenities:      false,
    bathrooms:      false,
    possessionYear: false,
  },
  "Commercial Rent": {
    propertyType:   true,
    bhk:            false,
    budget:         true,
    area:           true,
    possession:     false,
    furnishing:     true,
    availableFor:   false,
    postedBy:       true,
    builder:        false,
    amenities:      false,
    bathrooms:      false,
    possessionYear: false,
  },
  "Plots/Land": {
    propertyType:   true,
    bhk:            false,
    budget:         true,
    area:           true,
    possession:     false,
    furnishing:     false,
    availableFor:   false,
    postedBy:       true,
    builder:        false,
    amenities:      false,
    bathrooms:      false,
    possessionYear: false,
  },
  Projects: {
    propertyType:   true,
    bhk:            true,
    budget:         true,
    area:           true,
    possession:     true,
    furnishing:     false,
    availableFor:   false,
    postedBy:       false,
    builder:        true,
    amenities:      true,
    bathrooms:      false,
    possessionYear: true,
  },
  "New Launch": {
    propertyType:   true,
    bhk:            true,
    budget:         true,
    area:           true,
    possession:     true,
    furnishing:     false,
    availableFor:   false,
    postedBy:       false,
    builder:        true,
    amenities:      true,
    bathrooms:      false,
    possessionYear: true,
  },
};

// ─── Budget steps per category ────────────────────────────────────────────────
//
// Buy / Commercial Buy:
//   0 (no min) → 5L, 10L, 15L … 2Cr → 0 sentinel (2 Cr+)
//
// Rent:
//   0 (no min) → 3k, 5k, 7k … 1L → 0 sentinel (1 L+)
//
// Commercial Rent:
//   0 (no min) → 5k, 10k, 15k … 1L → 0 sentinel (1 L+)
//
// Plots/Land:
//   0 (no min) → 1L, 5L, 10L … 10Cr → 0 sentinel (10 Cr+)
//
// Projects / New Launch  →  kept commented / not finalized

// Buy: under 5L … 2Cr, step 5L  (0 = no min; last real value = 20000000; sentinel = 0 for 2Cr+)
const BUDGET_STEPS_BUY: number[] = (() => {
  const steps = [0]; // no min
  for (let v = 500000; v <= 20000000; v += 500000) steps.push(v);
  steps.push(0); // sentinel → "2 Cr+"
  return steps;
})();

// Rent: under 3k … 1L, starts at 3k then 5k, 7k, 9k … 1L (step 2k)
const BUDGET_STEPS_RENT: number[] = (() => {
  const steps = [0, 3000]; // no min, then 3k
  for (let v = 5000; v <= 100000; v += 2000) steps.push(v);
  steps.push(0); // sentinel → "1 L+"
  return steps;
})();

// Commercial Buy: same shape as Buy
const BUDGET_STEPS_COMMERCIAL_BUY: number[] = BUDGET_STEPS_BUY;

// Commercial Rent: under 5k … 1L, step 5k
const BUDGET_STEPS_COMMERCIAL_RENT: number[] = (() => {
  const steps = [0]; // no min
  for (let v = 5000; v <= 100000; v += 5000) steps.push(v);
  steps.push(0); // sentinel → "1 L+"
  return steps;
})();

// Plots/Land: under 1L, then 1L … 10Cr, step 5L for first band then larger
const BUDGET_STEPS_PLOTS: number[] = (() => {
  const steps = [0, 100000]; // no min, then 1L
  for (let v = 500000; v <= 100000000; v += 500000) steps.push(v);
  steps.push(0); // sentinel → "10 Cr+"
  return steps;
})();

// Map tab → steps array
const BUDGET_STEPS_MAP: Record<string, number[]> = {
  "Buy":              BUDGET_STEPS_BUY,
  "Rent":             BUDGET_STEPS_RENT,
  "Commercial Buy":   BUDGET_STEPS_COMMERCIAL_BUY,
  "Commercial Rent":  BUDGET_STEPS_COMMERCIAL_RENT,
  "Plots/Land":       BUDGET_STEPS_PLOTS,
  // "Projects":      ...,   // TBD
  // "New Launch":    ...,   // TBD
};

// Sentinel cap labels per tab (shown when maxIdx === last index)
const BUDGET_MAX_LABEL: Record<string, string> = {
  "Buy":             "2 Cr+",
  "Rent":            "1 L+",
  "Commercial Buy":  "2 Cr+",
  "Commercial Rent": "1 L+",
  "Plots/Land":      "10 Cr+",
  "Projects":        "No max",
  "New Launch":      "No max",
};

// Export the active steps (consumers like DualRangeSlider need it)
export function getBudgetSteps(tab: string): number[] {
  return BUDGET_STEPS_MAP[tab] ?? BUDGET_STEPS_BUY;
}

export function formatBudget(val: number, isMax = false, tab = "Buy"): string {
  // val === 0 at index 0 → "No min"; val === 0 at last index → cap label
  if (val === 0) {
    if (isMax) return BUDGET_MAX_LABEL[tab] ?? "No max";
    return "No min";
  }
  if (val >= 10000000) return `${(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 1)} Cr`;
  if (val >= 100000)   return `${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} L`;
  if (val >= 1000)     return `₹${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
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
  const navigate = useNavigate();

  // tabs & basic search
  const [activeTab, setActiveTab] = useState("Buy");
  const [cityLocal, setCityLocal] = useState("");
  const [query,     setQuery]     = useState("");
  const [showMore,  setShowMore]  = useState(false);

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
  const [selectedAmenities,    setSelectedAmenities]    = useState<string[]>([]);
  const [selectedPossYears,    setSelectedPossYears]    = useState<string[]>([]);
  const [builderQuery,         setBuilderQuery]         = useState("");

  // budget slider — indices into the ACTIVE steps array for the current tab
  const [budgetMinIdx, setBudgetMinIdx] = useState(0);
  const [budgetMaxIdx, setBudgetMaxIdx] = useState(() => getBudgetSteps("Buy").length - 1);

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

  // ── Reset when tab changes ──────────────────────────────────────────────────
  useEffect(() => {
    setSelectedTypes([]);
    setSelectedBHK([]);
    setSelectedAvailability([]);
    setSelectedFurnishing([]);
    setSelectedPostedBy([]);
    setSelectedBathrooms([]);
    setSelectedAvailFor([]);
    setSelectedAmenities([]);
    setSelectedPossYears([]);
    setBuilderQuery("");
    setShowMore(false);
    setOpenDD(null);
    // Reset budget indices to full range for the new tab's steps
    setBudgetMinIdx(0);
    setBudgetMaxIdx(getBudgetSteps(activeTab).length - 1);
    // Keep city & area as-is
  }, [activeTab]);

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const vis = FILTER_VISIBILITY[activeTab] ?? FILTER_VISIBILITY["Buy"];
  const currentPropertyTypes = PROPERTY_TYPES_MAP[activeTab] ?? PROPERTY_TYPES_MAP["Buy"];

  // Active budget steps for the current tab
  const activeBudgetSteps = getBudgetSteps(activeTab);
  const budgetActive = budgetMinIdx > 0 || budgetMaxIdx < activeBudgetSteps.length - 1;
  const areaActive   = areaMinIdx  > 0 || areaMaxIdx  < AREA_STEPS_SQFT.length - 1;

  const budgetMinVal = activeBudgetSteps[budgetMinIdx];
  const budgetMaxVal = activeBudgetSteps[budgetMaxIdx];

  const budgetLabel = budgetActive
    ? `${formatBudget(budgetMinVal, false, activeTab)} – ${formatBudget(budgetMaxVal, true, activeTab)}`
    : (activeTab === "Rent" || activeTab === "Commercial Rent") ? "Rent range" : "Budget";

  const areaLabel = areaActive
    ? `${formatArea(AREA_STEPS_SQFT[areaMinIdx], areaUnit)} – ${formatArea(AREA_STEPS_SQFT[areaMaxIdx], areaUnit, true)}`
    : "Area";

  // ── Budget quick presets per tab ────────────────────────────────────────────
  const budgetPresets: { label: string; min: number; max: number }[] = (() => {
    const steps = activeBudgetSteps;
    const lastIdx = steps.length - 1;

    const findIdx = (target: number) => {
      const idx = steps.indexOf(target);
      return idx === -1 ? lastIdx : idx;
    };

    switch (activeTab) {
      case "Buy":
      case "Commercial Buy":
        return [
          { label: "Under 50 L",  min: 0,                    max: findIdx(5000000)  },
          { label: "50 L – 1 Cr", min: findIdx(5000000),     max: findIdx(10000000) },
          { label: "1 – 2 Cr",    min: findIdx(10000000),    max: lastIdx           },
          { label: "2 Cr+",       min: findIdx(20000000),    max: lastIdx           },
        ];
      case "Rent":
        return [
          { label: "Under 10K",  min: 0,               max: findIdx(10000) },
          { label: "10K – 25K",  min: findIdx(10000),  max: findIdx(25000) },
          { label: "25K – 50K",  min: findIdx(25000),  max: findIdx(50000) },
          { label: "50K+",       min: findIdx(50000),  max: lastIdx        },
        ];
      case "Commercial Rent":
        return [
          { label: "Under 25K",  min: 0,               max: findIdx(25000) },
          { label: "25K – 50K",  min: findIdx(25000),  max: findIdx(50000) },
          { label: "50K – 1 L",  min: findIdx(50000),  max: findIdx(100000)},
          { label: "1 L+",       min: findIdx(100000), max: lastIdx        },
        ];
      case "Plots/Land":
        return [
          { label: "Under 50 L",   min: 0,                  max: findIdx(5000000)   },
          { label: "50 L – 1 Cr",  min: findIdx(5000000),   max: findIdx(10000000)  },
          { label: "1 – 5 Cr",     min: findIdx(10000000),  max: findIdx(50000000)  },
          { label: "5 Cr+",        min: findIdx(50000000),  max: lastIdx            },
        ];
      default:
        return [
          { label: "Under 50 L", min: 0, max: Math.floor(lastIdx * 0.25) },
          { label: "50 L – 1 Cr",min: Math.floor(lastIdx * 0.25), max: Math.floor(lastIdx * 0.5) },
          { label: "1–2 Cr",     min: Math.floor(lastIdx * 0.5),  max: Math.floor(lastIdx * 0.75)},
          { label: "2 Cr+",      min: Math.floor(lastIdx * 0.75), max: lastIdx },
        ];
    }
  })();

  function handleSearch() {
      const params = new URLSearchParams();

      if (activeTab)        params.set("category",  activeTab);
      if (cityLocal)        params.set("city",       cityLocal);
      if (query.trim())     params.set("search",     query.trim());

      // Budget — only send if not at defaults
      if (budgetMinIdx > 0)
        params.set("minBudget", String(activeBudgetSteps[budgetMinIdx]));
      if (budgetMaxIdx < activeBudgetSteps.length - 1)
        params.set("maxBudget", String(activeBudgetSteps[budgetMaxIdx]));

      // Area — only send if not at defaults
      if (areaMinIdx > 0)
        params.set("minArea", String(AREA_STEPS_SQFT[areaMinIdx]));
      if (areaMaxIdx < AREA_STEPS_SQFT.length - 1)
        params.set("maxArea", String(AREA_STEPS_SQFT[areaMaxIdx]));

      if (selectedTypes.length)        params.set("propertyTypes", selectedTypes.join(","));
      if (selectedBHK.length)          params.set("bedrooms",      selectedBHK.join(","));
      if (selectedAvailability.length) params.set("availability",  selectedAvailability.join(","));
      if (selectedFurnishing.length)   params.set("furnishing",    selectedFurnishing.join(","));
      if (selectedPostedBy.length)     params.set("postedBy",      selectedPostedBy.join(","));
      if (selectedBathrooms.length)    params.set("bathrooms",     selectedBathrooms.join(","));
      if (selectedAvailFor.length)     params.set("availableFor",  selectedAvailFor.join(","));
      if (selectedAmenities.length)    params.set("amenities",     selectedAmenities.join(","));

      // Navigate to SearchPage with all filters in the URL
      // SearchPage's mount useEffect will hydrate Redux + fetch from these params
      navigate(`/property-search?${params.toString()}`);
      window.scrollTo(0, 0);
    }

    function goToCity(c: string) {
      const params = new URLSearchParams();
      params.set("city", c);
      navigate(`/property-search?${params.toString()}`);
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
                <div className="absolute z-50 top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl">
                  <div className="border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-2 pb-1">
                      All cities
                    </p>
                    <div className="max-h-62 overflow-y-auto">
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
                placeholder={
                  activeTab === "Projects" || activeTab === "New Launch"
                    ? "Project name, builder or locality"
                    : "Locality, project or builder"
                }
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
            {vis.propertyType && (
              <div ref={typeRef} className="relative">
                <Pill
                  label="Property type"
                  active={openDD === "type" || selectedTypes.length > 0}
                  count={selectedTypes.length || undefined}
                  onClick={() => setOpenDD(openDD === "type" ? null : "type")}
                />
                {openDD === "type" && (
                  <div className="absolute z-50 top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl py-2 md:max-h-46 overflow-auto">
                    {/* {currentPropertyTypes.map(({ label, value }) => ( */}
                    {currentPropertyTypes.map(({ value }) => (
                      <CheckRow
                        key={value}
                        label={value}
                        checked={selectedTypes.includes(value)}
                        onChange={() => setSelectedTypes(prev => toggle(prev, value))}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BHK chips */}
            {vis.bhk && BHK_OPTIONS.map(opt => (
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
            {vis.budget && (
              <div ref={budgetRef} className="relative">
                <Pill
                  label={budgetLabel}
                  active={openDD === "budget" || budgetActive}
                  onClick={() => setOpenDD(openDD === "budget" ? null : "budget")}
                />
                {openDD === "budget" && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                      {(activeTab === "Rent" || activeTab === "Commercial Rent")
                        ? "Monthly rent range"
                        : "Price range"}
                    </p>
                    <DualRangeSlider
                      steps={activeBudgetSteps}
                      minIdx={budgetMinIdx}
                      maxIdx={budgetMaxIdx}
                      onMinChange={setBudgetMinIdx}
                      onMaxChange={setBudgetMaxIdx}
                      formatLabel={(v, isMax) => formatBudget(v, isMax, activeTab)}
                    />
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {budgetPresets.map(p => (
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
                        onClick={() => {
                          setBudgetMinIdx(0);
                          setBudgetMaxIdx(activeBudgetSteps.length - 1);
                        }}
                        className="mt-3 text-xs text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Area */}
            {vis.area && (
              <div ref={areaRef} className="relative">
                <Pill
                  label={areaLabel}
                  active={openDD === "area" || areaActive}
                  onClick={() => setOpenDD(openDD === "area" ? null : "area")}
                />
                {openDD === "area" && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5">
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
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {[
                        { label: "< 1000 sq.ft", min: 0,  max: 4  },
                        { label: "1000–2000",     min: 4,  max: 7  },
                        { label: "2000–5000",     min: 7,  max: 11 },
                        { label: "5000+",         min: 11, max: AREA_STEPS_SQFT.length - 1 },
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
            )}

            {/* More filters toggle */}
            {(vis.possession || vis.furnishing || vis.availableFor || vis.postedBy ||
              vis.builder || vis.amenities || vis.bathrooms || vis.possessionYear) && (
              <button
                onClick={() => setShowMore(v => !v)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ml-auto
                  ${showMore
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
              >
                {showMore ? "− Less" : "+ More filters"}
              </button>
            )}
          </div>

          {/* ── More Filters Panel ── */}
          {showMore && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

              {vis.possession && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Possession status
                  </p>
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
              )}

              {vis.possessionYear && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Possession year
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POSSESSION_YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => setSelectedPossYears(prev => toggle(prev, y))}
                        className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-150
                          ${selectedPossYears.includes(y)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-600 hover:border-blue-400 bg-white"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {vis.builder && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Builder / Developer
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <FaSearch className="text-gray-400 flex-shrink-0 text-xs" />
                    <input
                      type="text"
                      value={builderQuery}
                      onChange={e => setBuilderQuery(e.target.value)}
                      placeholder="Search builder name..."
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                    {builderQuery && (
                      <button onClick={() => setBuilderQuery("")} className="text-gray-400 hover:text-gray-600">
                        <IoClose className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {vis.furnishing && (
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
              )}

              {vis.availableFor && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Available for
                  </p>
                  <div className="space-y-0.5">
                    {AVAILABLE_FOR_OPTIONS.map(a => (
                      <CheckRow
                        key={a} label={a}
                        checked={selectedAvailFor.includes(a)}
                        onChange={() => setSelectedAvailFor(prev => toggle(prev, a))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {vis.postedBy && (
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
              )}

              {vis.bathrooms && (
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
              )}

              {vis.amenities && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map(a => (
                      <button
                        key={a}
                        onClick={() => setSelectedAmenities(prev => toggle(prev, a))}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150
                          ${selectedAmenities.includes(a)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-600 hover:border-blue-400 bg-white"}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {vis.propertyType && (activeTab === "Buy" || activeTab === "Rent") && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Property type
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPropertyTypes.slice(0, 4).map(({ label, icon: Icon, value }) => (
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
              )}

            </div>
          )}
        </div>
      </div>

      {/* ── Popular cities ── */}
      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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