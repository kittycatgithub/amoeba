import { useRef, useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import PropertyCard from "../components/PropertyCard";
import { BsFilterRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useAppSelector } from "../store/hooks";
import { resetFilters, setSearchQuery, setCity } from "../store/slices/filterSlice";
import { useAppDispatch } from "../store/hooks";

const SearchPage = () => {
  // Fetching properties from Redux slice instead of AppContext
  const properties = useAppSelector(state => state.property.properties ?? []);
  const filters = useAppSelector(state => state.filters);
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    dispatch(setSearchQuery(searchInput.trim()));
  };

  // Apply all sidebar filters to the full property list
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location?.toLowerCase().includes(q)) return false;
      }
      if (filters.minBudget > 0 && p.priceValue < filters.minBudget) return false;
      if (filters.maxBudget > 0 && p.priceValue > filters.maxBudget) return false;
      if (filters.minArea > 0 && p.areaValue < filters.minArea) return false;
      if (filters.maxArea > 0 && p.areaValue > filters.maxArea) return false;
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(p.bedrooms)) return false;
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(p.type)) return false;
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(p.furnishing)) return false;
      if (filters.postedBy.length > 0 && !filters.postedBy.includes(p.postedBy)) return false;
      if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(p.bathrooms)) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every((a: string) => p.amenities?.includes(a))) return false;
      if (filters.availableFor.length > 0 && !filters.availableFor.some((a: string) => p.availableFor?.includes(a))) return false;
      if (filters.availability.length > 0 && (!p.availability || !filters.availability.includes(p.availability))) return false;
      return true;
    });
  }, [properties, filters]);

  const hasActiveFilters = filters.category || filters.searchQuery || filters.city
    || filters.minBudget > 0 || filters.maxBudget > 0
    || filters.minArea > 0 || filters.maxArea > 0
    || filters.bedrooms.length > 0 || filters.propertyTypes.length > 0
    || filters.furnishing.length > 0 || filters.postedBy.length > 0 || filters.bathrooms.length > 0
    || filters.amenities.length > 0 || filters.availableFor.length > 0 || filters.availability.length > 0;

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar visible only on large screens */}
      <Sidebar />

      {/* Content */}
      <main className="flex-1 p-4 bg-[#f7f7f7]  min-h-screen">
        

        {/* Search Bar */}
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
              <button
                onClick={() => { setSearchInput(""); dispatch(setSearchQuery("")); }}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <IoClose />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition"
          >
            <FaSearch />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* City filter quick-chips */}
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

        {/* Header with filters button for mobile/tablet */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs md:text-sm text-gray-800">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </h2>
            {hasActiveFilters && (
              <button
                onClick={() => dispatch(resetFilters())}
                className="text-xs text-primary underline"
              >
                Clear filters
              </button>
            )}
          </div>
          {/* Filters button - hidden on lg screens */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-lg transition hover:bg-blue-100"
          >
            <BsFilterRight className="text-lg" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Responsive grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-black">
            <p className="text-lg font-medium">No properties match your filters</p>
            <button
              onClick={() => dispatch(resetFilters())}
              className="mt-3 text-primary underline text-sm"
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>

      {/* Overlay - visible only on mobile/tablet when drawer is open */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Sidebar Drawer - visible only on mobile/tablet */}
      <div
        ref={drawerRef}
        // className={`fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-2xl transform transition-transform duration-300 lg:hidden ${
        className={`fixed top-0 left-0 h-full w-full bg-white z-40 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Drawer Sidebar Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
          <Sidebar isDrawer={true} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
