import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPropertiesApi, type PropertyFilters } from '../../api/propertyApi';

// ─── Types ────────────────────────────────────────────────

export interface FetchPropertiesParams {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  search?: string;
  minBudget?: number;
  maxBudget?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: string;
  propertyTypes?: string;
  furnishing?: string;
  postedBy?: string;
  bathrooms?: string;
  amenities?: string;
  availableFor?: string;
  availability?: string;
}

// ─── Thunk ────────────────────────────────────────────────

export const fetchProperties = createAsyncThunk(
  'property/fetchAll',
  async (filters: PropertyFilters | undefined = {}, { rejectWithValue }) => {
    try {
      const { data } = await getPropertiesApi(filters); // pass object directly
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch properties');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

interface PropertyState {
  properties: any[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default propertySlice.reducer;