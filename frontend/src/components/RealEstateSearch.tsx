import { useState } from "react";
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
import { BUDGET_STEPS, formatBudget } from "./BudgetDropdowns";
import { AREA_STEPS, formatArea } from "./AreaRangeFilter";

const TABS = ["Buy", "Rent", "Commercial", "Plots/Land", "Projects", "New Launch"];

const CITIES = [
  "All Cities", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Nagpur", "Noida", "Gurugram",
  "Navi Mumbai", "Thane", "Jaipur", "Lucknow", "Surat",
];

const POPULAR_CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Nagpur", "Noida"];

const PROPERTY_TYPES = [
  { label: "Apartment", icon: MdApartment, value: "Residential Apartment" },
  { label: "Villa", icon: MdVilla, value: "Independent House/Villa" },
  { label: "Builder Floor", icon: FaBuilding, value: "Builder Floor" },
  { label: "Plot/Land", icon: FaSquare, value: "Residential Land" },
  { label: "Studio/1RK", icon: FaHome, value: "1 RK/ Studio Apartment" },
  { label: "Commercial", icon: FaBuilding, value: "Commercial" },
];

const BHK_OPTIONS = [
  { label: "1 RK", value: 0 },
  { label: "1 BHK", value: 1 },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
  { label: "4+ BHK", value: 4 },
];

const AVAILABILITIES = ["Ready to Move", "Within 6 Months", "Within 1 Year", "More Than 1 Year"];

export default function RealEstateSearch() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Local state — dispatched all at once when user clicks Search
  const [activeTab, setActiveTab] = useState("Buy");
  const [cityLocal, setCityLocal] = useState("");
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  // Slider indices (home form uses local state — dispatched all at once on Search)
  const [budgetMinIdx, setBudgetMinIdx] = useState(0);
  const [budgetMaxIdx, setBudgetMaxIdx] = useState(BUDGET_STEPS.length - 1);
  const [areaMinIdx, setAreaMinIdx] = useState(0);
  const [areaMaxIdx, setAreaMaxIdx] = useState(AREA_STEPS.length - 1);
  const [showMore, setShowMore] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  const closeAll = () => {
    setShowCityDropdown(false);
    setShowTypeDropdown(false);
    setShowBudgetDropdown(false);
  };

  const toggleType = (v: string) =>
    setSelectedTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleBHKLocal = (v: number) =>
    setSelectedBHK(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleAvailabilityLocal = (v: string) =>
    setSelectedAvailability(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const handleSearch = () => {
    dispatch(resetFilters());
    dispatch(setCategory(activeTab));
    if (cityLocal) dispatch(setCity(cityLocal));
    if (query.trim()) dispatch(setSearchQuery(query.trim()));
    // Budget: index 0 = no min (0), last index = no max (0)
    dispatch(setMinBudget(BUDGET_STEPS[budgetMinIdx]));
    dispatch(setMaxBudget(budgetMaxIdx === BUDGET_STEPS.length - 1 ? 0 : BUDGET_STEPS[budgetMaxIdx]));
    // Area: index 0 = no min (0), last index = no max (0)
    dispatch(setMinArea(AREA_STEPS[areaMinIdx]));
    dispatch(setMaxArea(areaMaxIdx === AREA_STEPS.length - 1 ? 0 : AREA_STEPS[areaMaxIdx]));
    selectedTypes.forEach(t => dispatch(togglePropertyType(t)));
    selectedBHK.forEach(b => dispatch(toggleBedroom(b)));
    selectedAvailability.forEach(a => dispatch(toggleAvailability(a)));
    navigate("/property-search");
  };

  const budgetLabel =
    budgetMinIdx > 0 || budgetMaxIdx < BUDGET_STEPS.length - 1
      ? `${formatBudget(BUDGET_STEPS[budgetMinIdx])} – ${formatBudget(BUDGET_STEPS[budgetMaxIdx], true)}`
      : null;

  const goToCity = (c: string) => {
    dispatch(resetFilters());
    dispatch(setCity(c));
    navigate("/property-search");
  };

  return (
    <section
      className="relative min-h-[600px] lg:min-h-[680px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#060e20] via-[#0d2549] to-[#060e20] px-4 py-16"
      onClick={closeAll}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Hero headline */}
      <div className="relative z-10 text-center mb-8">
        <p className="text-themeyellow text-sm font-medium tracking-widest uppercase mb-3">India's Trusted Property Portal</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-3">
          Find Your Dream Home<br className="hidden sm:block" /> Across India
        </h1>
        {/* <p className="text-themeyellow text-sm sm:text-base">
          Buy, Rent or Invest — Explore properties in 100+ cities
        </p> */}
      </div>

      {/* Search Card */}
      <div
        className="relative z-10 w-full max-w-4xl bg-white rounded-md shadow-2xl overflow-visible"
        onClick={e => e.stopPropagation()}
      >
        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Main search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City Dropdown */}
            <div className="relative sm:w-44" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { setShowCityDropdown(!showCityDropdown); setShowTypeDropdown(false); setShowBudgetDropdown(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-blue-400 transition bg-white"
              >
                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0 text-base" />
                <span className={`flex-1 text-left truncate ${cityLocal ? "text-gray-800" : "text-gray-400"}`}>
                  {cityLocal || "Select City"}
                </span>
                <FaChevronDown className={`text-gray-400 text-xs flex-shrink-0 transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
              </button>
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {CITIES.map(c => (
                    <button
                      key={c}
                      onClick={() => { setCityLocal(c === "All Cities" ? "" : c); setShowCityDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition ${cityLocal === c ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-700"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-400 transition">
              <FaSearch className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search locality, project or builder"
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <IoClose />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors sm:min-w-[130px]"
            >
              <FaSearch />
              <span>Search</span>
            </button>
          </div>

          {/* Quick Filters Row */}
          <div
            className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Property Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowBudgetDropdown(false); setShowCityDropdown(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ${selectedTypes.length ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
              >
                Property Type{selectedTypes.length ? ` (${selectedTypes.length})` : ""}
                <FaChevronDown className={`text-xs transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2">
                  {PROPERTY_TYPES.map(({ label, icon: Icon, value }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(value)}
                        onChange={() => toggleType(value)}
                        className="accent-blue-600"
                      />
                      <Icon className="text-gray-500 text-base flex-shrink-0" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* BHK chips */}
            {BHK_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => toggleBHKLocal(opt.value)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  selectedBHK.includes(opt.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-600 hover:border-blue-400"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Budget Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowBudgetDropdown(!showBudgetDropdown); setShowTypeDropdown(false); setShowCityDropdown(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ${budgetLabel ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
              >
                {budgetLabel ? `Budget: ${budgetLabel}` : "Budget"}
                <FaChevronDown className={`text-xs transition-transform ${showBudgetDropdown ? "rotate-180" : ""}`} />
              </button>
              {showBudgetDropdown && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
                  <p className="text-xs text-gray-500 font-semibold mb-4 uppercase tracking-wide">Price Range</p>
                  <DualRangeSlider
                    steps={BUDGET_STEPS}
                    minIdx={budgetMinIdx}
                    maxIdx={budgetMaxIdx}
                    onMinChange={setBudgetMinIdx}
                    onMaxChange={setBudgetMaxIdx}
                    formatLabel={formatBudget}
                  />
                </div>
              )}
            </div>

            {/* More Filters toggle */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ml-auto ${showMore ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
            >
              {showMore ? "Less" : "+ More Filters"}
            </button>
          </div>

          {/* Expanded Filters */}
          {showMore && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Possession Status */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Possession Status</p>
                <div className="space-y-2">
                  {AVAILABILITIES.map(a => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes(a)}
                        onChange={() => toggleAvailabilityLocal(a)}
                        className="accent-blue-600"
                      />
                      <span className={`text-sm ${selectedAvailability.includes(a) ? "text-blue-600 font-medium" : "text-gray-700"}`}>{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Area Range */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Area (Sq.Ft)</p>
                <DualRangeSlider
                  steps={AREA_STEPS}
                  minIdx={areaMinIdx}
                  maxIdx={areaMaxIdx}
                  onMinChange={setAreaMinIdx}
                  onMaxChange={setAreaMaxIdx}
                  formatLabel={formatArea}
                />
              </div>

              {/* Property Type with icons */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Property Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.slice(0, 4).map(({ label, icon: Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleType(value)}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-xs transition ${
                        selectedTypes.includes(value) ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"
                      }`}
                    >
                      <Icon className="text-lg" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Cities */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="text-blue-300/70 text-sm">Popular Cities:</span>
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

