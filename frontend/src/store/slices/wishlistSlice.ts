import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Wishlist slice – stores property IDs the user has hearted.
 * When the backend is ready, replace the reducers below with
 * createAsyncThunk actions (fetchWishlist, addToWishlist, removeFromWishlist).
 */
interface WishlistState {
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  ids: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(action.payload);
    },
    clearWishlist: (state) => {
      state.ids = [];
    },
    // API-ready hooks
    setWishlistIds: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  toggleWishlistItem, clearWishlist,
  setWishlistIds, setWishlistLoading, setWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
