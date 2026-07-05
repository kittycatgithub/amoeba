import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface JobFilterState {
  searchQuery: string;
  status: string;
  location: string[];
  jobTypes: string[];
  skills: string[];
  minCtc: number;
  maxCtc: number;
}

const initialState: JobFilterState = {
  searchQuery: '',
  status: '',
  location: [],
  jobTypes: [],
  skills: [],
  minCtc: 0,
  maxCtc: 0,
};

const jobFilterSlice = createSlice({
  name: 'jobFilters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    toggleLocation: (state, action: PayloadAction<string>) => {
      state.location = state.location.includes(action.payload)
        ? state.location.filter((l) => l !== action.payload)
        : [...state.location, action.payload];
    },
    toggleJobType: (state, action: PayloadAction<string>) => {
      state.jobTypes = state.jobTypes.includes(action.payload)
        ? state.jobTypes.filter((t) => t !== action.payload)
        : [...state.jobTypes, action.payload];
    },
    toggleSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.includes(action.payload)
        ? state.skills.filter((s) => s !== action.payload)
        : [...state.skills, action.payload];
    },
    setMinCtc: (state, action: PayloadAction<number>) => {
      state.minCtc = action.payload;
    },
    setMaxCtc: (state, action: PayloadAction<number>) => {
      state.maxCtc = action.payload;
    },
    setJobFilters: (state, action: PayloadAction<Partial<JobFilterState>>) => {
      return { ...state, ...action.payload };
    },
    resetJobFilters: () => initialState,
  },
});

export const {
  setSearchQuery,
  setStatus,
  toggleLocation,
  toggleJobType,
  toggleSkill,
  setMinCtc,
  setMaxCtc,
  setJobFilters,
  resetJobFilters,
} = jobFilterSlice.actions;

export default jobFilterSlice.reducer;