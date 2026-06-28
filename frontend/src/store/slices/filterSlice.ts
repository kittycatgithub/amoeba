import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  category: string;       // '' = all | 'Buy' | 'Rent' | 'Commercial' | 'Plots/Land' | 'Projects' | 'New Launch'
  searchQuery: string;
  city: string;
  minBudget: number;      // in Lakhs (0 = no lower bound)
  maxBudget: number;      // in Lakhs (0 = no upper bound)
  bedrooms: number[];
  propertyTypes: string[];
  furnishing: string[];
  postedBy: string[];
  bathrooms: number[];
  amenities: string[];
  availableFor: string[];
  availability: string[];  // possession status: 'Ready to Move' | 'Within 6 Months' | 'Within 1 Year' | 'More Than 1 Year'
  minArea: number;         // sq ft (0 = no lower bound)
  maxArea: number;         // sq ft (0 = no upper bound)
}

const initialState: FilterState = {
  category: '',
  searchQuery: '',
  city: '',
  minBudget: 0,
  maxBudget: 0,
  bedrooms: [],
  propertyTypes: [],
  furnishing: [],
  postedBy: [],
  bathrooms: [],
  amenities: [],
  availableFor: [],
  availability: [],
  minArea: 0,
  maxArea: 0,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setMinBudget: (state, action: PayloadAction<number>) => {
      state.minBudget = action.payload;
    },
    setMaxBudget: (state, action: PayloadAction<number>) => {
      state.maxBudget = action.payload;
    },
    toggleBedroom: (state, action: PayloadAction<number>) => {
      const idx = state.bedrooms.indexOf(action.payload);
      if (idx >= 0) state.bedrooms.splice(idx, 1);
      else state.bedrooms.push(action.payload);
    },
    togglePropertyType: (state, action: PayloadAction<string>) => {
      const idx = state.propertyTypes.indexOf(action.payload);
      if (idx >= 0) state.propertyTypes.splice(idx, 1);
      else state.propertyTypes.push(action.payload);
    },
    toggleFurnishing: (state, action: PayloadAction<string>) => {
      const idx = state.furnishing.indexOf(action.payload);
      if (idx >= 0) state.furnishing.splice(idx, 1);
      else state.furnishing.push(action.payload);
    },
    togglePostedBy: (state, action: PayloadAction<string>) => {
      const idx = state.postedBy.indexOf(action.payload);
      if (idx >= 0) state.postedBy.splice(idx, 1);
      else state.postedBy.push(action.payload);
    },
    toggleBathroom: (state, action: PayloadAction<number>) => {
      const idx = state.bathrooms.indexOf(action.payload);
      if (idx >= 0) state.bathrooms.splice(idx, 1);
      else state.bathrooms.push(action.payload);
    },
    toggleAmenity: (state, action: PayloadAction<string>) => {
      const idx = state.amenities.indexOf(action.payload);
      if (idx >= 0) state.amenities.splice(idx, 1);
      else state.amenities.push(action.payload);
    },
    toggleAvailableFor: (state, action: PayloadAction<string>) => {
      const idx = state.availableFor.indexOf(action.payload);
      if (idx >= 0) state.availableFor.splice(idx, 1);
      else state.availableFor.push(action.payload);
    },
    toggleAvailability: (state, action: PayloadAction<string>) => {
      const idx = state.availability.indexOf(action.payload);
      if (idx >= 0) state.availability.splice(idx, 1);
      else state.availability.push(action.payload);
    },
    setMinArea: (state, action: PayloadAction<number>) => {
      state.minArea = action.payload;
    },
    setMaxArea: (state, action: PayloadAction<number>) => {
      state.maxArea = action.payload;
    },
    // Bulk-set any subset of filters — used by SearchPage to hydrate state
    // from URL query params on mount (so shared links and back-button work).
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCategory, setSearchQuery, setCity,
  setMinBudget, setMaxBudget,
  toggleBedroom, togglePropertyType, toggleFurnishing,
  togglePostedBy, toggleBathroom, toggleAmenity, toggleAvailableFor,
  toggleAvailability, setMinArea, setMaxArea,
  setFilters,   // ← new
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;