import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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

// ─── Thunks ──────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk( 
  'wishlist/fetch', async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get('API')
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch wishlist');      
    }
  }
 )

export const addToWishlist = createAsyncThunk(
  'wishlist/add', async ( propertyId: string, { rejectWithValue } ) => {
    try {
      await axios.post('API');
      return propertyId; // return the id to add it in state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to add to wishlist');      
    }
  }
)

export const removeFromWishlist = createAsyncThunk( 
  'wishlist/remove', async (propertyId: string, { rejectWithValue })=> {
     try {
      await axios.delete('API')
      return propertyId;                  // return the id to remove it from state
     } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to remove from wishlist');      
     }
  }
 )

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