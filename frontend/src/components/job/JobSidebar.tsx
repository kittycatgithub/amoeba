import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMaxCtc, setMinCtc, setStatus, toggleJobType, toggleLocation } from "../../store/slices/filterJobSlice";

const LOCATIONS = ['remote', 'hybrid', 'on-site'];

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contractual', label: 'Contractual / Temporary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' },
];

interface JobSidebarProps {
  isDrawer?: boolean;
}

const JobSidebar = ({ isDrawer }: JobSidebarProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.jobFilters);

  const sectionCls = isDrawer ? 'mb-6' : 'mb-6 pb-6 border-b border-gray-200';

  return (
    <div className={isDrawer ? '' : 'w-64 shrink-0 p-4 bg-white border-r border-gray-200 hidden lg:block'}>
      {/* Status */}
      <div className={sectionCls}>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Job Status</h4>
        <div className="flex gap-2 flex-wrap">
          {['open', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setStatus(filters.status === s ? '' : s))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer capitalize ${
                filters.status === s
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 text-gray-600 hover:border-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className={sectionCls}>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Location</h4>
        <div className="flex flex-col gap-2">
          {LOCATIONS.map((loc) => (
            <label key={loc} className="flex items-center gap-2 text-sm text-gray-600 capitalize cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={filters.location.includes(loc)}
                onChange={() => dispatch(toggleLocation(loc))}
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      {/* Job Types */}
      <div className={sectionCls}>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Job Type</h4>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map((jt) => (
            <label key={jt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={filters.jobTypes.includes(jt.value)}
                onChange={() => dispatch(toggleJobType(jt.value))}
              />
              {jt.label}
            </label>
          ))}
        </div>
      </div>

      {/* CTC Range */}
      <div className={sectionCls}>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">CTC Range (₹)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minCtc || ''}
            onChange={(e) => dispatch(setMinCtc(Number(e.target.value) || 0))}
            className="w-full px-2 py-1.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxCtc || ''}
            onChange={(e) => dispatch(setMaxCtc(Number(e.target.value) || 0))}
            className="w-full px-2 py-1.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default JobSidebar;