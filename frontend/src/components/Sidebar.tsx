import { useState } from "react";
import { FaAngleDown, FaBuilding, FaSquare } from "react-icons/fa";
import { MdApartment, MdVilla } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setCity,
  setCategory,
  toggleBedroom,
  toggleAvailableFor,
  togglePostedBy,
  toggleFurnishing,
  toggleBathroom,
  toggleAmenity,
  toggleAvailability,
  togglePropertyType,
  setMinBudget,
  setMaxBudget,
  setMinArea,
  setMaxArea,
  setFilters,
  // resetFilters,
  // togglePropertyType,
  // toggleBedroom,
  // toggleAvailability,
  // setMinBudget,
  // setMaxBudget,
  // setMinArea,
  // setMaxArea,
} from "../store/slices/filterSlice";
import RangeSlider from "./RangeSlider";
import { AMENITIES_LIST, AVAILABLE_FOR_OPTIONS } from "../assets/assets";

// ─── Constants ─────────────────────────────────────────────────────────────────
//
// All category, property-type, budget, area, and filter-visibility data is
// kept in sync with RealEstateSearchAdvanced.tsx so both the hero search bar
// and this sidebar always behave identically.
// ──────────────────────────────────────────────────────────────────────────────

const INDIAN_CITIES = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Nagpur",
  "Noida",
  "Gurugram",
  "Navi Mumbai",
  "Thane",
  "Jaipur",
  "Lucknow",
  "Surat",
];

// Seven categories — matches TABS in RealEstateSearchAdvanced.tsx
// (Projects & New Launch kept available for future activation)
const CATEGORIES = [
  "Buy",
  "Rent",
  "Commercial Buy",
  "Commercial Rent",
  "Plots/Land",
  "Projects",
  "New Launch",
];

// ─── Property types per category ──────────────────────────────────────────────
//
// Mirrors PROPERTY_TYPES_MAP in RealEstateSearchAdvanced.tsx exactly.
// Each entry carries a display label, a React icon component, and the
// database-level value that gets dispatched to Redux / sent to the API.
// ──────────────────────────────────────────────────────────────────────────────

const PROPERTY_TYPES_MAP: Record<
  string,
  { label: string; icon: React.ElementType; value: string }[]
> = {
  Buy: [
    { label: "Apartment",     icon: MdApartment, value: "Residential Apartment"    },
    { label: "Villa",         icon: MdVilla,     value: "Independent House/Villa"  },
    { label: "Builder Floor", icon: FaBuilding,  value: "Builder Floor"            },
    { label: "1 RK / Studio Apartment", icon: FaBuilding,  value: "1 RK / Studio Apartment"            },
  ],
  Rent: [
    { label: "Apartment",     icon: MdApartment, value: "Residential Apartment"    },
    { label: "Villa",         icon: MdVilla,     value: "Independent House/Villa"  },
    { label: "Builder Floor", icon: FaBuilding,  value: "Builder Floor"            },
    { label: "PG",            icon: FaBuilding,  value: "PG"                       },
    { label: "Co-living",     icon: FaBuilding,  value: "Co-living"                },
  ],
  "Commercial Buy": [
    { label: "Office Space",    icon: FaBuilding, value: "Office Space"            },
    { label: "Shop/Showroom",   icon: FaBuilding, value: "Shop/Showroom"           },
    { label: "Warehouse",       icon: FaBuilding, value: "Warehouse/Godown"        },
    { label: "Industrial",      icon: FaBuilding, value: "Industrial Building"     },
    { label: "Commercial Land", icon: FaSquare,   value: "Commercial Land"         },
  ],
  "Commercial Rent": [
    { label: "Office Space",    icon: FaBuilding, value: "Office Space"            },
    { label: "Shop/Showroom",   icon: FaBuilding, value: "Shop/Showroom"           },
    { label: "Warehouse",       icon: FaBuilding, value: "Warehouse/Godown"        },
    { label: "Industrial",      icon: FaBuilding, value: "Industrial Building"     },
    { label: "Commercial Land", icon: FaSquare,   value: "Commercial Land"         },
  ],
  "Plots/Land": [
    { label: "Residential Plot", icon: FaSquare, value: "Residential Land"         },
    { label: "Commercial Plot",  icon: FaSquare, value: "Commercial Land"          },
    { label: "Agricultural",     icon: FaSquare, value: "Agricultural Land"        },
    { label: "Industrial Plot",  icon: FaSquare, value: "Industrial Land"          },
  ],
  Projects: [
    { label: "Apartment",    icon: MdApartment, value: "Residential Apartment"     },
    { label: "Villa",        icon: MdVilla,     value: "Independent House/Villa"   },
    { label: "Plotted Dev.", icon: FaSquare,    value: "Plotted Development"       },
    { label: "Commercial",   icon: FaBuilding,  value: "Commercial"                },
  ],
  "New Launch": [
    { label: "Apartment",    icon: MdApartment, value: "Residential Apartment"     },
    { label: "Villa",        icon: MdVilla,     value: "Independent House/Villa"   },
    { label: "Plotted Dev.", icon: FaSquare,    value: "Plotted Development"       },
    { label: "Commercial",   icon: FaBuilding,  value: "Commercial"                },
  ],
};

// ─── BHK options ───────────────────────────────────────────────────────────────
//
// Mirrors BHK_OPTIONS in RealEstateSearchAdvanced.tsx.
// Shown only for categories where vis.bhk === true.
// ──────────────────────────────────────────────────────────────────────────────

const BHK_OPTIONS = [
  { label: "Single Room", value: 1 },
  { label: "1 RK",        value: 2 },
  { label: "1 BHK",       value: 3 },
  { label: "2 BHK",       value: 4 },
  { label: "3 BHK",       value: 5 },
  { label: "4+ BHK",      value: 6 },
];

// ─── Possession / availability options ────────────────────────────────────────
//
// Mirrors AVAILABILITIES in RealEstateSearchAdvanced.tsx.
// Shown only for categories where vis.possession === true.
// ──────────────────────────────────────────────────────────────────────────────

const AVAILABILITIES = [
  "Ready to Move",
  "Within 6 Months",
  "Within 1 Year",
  "More Than 1 Year",
];

// ─── Other filter options ─────────────────────────────────────────────────────

const FURNISHING_OPTS  = ["Furnished", "Semi-Furnished", "Unfurnished"];
const POSTED_BY_OPTS   = ["Owner", "Agent", "Builder", "Company", "Dealer"];
const BATHROOM_OPTS    = [1, 2, 3, 4];

const POSSESSION_YEARS = ["2024", "2025", "2026", "2027", "2028", "2029+"];

// ─── Budget steps per category ─────────────────────────────────────────────────
//
// Mirrors the exact same step arrays from RealEstateSearchAdvanced.tsx so the
// sidebar and the hero bar always agree on what "₹50 L" or "1 Cr" means.
//
// Convention:
//   • steps[0] = 0  →  "No min"  (no lower bound)
//   • steps[last] = 0  →  sentinel for "2 Cr+" / "1 L+" / etc.
// ──────────────────────────────────────────────────────────────────────────────

const BUDGET_STEPS_BUY: number[] = (() => {
  const steps = [0]; // No min
  for (let v = 500_000; v <= 20_000_000; v += 500_000) steps.push(v);
  steps.push(0); // sentinel → "2 Cr+"
  return steps;
})();

const BUDGET_STEPS_RENT: number[] = (() => {
  const steps = [0, 3_000]; // No min, then ₹3 K
  for (let v = 5_000; v <= 100_000; v += 2_000) steps.push(v);
  steps.push(0); // sentinel → "1 L+"
  return steps;
})();

const BUDGET_STEPS_COMMERCIAL_BUY: number[] = BUDGET_STEPS_BUY;

const BUDGET_STEPS_COMMERCIAL_RENT: number[] = (() => {
  const steps = [0]; // No min
  for (let v = 5_000; v <= 100_000; v += 5_000) steps.push(v);
  steps.push(0); // sentinel → "1 L+"
  return steps;
})();

const BUDGET_STEPS_PLOTS: number[] = (() => {
  const steps = [0, 100_000]; // No min, then ₹1 L
  for (let v = 500_000; v <= 100_000_000; v += 500_000) steps.push(v);
  steps.push(0); // sentinel → "10 Cr+"
  return steps;
})();

const BUDGET_STEPS_MAP: Record<string, number[]> = {
  "Buy":             BUDGET_STEPS_BUY,
  "Rent":            BUDGET_STEPS_RENT,
  "Commercial Buy":  BUDGET_STEPS_COMMERCIAL_BUY,
  "Commercial Rent": BUDGET_STEPS_COMMERCIAL_RENT,
  "Plots/Land":      BUDGET_STEPS_PLOTS,
};

// Sentinel cap labels — shown when the max thumb sits at the last (0-sentinel) index
const BUDGET_MAX_LABEL: Record<string, string> = {
  "Buy":             "2 Cr+",
  "Rent":            "1 L+",
  "Commercial Buy":  "2 Cr+",
  "Commercial Rent": "1 L+",
  "Plots/Land":      "10 Cr+",
  "Projects":        "No max",
  "New Launch":      "No max",
};

function getBudgetSteps(category: string): number[] {
  return BUDGET_STEPS_MAP[category] ?? BUDGET_STEPS_BUY;
}

// Formats a raw rupee value into a human-readable label.
// isMax=true and val=0 → cap label; isMax=false and val=0 → "No min"
function formatBudget(val: number, isMax = false, category = "Buy"): string {
  if (val === 0) {
    return isMax ? (BUDGET_MAX_LABEL[category] ?? "No max") : "No min";
  }
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(val % 10_000_000 === 0 ? 0 : 1)} Cr`;
  if (val >= 100_000)    return `₹${(val / 100_000).toFixed(val % 100_000 === 0 ? 0 : 1)} L`;
  if (val >= 1_000)      return `₹${(val / 1_000).toFixed(val % 1_000 === 0 ? 0 : 1)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

// ─── Area steps ───────────────────────────────────────────────────────────────
//
// Mirrors AREA_STEPS_SQFT in RealEstateSearchAdvanced.tsx.
// The sidebar always works in sq.ft internally; display conversion is optional.
// ──────────────────────────────────────────────────────────────────────────────

const AREA_STEPS_SQFT = [
  0, 300, 500, 750, 1_000, 1_200, 1_500, 2_000, 2_500, 3_000,
  4_000, 5_000, 7_500, 10_000, 15_000, 20_000, 50_000,
];

function formatAreaSqft(sqft: number, isMax = false): string {
  if (sqft === 0) return isMax ? "No max" : "No min";
  return `${sqft.toLocaleString("en-IN")} sq.ft`;
}

// ─── Filter visibility config per category ────────────────────────────────────
//
// Exact mirror of FILTER_VISIBILITY in RealEstateSearchAdvanced.tsx.
// Both the hero search bar and the sidebar consult the same shape so they
// always show/hide the same controls for a given category.
// ──────────────────────────────────────────────────────────────────────────────

interface FilterVisibility {
  propertyType:   boolean;
  bhk:            boolean;   // No. of bedrooms
  budget:         boolean;
  area:           boolean;
  possession:     boolean;   // Possession / availability status
  furnishing:     boolean;
  availableFor:   boolean;   // Rent-only tenant type
  postedBy:       boolean;
  amenities:      boolean;
  bathrooms:      boolean;
  possessionYear: boolean;   // Projects / New Launch
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
    amenities:      true,
    bathrooms:      false,
    possessionYear: true,
  },
};

// ─── Tiny reusable sub-components ─────────────────────────────────────────────

// Animated accordion wrapper — same smooth expand/collapse used across sections
function AccordionSection({
  title,
  open,
  onToggle,
  children,
  maxHeight = "max-h-96",
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}) {
  return (
    <>
      {/* Only the header row is clickable — not the content area */}
      <div
        className="cursor-pointer py-3 select-none"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-gray-800">{title}</span>
          <FaAngleDown
            className={`text-gray-400 text-xs transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content area is OUTSIDE the clickable div — clicks won't bubble to onToggle */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? maxHeight : "max-h-0"
        }`}
      >
        <div className="pt-2 pb-3">{children}</div>
      </div>

      <hr className="border-gray-100" />
    </>
  );
}

// Checkbox row — consistent look for all multi-select filter lists
function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 px-1 hover:bg-blue-50 rounded-lg cursor-pointer select-none group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-blue-600 w-3.5 h-3.5 flex-shrink-0 cursor-pointer rounded"
      />
      <span
        className={`text-sm leading-tight transition-colors ${
          checked
            ? "text-blue-600 font-medium"
            : "text-gray-600 group-hover:text-gray-800"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

// Pill toggle button — used for BHK, bathrooms, possession years, amenities
function PillToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ${
        active
          ? "bg-primary text-white border-primary shadow-sm"
          : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-primary bg-white"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Helper: generic toggle for arrays ────────────────────────────────────────

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Sidebar Component ─────────────────────────────────────────────────────────

const Sidebar = ({ isDrawer = false }: { isDrawer?: boolean }) => {
  const dispatch = useAppDispatch();

  // ── Read city & category from Redux ─────────────────────────────────────────
  const cityFilter     = useAppSelector((state) => state.filters.city);
  const categoryFilter = useAppSelector((state) => state.filters.category);

  // Active category — fall back to "Buy" when nothing is set
  const activeCategory = categoryFilter || "Buy";

  // Derive filter visibility config for the active category
  const vis = FILTER_VISIBILITY[activeCategory] ?? FILTER_VISIBILITY["Buy"];

  // Property types change per category — always pick the right list
  const currentPropertyTypes =
    PROPERTY_TYPES_MAP[activeCategory] ?? PROPERTY_TYPES_MAP["Buy"];

  // Budget steps change per category (Rent has ₹K steps, Buy has ₹L/Cr steps)
  const activeBudgetSteps = getBudgetSteps(activeCategory);

  // Replace the local state declarations + toggle handlers for each filter group.
  // Pattern: read from Redux, dispatch on change — no local useState needed.

  const selectedBHK          = useAppSelector(s => s.filters.bedrooms);
  const selectedAvailability = useAppSelector(s => s.filters.availability);
  const selectedFurnishing   = useAppSelector(s => s.filters.furnishing);
  const selectedPostedBy     = useAppSelector(s => s.filters.postedBy);
  const selectedBathrooms    = useAppSelector(s => s.filters.bathrooms);
  const selectedAvailFor     = useAppSelector(s => s.filters.availableFor);
  const selectedAmenities    = useAppSelector(s => s.filters.amenities);
  const selectedTypes        = useAppSelector(s => s.filters.propertyTypes);

  // Budget — index-based into activeBudgetSteps (same approach as the hero bar)
  const [budgetMinIdx, setBudgetMinIdx] = useState(0);
  const [budgetMaxIdx, setBudgetMaxIdx] = useState(activeBudgetSteps.length - 1);

  const safeBudgetMinIdx = Math.min(budgetMinIdx, activeBudgetSteps.length - 1);
  const safeBudgetMaxIdx = Math.min(budgetMaxIdx, activeBudgetSteps.length - 1);

  // Area — index-based into AREA_STEPS_SQFT
  const [areaMinIdx, setAreaMinIdx] = useState(0);
  const [areaMaxIdx, setAreaMaxIdx] = useState(AREA_STEPS_SQFT.length - 1);
  const [selectedPossYears, setSelectedPossYears] = useState<string[]>([]);

  // ── Accordion open / close state ────────────────────────────────────────────

  // const [openPropertyType,    setOpenPropertyType]    = useState(false);
  // const [, setOpenPropertyType] = useState(false);
  const [openBudget,          setOpenBudget]          = useState(false);
  const [openArea,            setOpenArea]            = useState(false);
  const [openBHK,             setOpenBHK]             = useState(false);
  const [openPossession,      setOpenPossession]      = useState(false);
  const [openAvailableFor,    setOpenAvailableFor]    = useState(false);
  const [openPostedBy,        setOpenPostedBy]        = useState(false);
  const [openFurnishing,      setOpenFurnishing]      = useState(false);
  const [openBathrooms,       setOpenBathrooms]       = useState(false);
  const [openAmenities,       setOpenAmenities]       = useState(false);
  const [openPossessionYear,  setOpenPossessionYear]  = useState(false);

  // ── Category change ──────────────────────────────────────────────────────────
  //
  // When the user switches category:
  //   1. Dispatch the new category to Redux so the listing page re-fetches.
  //   2. Reset every local filter state — values for "Buy" make no sense for
  //      "Commercial Rent", so start fresh.
  //   3. Collapse all accordions to give the user a clean slate.
  // ──────────────────────────────────────────────────────────────────────────────

// Sidebar.tsx — handleCategoryChange
function handleCategoryChange(cat: string) {
  dispatch(setCategory(cat));

  // Reset all Redux filter arrays when category changes
  dispatch(setFilters({
    category:      cat,
    propertyTypes: [],
    bedrooms:      [],
    availability:  [],
    furnishing:    [],
    postedBy:      [],
    bathrooms:     [],
    availableFor:  [],
    amenities:     [],
    minBudget:     0,
    maxBudget:     0,
    minArea:       0,
    maxArea:       0,
  }));

  // Reset local slider indices for the new category's step array
  const newSteps = getBudgetSteps(cat);
  setBudgetMinIdx(0);
  setBudgetMaxIdx(newSteps.length - 1);
  setAreaMinIdx(0);
  setAreaMaxIdx(AREA_STEPS_SQFT.length - 1);

  // Collapse all accordions
  setOpenBudget(false);
  setOpenArea(false);
  setOpenBHK(false);
  setOpenPossession(false);
  setOpenAvailableFor(false);
  setOpenPostedBy(false);
  setOpenFurnishing(false);
  setOpenBathrooms(false);
  setOpenAmenities(false);
  setOpenPossessionYear(false);
}

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <aside
      className={`
        ${isDrawer ? "w-full" : "hidden lg:block w-72 flex-shrink-0"}
        bg-white 
        ${!isDrawer && "sticky top-4 self-start"}
        flex flex-col
      `}
      style={{ maxHeight: isDrawer ? undefined : "calc(100vh - 2rem)", overflowY: "auto" }}
    >

      {/* ── Sidebar header ─────────────────────────────────────────────────────
          Shows "Filters" title and the count of currently active filters.
          If any filters are active the badge turns blue so it's immediately
          obvious something is narrowing the results.
      ───────────────────────────────────────────────────────────────────────── */}
      {/* <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm tracking-wide">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary text-white text-[10px]">
             {activeFilterCount} active
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div> */}

      <div className="px-4 py-3 space-y-0">

        {/* ── Category ─────────────────────────────────────────────────────────
            Single-select dropdown — only one category active at a time.
            Switching category resets all filter selections and collapses all
            accordions so the user starts fresh for the new context.
        ───────────────────────────────────────────────────────────────────────── */}
        <div className="mb-3">
          <label className="block font-medium text-sm text-gray-800 mb-1.5">
            Category
          </label>
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* ── City ─────────────────────────────────────────────────────────────
            Synced to Redux; selecting "All Cities" clears the city filter.
        ───────────────────────────────────────────────────────────────────────── */}
        <div className="mb-3">
          <label className="block font-medium text-sm text-gray-800 mb-1.5">
            City
          </label>
          <select
            value={cityFilter || "All Cities"}
            onChange={(e) =>
              dispatch(
                setCity(e.target.value === "All Cities" ? "" : e.target.value)
              )
            }
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition cursor-pointer"
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <hr className="border-gray-100 mb-1" />

        {/* ── Property Type ─────────────────────────────────────────────────────
    Available for: all categories (propertyType: true everywhere).
    The list of types changes per category — Rent shows "PG" & "Co-living",
    Commercial shows office/warehouse options, Plots shows land variants, etc.
    ───────────────────────────────────────────────────────────────────────── */}
    {vis.propertyType && (
      <div className="mb-3">
        <label className="block font-medium text-sm text-gray-800 mb-1.5">
          Property Type
        </label>
        <select
          value={selectedTypes[0] ?? ""}
          onChange={(e) => {
            // clear old selection then set new one
            selectedTypes.forEach(t => dispatch(togglePropertyType(t)));
            if (e.target.value) dispatch(togglePropertyType(e.target.value));
          }}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition cursor-pointer"
        >
          <option value="">All Types</option>
          {/* {currentPropertyTypes.map(({ label, value }) => ( */}
          {currentPropertyTypes.map(({ value }) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    )}

{vis.budget && (
  <AccordionSection
    title={activeCategory === "Rent" || activeCategory === "Commercial Rent" ? "Rent Range" : "Budget"}
    open={openBudget}
    onToggle={() => setOpenBudget((v) => !v)}
  >
    {/* Live range label */}
    <p className="text-xs text-primary font-medium mb-4">
      {formatBudget(activeBudgetSteps[safeBudgetMinIdx], false, activeCategory)}
      {" – "}
      {safeBudgetMaxIdx === activeBudgetSteps.length - 1
        ? BUDGET_MAX_LABEL[activeCategory]
        : formatBudget(activeBudgetSteps[safeBudgetMaxIdx], true, activeCategory)}
    </p>

    {/* ← Single dual-thumb slider replaces the two separate sliders */}
    <RangeSlider
      min={0}
      max={activeBudgetSteps.length - 1}
      minVal={safeBudgetMinIdx}
      maxVal={safeBudgetMaxIdx}
      onMinChange={(val) => {
        setBudgetMinIdx(val);
        dispatch(setMinBudget(activeBudgetSteps[val]));
      }}
      onMaxChange={(val) => {
        setBudgetMaxIdx(val);
        const isMax = val === activeBudgetSteps.length - 1;
        dispatch(setMaxBudget(isMax ? 0 : activeBudgetSteps[val]));
      }}
    />

    {/* Quick preset chips — unchanged */}
  </AccordionSection>
)}

{vis.area && (
  <AccordionSection
    title="Area (Sq.Ft)"
    open={openArea}
    onToggle={() => setOpenArea((v) => !v)}
  >
    <p className="text-xs text-primary font-medium mb-4">
      {formatAreaSqft(AREA_STEPS_SQFT[areaMinIdx])}
      {" – "}
      {areaMaxIdx === AREA_STEPS_SQFT.length - 1
        ? "No max"
        : formatAreaSqft(AREA_STEPS_SQFT[areaMaxIdx])}
    </p>

    {/* ← Same component, different step array */}
    <RangeSlider
      min={0}
      max={AREA_STEPS_SQFT.length - 1}
      minVal={areaMinIdx}
      maxVal={areaMaxIdx}
      onMinChange={(val) => {
        setAreaMinIdx(val);
        dispatch(setMinArea(AREA_STEPS_SQFT[val]));
      }}
      onMaxChange={(val) => {
        setAreaMaxIdx(val);
        const isMax = val === AREA_STEPS_SQFT.length - 1;
        dispatch(setMaxArea(isMax ? 0 : AREA_STEPS_SQFT[val]));
      }}
    />

    {/* Quick preset chips — unchanged */}
  </AccordionSection>
)}

        {/* ── No. of Bedrooms (BHK) ─────────────────────────────────────────────
            Shown for: Buy, Rent, Projects, New Launch (bhk: true).
            Hidden for: Commercial Buy, Commercial Rent, Plots/Land.
            Multi-select pill chips — same options as the hero bar quick filters.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.bhk && (
          <AccordionSection
            title={`No. of Bedrooms${selectedBHK.length > 0 ? ` (${selectedBHK.length})` : ""}`}
            open={openBHK}
            onToggle={() => setOpenBHK((v) => !v)}
          >
            <div className="flex flex-wrap gap-2">
              {BHK_OPTIONS.map((opt) => (
                <PillToggle
                  key={opt.value}
                  label={opt.label}
                  active={selectedBHK.includes(opt.value)}
                  onClick={() => dispatch(toggleBedroom(opt.value))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Possession Status ─────────────────────────────────────────────────
            Shown for: Buy, Commercial Buy, Projects, New Launch (possession: true).
            Hidden for: Rent, Commercial Rent, Plots/Land.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.possession && (
          <AccordionSection
            title={`Possession Status${selectedAvailability.length > 0 ? ` (${selectedAvailability.length})` : ""}`}
            open={openPossession}
            onToggle={() => setOpenPossession((v) => !v)}
          >
            <div className="space-y-0.5">
              {AVAILABILITIES.map((a) => (
                <CheckRow
                  key={a}
                  label={a}
                  checked={selectedAvailability.includes(a)}
                  onChange={() => dispatch(toggleAvailability(a))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Possession Year ───────────────────────────────────────────────────
            Shown for: Projects, New Launch (possessionYear: true).
            Multi-select pill chips for year selection.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.possessionYear && (
          <AccordionSection
            title={`Possession Year${selectedPossYears.length > 0 ? ` (${selectedPossYears.length})` : ""}`}
            open={openPossessionYear}
            onToggle={() => setOpenPossessionYear((v) => !v)}
          >
            <div className="flex flex-wrap gap-2">
              {POSSESSION_YEARS.map((y) => (
                <PillToggle
                  key={y}
                  label={y}
                  active={selectedPossYears.includes(y)}
                  onClick={() =>
                    setSelectedPossYears((prev) => toggle(prev, y))
                  }
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Available For ─────────────────────────────────────────────────────
            Shown for: Rent only (availableFor: true).
            Lets landlords specify tenant preference: Family / Bachelor / Company.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.availableFor && (
          <AccordionSection
            title={`Available For${selectedAvailFor.length > 0 ? ` (${selectedAvailFor.length})` : ""}`}
            open={openAvailableFor}
            onToggle={() => setOpenAvailableFor((v) => !v)}
          >
            <div className="space-y-0.5">
              {AVAILABLE_FOR_OPTIONS.map((a) => (
                <CheckRow
                  key={a}
                  label={a}
                  checked={selectedAvailFor.includes(a)}
                  onChange={() => dispatch(toggleAvailableFor(a))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Posted By ─────────────────────────────────────────────────────────
            Shown for: Buy, Rent, Commercial Buy, Commercial Rent, Plots/Land.
            Hidden for: Projects, New Launch (builder field shown there instead).
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.postedBy && (
          <AccordionSection
            title={`Posted By${selectedPostedBy.length > 0 ? ` (${selectedPostedBy.length})` : ""}`}
            open={openPostedBy}
            onToggle={() => setOpenPostedBy((v) => !v)}
          >
            <div className="space-y-0.5">
              {POSTED_BY_OPTS.map((p) => (
                <CheckRow
                  key={p}
                  label={p}
                  checked={selectedPostedBy.includes(p)}
                  onChange={() => dispatch(togglePostedBy(p))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Furnishing Status ─────────────────────────────────────────────────
            Shown for: Buy, Rent, Commercial Buy, Commercial Rent (furnishing: true).
            Hidden for: Plots/Land, Projects, New Launch.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.furnishing && (
          <AccordionSection
            title={`Furnishing${selectedFurnishing.length > 0 ? ` (${selectedFurnishing.length})` : ""}`}
            open={openFurnishing}
            onToggle={() => setOpenFurnishing((v) => !v)}
          >
            <div className="space-y-0.5">
              {FURNISHING_OPTS.map((f) => (
                <CheckRow
                  key={f}
                  label={f}
                  checked={selectedFurnishing.includes(f)}
                  onChange={() => dispatch(toggleFurnishing(f))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── No. of Bathrooms ──────────────────────────────────────────────────
            Shown for: Buy, Rent (bathrooms: true).
            Hidden for: Commercial, Plots/Land, Projects, New Launch.
            "4" is displayed as "4+" to indicate ≥ 4 bathrooms.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.bathrooms && (
          <AccordionSection
            title={`No. of Bathrooms${selectedBathrooms.length > 0 ? ` (${selectedBathrooms.length})` : ""}`}
            open={openBathrooms}
            onToggle={() => setOpenBathrooms((v) => !v)}
          >
            <div className="flex flex-wrap gap-2">
              {BATHROOM_OPTS.map((b) => (
                <PillToggle
                  key={b}
                  label={b === 4 ? "4+" : String(b)}
                  active={selectedBathrooms.includes(b)}
                  onClick={() => dispatch(toggleBathroom(b))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* ── Amenities ─────────────────────────────────────────────────────────
            Shown for: Buy, Rent, Projects, New Launch (amenities: true).
            Hidden for: Commercial Buy, Commercial Rent, Plots/Land.
            Uses larger max-h because the amenity list is longer than other sections.
        ───────────────────────────────────────────────────────────────────────── */}
        {vis.amenities && (
          <AccordionSection
            title={`Amenities${selectedAmenities.length > 0 ? ` (${selectedAmenities.length})` : ""}`}
            open={openAmenities}
            onToggle={() => setOpenAmenities((v) => !v)}
            maxHeight="max-h-[500px]"
          >
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((a) => (
                <PillToggle
                  key={a}
                  label={a}
                  active={selectedAmenities.includes(a)}
                  onClick={() => dispatch(toggleAmenity(a))}
                />
              ))}
            </div>
          </AccordionSection>
        )}

      </div>{/* end scrollable filter area */}

      {/* ── Action buttons ──────────────────────────────────────────────────────
          Sticky at the bottom so they're always reachable without scrolling.
          "Apply Filters" dispatches all current selections to Redux.
          "Reset All"     clears both Redux and local state.
      ───────────────────────────────────────────────────────────────────────── */}
      {/* <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors"
        >
          Reset All
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
        >
          Apply Filters
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;