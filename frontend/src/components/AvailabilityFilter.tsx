import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleAvailability } from "../store/slices/filterSlice";

const options = [
  "Ready to Move",
  "Within 6 Months",
  "Within 1 Year",
  "More Than 1 Year",
];

const AvailabilityFilter = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.filters.availability);

  return (
    <div className="space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <label
            key={opt}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className={active ? "text-primary font-medium" : "text-gray-700 group-hover:text-gray-900"}>
              {opt}
            </span>
            <span
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                active ? "bg-primary border-primary" : "border-gray-300"
              }`}
              onClick={() => dispatch(toggleAvailability(opt))}
            >
              {active && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default AvailabilityFilter;
