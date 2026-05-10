import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  createdAt: string;
}

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Rehydrate from localStorage on load
const storedToken = localStorage.getItem('token');
const storedProfile = localStorage.getItem('userProfile');

const initialState: UserState = {
  isLoggedIn: !!storedToken,
  profile: storedProfile ? JSON.parse(storedProfile) : null,
  token: storedToken,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ profile: UserProfile; token: string }>) => {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userProfile', JSON.stringify(action.payload.profile));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
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
