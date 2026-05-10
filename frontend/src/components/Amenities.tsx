import { FaPlus, FaCheck } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleAmenity } from "../store/slices/filterSlice";

const amenityOptions = [
  'Parking', 'Lift', 'Power Backup', 'Park', 'Vaastu Compliant',
  'Club House', 'Gymnasium', 'Swimming Pool', 'Security Personnel',
  'Gas Pipeline', 'Pet Friendly', 'Wheelchair Friendly',
  'AC Room', 'Food Service', 'Wifi', 'Laundry Available',
];

const Amenities = () => {
  const dispatch = useAppDispatch();
  const amenities = useAppSelector(state => state.filters.amenities);

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-2">
      {amenityOptions.map(option => {
        const active = amenities.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={e => { e.stopPropagation(); dispatch(toggleAmenity(option)); }}
            className={`flex items-center gap-1 border px-2 py-1 text-sm rounded-full active:scale-95 transition ${
              active
                ? 'bg-primary text-white border-primary'
                : 'border-gray-500/30 text-gray-800 bg-white hover:text-primary hover:bg-primary/10 hover:border-primary/30'
            }`}
          >
            {active ? <FaCheck /> : <FaPlus />} {option}
          </button>
        );
      })}
    </div>
  )
}

export default Amenities
