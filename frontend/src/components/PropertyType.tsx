import { FaPlus, FaCheck } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { togglePropertyType } from "../store/slices/filterSlice";

const typeOptions = [
  'Residential Apartment',
  'Independent House/Villa',
  'Independent/Builder Floor',
  '1 RK/ Studio Apartment',
  'Serviced Apartments',
  'Commercial',
  'Residential Land',
  'Agricultural Land',
];

const PropertyType = () => {
  const dispatch = useAppDispatch();
  const propertyTypes = useAppSelector(state => state.filters.propertyTypes);

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-2">
      {typeOptions.map(type => {
        const active = propertyTypes.includes(type);
        return (
          <button
            key={type}
            type="button"
            onClick={e => { e.stopPropagation(); dispatch(togglePropertyType(type)); }}
            // className={`flex items-center gap-1 border px-4 py-2 text-sm rounded-full active:scale-95 transition ${
            className={`flex items-center gap-1 border px-2 py-1 text-sm rounded-full active:scale-95 transition ${
              active
                ? 'bg-primary text-white border-primary'
                : 'border-gray-500/30 text-gray-800 bg-white hover:text-primary hover:bg-primary/10 hover:border-primary/30'
            }`}
          >
            {active ? <FaCheck /> : <FaPlus />} {type}
          </button>
        );
      })}
    </div>
  )
}

export default PropertyType
