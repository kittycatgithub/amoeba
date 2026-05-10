import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Settings slice – app-wide user preferences.
 * On backend integration: add a saveSettingsThunk that calls PATCH /api/user/settings.
 */
interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  priceAlerts: boolean;
  newListings: boolean;
}

interface SettingsState {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  currency: '₹',
  language: 'en',
  theme: 'light',
  notifications: {
    email: true,
    sms: false,
    push: true,
    priceAlerts: true,
    newListings: true,
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSettingsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrency, setLanguage, setTheme,
  updateNotifications, setSettingsLoading, setSettingsError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
