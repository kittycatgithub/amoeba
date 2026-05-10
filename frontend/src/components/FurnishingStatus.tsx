import { FaPlus, FaCheck } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleFurnishing } from "../store/slices/filterSlice";

const furnishingOptions = ['Furnished', 'Semifurnished', 'Unfurnished'];

const FurnishingStatus = () => {
  const dispatch = useAppDispatch();
  const furnishing = useAppSelector(state => state.filters.furnishing);

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-2">
      {furnishingOptions.map(option => {
        const active = furnishing.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={e => { e.stopPropagation(); dispatch(toggleFurnishing(option)); }}
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

export default FurnishingStatus
