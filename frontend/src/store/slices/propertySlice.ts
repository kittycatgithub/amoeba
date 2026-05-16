import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPropertiesApi } from '../../api/propertyApi';

// ─── Thunk ────────────────────────────────────────────────

export const fetchProperties = createAsyncThunk(
  'property/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getPropertiesApi();
      return data.properties;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch properties');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

interface PropertyState {
  properties: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
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
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default propertySlice.reducer;