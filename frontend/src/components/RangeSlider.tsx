// ─── Reusable dual-thumb range slider ─────────────────────────────────────────

function RangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
}) {
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="relative h-5 flex items-center">
      {/* Track background */}
      <div className="absolute w-full h-0.5 bg-gray-200 rounded-full" />

      {/* Highlighted range between thumbs */}
      <div
        className="absolute h-0.5 bg-primary rounded-full"
        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
      />

      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(e) => {
          const val = Math.min(Number(e.target.value), maxVal - 1);
          onMinChange(val);
        }}
        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
        style={{ zIndex: minVal > max - 5 ? 5 : 3 }}
      />

      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(e) => {
          const val = Math.max(Number(e.target.value), minVal + 1);
          onMaxChange(val);
        }}
        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}

export default RangeSlider