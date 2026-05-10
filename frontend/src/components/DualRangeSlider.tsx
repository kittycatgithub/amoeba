/**
 * DualRangeSlider
 * Non-linear dual-thumb range slider using an index-based step array.
 * Requires .range-thumb CSS class (defined in index.css).
 */
interface Props {
  steps: number[];
  minIdx: number;
  maxIdx: number;
  onMinChange: (i: number) => void;
  onMaxChange: (i: number) => void;
  formatLabel: (v: number, isMax?: boolean) => string;
}

const DualRangeSlider = ({ steps, minIdx, maxIdx, onMinChange, onMaxChange, formatLabel }: Props) => {
  const last = steps.length - 1;
  const minPct = (minIdx / last) * 100;
  const maxPct = (maxIdx / last) * 100;

  return (
    <div className="px-1 select-none" onClick={e => e.stopPropagation()}>
      {/* Current selected values */}
      <div className="flex justify-between text-xs font-semibold text-primary mb-3">
        <span className="bg-primary/5 px-2 py-0.5 rounded">{formatLabel(steps[minIdx])}</span>
        <span className="bg-primary/5 px-2 py-0.5 rounded">{formatLabel(steps[maxIdx], true)}</span>
      </div>

      {/* Track + thumbs container */}
      <div className="relative h-4 flex items-center">
        {/* Background track */}
        <div className="absolute w-full h-1 rounded-full bg-gray-200" />
        {/* Filled range */}
        <div
          className="absolute h-1 rounded-full bg-primary"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={0}
          max={last}
          value={minIdx}
          onChange={e => onMinChange(Math.min(Number(e.target.value), maxIdx - 1))}
          className="range-thumb"
          style={{ zIndex: minIdx > last / 2 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={0}
          max={last}
          value={maxIdx}
          onChange={e => onMaxChange(Math.max(Number(e.target.value), minIdx + 1))}
          className="range-thumb"
          style={{ zIndex: minIdx > last / 2 ? 3 : 5 }}
        />
      </div>

      {/* Scale endpoints */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{formatLabel(steps[0])}</span>
        <span>{formatLabel(steps[last], true)}</span>
      </div>
    </div>
  );
};

export default DualRangeSlider;
