import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import BudgetDropdowns from "./BudgetDropdowns";
import BedroomsCount from "./BedroomsCount";
import PropertyType from "./PropertyType";
import AvailableFor from "./AvailableFor";
import PostedBy from "./PostedBy";
import FurnishingStatus from "./FurnishingStatus";
import Bathrooms from "./Bathrooms";
import Amenities from "./Amenities";
import AvailabilityFilter from "./AvailabilityFilter";
import AreaRangeFilter from "./AreaRangeFilter";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCity, resetFilters } from "../store/slices/filterSlice";

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

const Sidebar = ({ isDrawer = false }: { isDrawer?: boolean }) => {
  const dispatch = useAppDispatch();
  const cityFilter = useAppSelector((state) => state.filters.city);

  const [budget, setBudget] = useState(false);
  const [bedrooms, setBedrooms] = useState(false);
  const [propertyType, setPropertyType] = useState(false);
  const [availableFor, setAvailableFor] = useState(false);
  const [postedBy, setPostedBy] = useState(false);
  const [furnishingStatus, setFurnishingStatus] = useState(false);
  const [bathrooms, setBathrooms] = useState(false);
  const [amenities, setAmenities] = useState(false);
  const [availability, setAvailability] = useState(false);
  const [areaRange, setAreaRange] = useState(false);

  return (
    <aside
      className={`${isDrawer ? "w-full" : "hidden lg:block w-64"} bg-white ${!isDrawer && "border-r border-ruler"} p-4`}
    >
      <div className="mb-2">
        <label className="flex items-center space-x-2 mt-2">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">Hide already seen</span>
        </label>
      </div>

      {/* City Filter */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">
          City
        </label>
        <select
          value={cityFilter}
          onChange={(e) =>
            dispatch(
              setCity(e.target.value === "All Cities" ? "" : e.target.value),
            )
          }
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c === "All Cities" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <hr className="text-ruler mb-2" />

      {/* Budget */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setBudget(!budget)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Budget</h1>
          <FaAngleDown className={`transition-transform duration-300 ${budget ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${budget ? 'max-h-96' : 'max-h-0'}`}>
          <BudgetDropdowns />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Area Range */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setAreaRange(!areaRange)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Area (Sq.Ft)</h1>
          <FaAngleDown className={`transition-transform duration-300 ${areaRange ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${areaRange ? 'max-h-96' : 'max-h-0'}`}>
          <AreaRangeFilter />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Bedrooms */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setBedrooms(!bedrooms)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">No. of Bedrooms</h1>
          <FaAngleDown className={`transition-transform duration-300 ${bedrooms ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${bedrooms ? 'max-h-96' : 'max-h-0'}`}>
          <BedroomsCount />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Property Type */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setPropertyType(!propertyType)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Type of Property</h1>
          <FaAngleDown className={`transition-transform duration-300 ${propertyType ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${propertyType ? 'max-h-96' : 'max-h-0'}`}>
          <PropertyType />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Possession Status */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setAvailability(!availability)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Possession Status</h1>
          <FaAngleDown className={`transition-transform duration-300 ${availability ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${availability ? 'max-h-96' : 'max-h-0'}`}>
          <AvailabilityFilter />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Available For */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setAvailableFor(!availableFor)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Available For</h1>
          <FaAngleDown className={`transition-transform duration-300 ${availableFor ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${availableFor ? 'max-h-96' : 'max-h-0'}`}>
          <AvailableFor />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Posted By */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setPostedBy(!postedBy)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Posted By</h1>
          <FaAngleDown className={`transition-transform duration-300 ${postedBy ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${postedBy ? 'max-h-96' : 'max-h-0'}`}>
          <PostedBy />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Furnishing */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setFurnishingStatus(!furnishingStatus)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Furnishing Status</h1>
          <FaAngleDown className={`transition-transform duration-300 ${furnishingStatus ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${furnishingStatus ? 'max-h-96' : 'max-h-0'}`}>
          <FurnishingStatus />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Bathrooms */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setBathrooms(!bathrooms)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">No. of Bathrooms</h1>
          <FaAngleDown className={`transition-transform duration-300 ${bathrooms ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${bathrooms ? 'max-h-96' : 'max-h-0'}`}>
          <Bathrooms />
        </div>
      </div>
      <hr className="text-ruler" />

      {/* Amenities */}
      <div
        className="cursor-pointer py-3 space-y-2"
        onClick={() => setAmenities(!amenities)}
      >
        <div className="flex justify-between">
          <h1 className="font-medium">Amenities</h1>
          <FaAngleDown className={`transition-transform duration-300 ${amenities ? 'rotate-180' : ''}`} />
        </div>
        {/* <div className={`overflow-hidden transition-all duration-300 ease-in-out ${amenities ? 'max-h-96' : 'max-h-0'}`}> */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${amenities ? 'max-h-[500px]' : 'max-h-0'}`}>
          <Amenities />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => dispatch(resetFilters())}
        className="mt-4 w-full text-sm text-primary border border-primary rounded-lg py-2 hover:bg-primary/5 transition"
      >
        Reset All Filters
      </button>
    </aside>
  );
};

export default Sidebar;
