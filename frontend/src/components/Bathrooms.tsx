import { FaPlus, FaCheck } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleBathroom } from "../store/slices/filterSlice";

const bathroomOptions = [1, 2, 3, 4, 5];

const Bathrooms = () => {
  const dispatch = useAppDispatch();
  const bathrooms = useAppSelector(state => state.filters.bathrooms);

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-2">
      {bathroomOptions.map(value => {
        const active = bathrooms.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={e => { e.stopPropagation(); dispatch(toggleBathroom(value)); }}
            className={`flex items-center gap-1 border px-2 py-1 text-sm rounded-full active:scale-95 transition ${
              active
                ? 'bg-primary text-white border-primary'
                : 'border-gray-500/30 text-gray-800 bg-white hover:text-primary hover:bg-primary/10 hover:border-primary/30'
            }`}
          >
            {active ? <FaCheck /> : <FaPlus />} {value}{value === 5 ? '+' : ''}
          </button>
        );
      })}
    </div>
  )
}

export default Bathrooms
