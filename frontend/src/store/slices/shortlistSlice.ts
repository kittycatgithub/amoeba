import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Shortlist slice – stores property IDs the user has bookmarked for comparison.
 * When the backend is ready, replace reducers with createAsyncThunk actions.
 */
interface ShortlistState {
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ShortlistState = {
  ids: [],
  loading: false,
  error: null,
};

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState,
  reducers: {
    toggleShortlistItem: (state, action: PayloadAction<string>) => {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(action.payload);
    },
    clearShortlist: (state) => {
      state.ids = [];
    },
    // API-ready hooks
    setShortlistIds: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
    setShortlistLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShortlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  toggleShortlistItem, clearShortlist,
  setShortlistIds, setShortlistLoading, setShortlistError,
} = shortlistSlice.actions;

export default shortlistSlice.reducer;
