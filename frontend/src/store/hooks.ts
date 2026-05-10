import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Typed dispatch hook – use instead of plain useDispatch for full TS support */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed selector hook – use instead of plain useSelector for full TS support */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
