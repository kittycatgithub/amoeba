import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  websiteUrl?: string;
  avatar: string;
  createdAt: string;
}

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Rehydrate profile from localStorage on load
// Token is now an HTTP-only cookie — browser handles it automatically
const storedProfile = localStorage.getItem('userProfile');

const initialState: UserState = {
  isLoggedIn: !!storedProfile,   // logged in if we have a cached profile
  profile: storedProfile ? JSON.parse(storedProfile) : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ profile: UserProfile }>) => {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
      state.error = null;
      localStorage.setItem('userProfile', JSON.stringify(action.payload.profile));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      localStorage.removeItem('userProfile');
      // Cookie is cleared server-side via res.clearCookie() — nothing to do here
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        localStorage.setItem('userProfile', JSON.stringify(state.profile));
      }
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateProfile, setUserLoading, setUserError } = userSlice.actions;
export default userSlice.reducer;