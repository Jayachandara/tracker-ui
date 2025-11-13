import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    open: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  error: null,
  notification: {
    message: '',
    type: 'info',
    open: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
      }>
    ) => {
      state.notification = {
        ...action.payload,
        open: true,
      };
    },
    closeNotification: (state) => {
      state.notification.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  setError,
  showNotification,
  closeNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
