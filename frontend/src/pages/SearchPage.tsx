// SearchPage.tsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PropertyCard from "../components/PropertyCard";
import { BsFilterRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { resetFilters, setSearchQuery, setCity, setFilters } from "../store/slices/filterSlice";
import { fetchProperties } from "../store/slices/propertySlice";
import { type PropertyFilters } from "../api/propertyApi";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const properties = useAppSelector(state => state.property.properties ?? []);
  const total = useAppSelector(state => state.property.total ?? 0);
  const filters = useAppSelector(state => state.filters);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const hasMountFetched = useRef(false);

  // ── Helper: build PropertyFilters from Redux filter state ──────────────────
  const buildFetchParams = (f: typeof filters): PropertyFilters => ({
    page:          1,
    category:      f.category    || undefined,
    city:          f.city        || undefined,
    search:        f.searchQuery || undefined,
    minBudget:     f.minBudget   || undefined,
    maxBudget:     f.maxBudget   || undefined,
    minArea:       f.minArea     || undefined,
    maxArea:       f.maxArea     || undefined,
    bedrooms:      f.bedrooms.length      ? f.bedrooms      : undefined,
    propertyTypes: f.propertyTypes.length ? f.propertyTypes : undefined,
    furnishing:    f.furnishing.length    ? f.furnishing    : undefined,
    postedBy:      f.postedBy.length      ? f.postedBy      : undefined,
    bathrooms:     f.bathrooms.length     ? f.bathrooms     : undefined,
    amenities:     f.amenities.length     ? f.amenities     : undefined,
    availableFor:  f.availableFor.length  ? f.availableFor  : undefined,
    availability:  f.availability.length  ? f.availability  : undefined,
  });

  // ── On mount: hydrate Redux from URL params then fetch ─────────────────────
  useEffect(() => {
    const p = Object.fromEntries(searchParams.entries());

    const hydratedFilters = {
      category:      p.category      || "",
      city:          p.city          || "",
      searchQuery:   p.search        || "",
      minBudget:     Number(p.minBudget)  || 0,
      maxBudget:     Number(p.maxBudget)  || 0,
      minArea:       Number(p.minArea)    || 0,
      maxArea:       Number(p.maxArea)    || 0,
      bedrooms:      p.bedrooms      ? p.bedrooms.split(",").map(Number) : [],
      propertyTypes: p.propertyTypes ? p.propertyTypes.split(",") : [],
      furnishing:    p.furnishing    ? p.furnishing.split(",") : [],
      postedBy:      p.postedBy      ? p.postedBy.split(",") : [],
      bathrooms:     p.bathrooms     ? p.bathrooms.split(",").map(Number) : [],
      amenities:     p.amenities     ? p.amenities.split(",") : [],
      availableFor:  p.availableFor  ? p.availableFor.split(",") : [],
      availability:  p.availability  ? p.availability.split(",") : [],
    };

    dispatch(setFilters(hydratedFilters));
    if (p.search) setSearchInput(p.search);

    // Fetch using hydrated values directly — Redux state hasn't committed yet
    dispatch(fetchProperties(buildFetchParams(hydratedFilters as typeof filters)));

    hasMountFetched.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── On filter change: update URL + re-fetch ────────────────────────────────
  useEffect(() => {
    if (!hasMountFetched.current) return;

    const params: Record<string, string> = {};
    if (filters.category)             params.category      = filters.category;
    if (filters.city)                 params.city          = filters.city;
    if (filters.searchQuery)          params.search        = filters.searchQuery;
    if (filters.minBudget > 0)        params.minBudget     = String(filters.minBudget);
    if (filters.maxBudget > 0)        params.maxBudget     = String(filters.maxBudget);
    if (filters.minArea > 0)          params.minArea       = String(filters.minArea);
    if (filters.maxArea > 0)          params.maxArea       = String(filters.maxArea);
    if (filters.bedrooms.length)      params.bedrooms      = filters.bedrooms.join(",");
    if (filters.propertyTypes.length) params.propertyTypes = filters.propertyTypes.join(",");
    if (filters.furnishing.length)    params.furnishing    = filters.furnishing.join(",");
    if (filters.postedBy.length)      params.postedBy      = filters.postedBy.join(",");
    if (filters.bathrooms.length)     params.bathrooms     = filters.bathrooms.join(",");
    if (filters.amenities.length)     params.amenities     = filters.amenities.join(",");
    if (filters.availableFor.length)  params.availableFor  = filters.availableFor.join(",");
    if (filters.availability.length)  params.availability  = filters.availability.join(",");

    setSearchParams(params, { replace: true });
    dispatch(fetchProperties(buildFetchParams(filters)));
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close drawer on outside click ─────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setIsDrawerOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => dispatch(setSearchQuery(searchInput.trim()));

  const hasActiveFilters = Boolean(
  filters.category || filters.searchQuery || filters.city ||
  filters.minBudget > 0 || filters.maxBudget > 0 ||
  filters.minArea > 0   || filters.maxArea > 0   ||
  filters.bedrooms.length      > 0 || filters.propertyTypes.length > 0 ||
  filters.furnishing.length    > 0 || filters.postedBy.length      > 0 ||
  filters.bathrooms.length     > 0 || filters.amenities.length     > 0 ||
  filters.availableFor.length  > 0 || filters.availability.length  > 0
);
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-[#f7f7f7] min-h-screen">

        <div className="flex gap-2 mb-4">
          <div className="flex flex-1 items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:border-primary transition">
            <FaMapMarkerAlt className="text-primary flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Locality, projects or builders"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); dispatch(setSearchQuery("")); }}>
                <IoClose />
              </button>
            )}
          </div>
          <button onClick={handleSearch} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition">
            <FaSearch />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {filters.city && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-500">Showing in:</span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200">
              <FaMapMarkerAlt className="text-xs" />
              {filters.city}
              <button onClick={() => dispatch(setCity(""))} className="ml-1 hover:text-blue-900"><IoClose /></button>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs md:text-sm text-gray-800">
              {total} {total === 1 ? "property" : "properties"} found
            </h2>
            {hasActiveFilters && (
              <button onClick={() => dispatch(resetFilters())} className="text-xs text-primary underline">
                Clear filters
              </button>
            )}
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-lg transition hover:bg-blue-100">
            <BsFilterRight className="text-lg" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-black">
            <p className="text-lg font-medium">No properties match your filters</p>
            <button onClick={() => dispatch(resetFilters())} className="mt-3 text-primary underline text-sm">
              Reset all filters
            </button>
          </div>
        )}
      </main>

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-full bg-white z-40 shadow-2xl transform transition-transform duration-300 lg:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <IoClose className="text-2xl" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
          <Sidebar isDrawer={true} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;