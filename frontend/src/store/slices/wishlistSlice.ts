import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';  // ← your configured instance (withCredentials: true)
import toast from 'react-hot-toast';

/**
 * Wishlist slice – stores property IDs the user has hearted.
 * When the backend is ready, replace the reducers below with
 * createAsyncThunk actions (fetchWishlist, addToWishlist, removeFromWishlist).
 */

// ─── Thunks ───────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // const { data } = await api.get(`${import.meta.env.VITE_API_URL}/api/users/wishlist`);
      const { data } = await api.get(`/api/users/wishlist`);
      return data.wishlist as string[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      // await api.post(`${import.meta.env.VITE_API_URL}/api/users/wishlist/${propertyId}`);
      await api.post(`/api/users/wishlist/${propertyId}`);
      toast.success('Property added to wishlist')
      return propertyId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to add');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (propertyId: string, { rejectWithValue }) => {
    
    try {
      // await api.delete(`${import.meta.env.VITE_API_URL}/api/users/wishlist/${propertyId}`);
      await api.delete(`/api/users/wishlist/${propertyId}`);
      toast.success('Property removed from wishlist')
      return propertyId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to remove');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

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
    clearWishlist: (state) => {
      state.ids = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ── fetchWishlist ──────────────────────────────────────
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── addToWishlist ──────────────────────────────────────
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.ids.includes(action.payload)) {
          state.ids.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // ── removeFromWishlist ─────────────────────────────────
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.ids = state.ids.filter(id => id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Notes
/*

 Standard DB Schema first
 Wishlist document (MongoDB)
{
  _id: ObjectId,
  user:     ObjectId,   // ref: 'User'
  property: ObjectId,   // ref: 'Property'
  createdAt: Date,
}
Compound unique index:  { user: 1, property: 1 }

*/