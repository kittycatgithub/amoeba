import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMinArea, setMaxArea } from "../store/slices/filterSlice";
import DualRangeSlider from "./DualRangeSlider";

/** Non-linear steps in Sqft matching Indian property size distribution */
export const AREA_STEPS = [0, 250, 400, 500, 600, 750, 900, 1000, 1200, 1500, 1750, 2000, 2500, 3000, 4000, 5000];

export const formatArea = (v: number, isMax = false): string => {
  if (v === 0) return isMax ? '5000+ Sqft' : '0 Sqft';
  if (v >= 5000 && isMax) return '5000+ Sqft';
  return `${v.toLocaleString('en-IN')} Sqft`;
};

const findClosestIdx = (val: number) => {
  let idx = 0;
  let best = Math.abs(AREA_STEPS[0] - val);
  for (let i = 1; i < AREA_STEPS.length; i++) {
    const d = Math.abs(AREA_STEPS[i] - val);
    if (d < best) { best = d; idx = i; }
  }
  return idx;
};

const AreaRangeFilter = () => {
  const dispatch = useAppDispatch();
  const minArea = useAppSelector(state => state.filters.minArea);
  const maxArea = useAppSelector(state => state.filters.maxArea);

  const minIdx = findClosestIdx(minArea);
  const maxIdx = maxArea === 0 ? AREA_STEPS.length - 1 : findClosestIdx(maxArea);

  return (
    <DualRangeSlider
      steps={AREA_STEPS}
      minIdx={minIdx}
      maxIdx={maxIdx}
      onMinChange={i => dispatch(setMinArea(AREA_STEPS[i]))}
      onMaxChange={i => dispatch(setMaxArea(i === AREA_STEPS.length - 1 ? 0 : AREA_STEPS[i]))}
      formatLabel={formatArea}
    />
  );
};

export default AreaRangeFilter;

