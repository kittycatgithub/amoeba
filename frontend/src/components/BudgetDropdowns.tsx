import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMinBudget, setMaxBudget } from "../store/slices/filterSlice";
import DualRangeSlider from "./DualRangeSlider";

/** Non-linear steps in Lakhs matching Indian RE price distribution */
export const BUDGET_STEPS = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500];

export const formatBudget = (v: number, isMax = false): string => {
  if (v === 0) return isMax ? '₹5 Cr+' : '₹0';
  if (v < 100) return `₹${v} Lac`;
  const cr = v / 100;
  return `₹${Number.isInteger(cr) ? cr : cr.toFixed(2)} Cr`;
};

const findClosestIdx = (val: number) => {
  let idx = 0;
  let best = Math.abs(BUDGET_STEPS[0] - val);
  for (let i = 1; i < BUDGET_STEPS.length; i++) {
    const d = Math.abs(BUDGET_STEPS[i] - val);
    if (d < best) { best = d; idx = i; }
  }
  return idx;
};

const BudgetDropdowns = () => {
  const dispatch = useAppDispatch();
  const minBudget = useAppSelector(state => state.filters.minBudget);
  const maxBudget = useAppSelector(state => state.filters.maxBudget);

  const minIdx = findClosestIdx(minBudget);
  const maxIdx = maxBudget === 0 ? BUDGET_STEPS.length - 1 : findClosestIdx(maxBudget);

  return (
    <DualRangeSlider
      steps={BUDGET_STEPS}
      minIdx={minIdx}
      maxIdx={maxIdx}
      onMinChange={i => dispatch(setMinBudget(BUDGET_STEPS[i]))}
      onMaxChange={i => dispatch(setMaxBudget(i === BUDGET_STEPS.length - 1 ? 0 : BUDGET_STEPS[i]))}
      formatLabel={formatBudget}
    />
  );
};

export default BudgetDropdowns;
