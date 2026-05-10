import { FaPlus, FaCheck } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleBedroom } from "../store/slices/filterSlice";

const bedroomOptions = [
  { label: '1 RK/1 BHK', value: 1 },
  { label: '2 BHK', value: 2 },
  { label: '3 BHK', value: 3 },
  { label: '4 BHK', value: 4 },
  { label: '5 BHK', value: 5 },
  { label: '5 BHK', value: 5 },
];

const BedroomsCount = () => {
  const dispatch = useAppDispatch();
  const bedrooms = useAppSelector(state => state.filters.bedrooms);

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-2">
      {bedroomOptions.map(({ label, value }) => {
        const active = bedrooms.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={e => { e.stopPropagation(); dispatch(toggleBedroom(value)); }}
            // className={`flex items-center gap-1 border px-4 py-2 text-sm rounded-full active:scale-95 transition ${
            className={`flex items-center gap-1 border px-2 py-1 text-xs rounded-full active:scale-95 transition ${
              active
                ? 'bg-primary text-white border-primary'
                : 'border-gray-500/30 text-gray-800 bg-white hover:text-primary hover:bg-primary/10 hover:border-primary/30'
            }`}
          >
            {active ? <FaCheck /> : <FaPlus />} {label}
          </button>
        );
      })}
    </div>
  )
}

export default BedroomsCount
