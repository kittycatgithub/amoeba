import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

interface AdminState {
  isAdminLoggedIn: boolean;
  profile: AdminProfile | null;
  adminToken: string | null;
  loading: boolean;
  error: string | null;
}

// Rehydrate from localStorage on load (separate keys from user)
const storedAdminToken = localStorage.getItem('adminToken');
const storedAdminProfile = localStorage.getItem('adminProfile');

const initialState: AdminState = {
  isAdminLoggedIn: !!storedAdminToken,
  profile: storedAdminProfile ? JSON.parse(storedAdminProfile) : null,
  adminToken: storedAdminToken,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginSuccess: (
      state,
      action: PayloadAction<{ profile: AdminProfile; adminToken: string }>
    ) => {
      state.isAdminLoggedIn = true;
      state.profile = action.payload.profile;
      state.adminToken = action.payload.adminToken;
      state.error = null;
      localStorage.setItem('adminToken', action.payload.adminToken);
      localStorage.setItem('adminProfile', JSON.stringify(action.payload.profile));
    },
    adminLogout: (state) => {
      state.isAdminLoggedIn = false;
      state.profile = null;
      state.adminToken = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminProfile');
    },
    updateAdminProfile: (state, action: PayloadAction<Partial<AdminProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        localStorage.setItem('adminProfile', JSON.stringify(state.profile));
      }
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  adminLoginSuccess,
  adminLogout,
  updateAdminProfile,
  setAdminLoading,
  setAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;