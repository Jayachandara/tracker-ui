// Feature flags
export const FEATURES = {
  SHOW_SCROLLBARS: true,
  ENABLE_ANALYTICS: false,
};

// App constants
export const APP_NAME = 'Tracker';
export const APP_BASE_PATH = '/tracker';

// API constants
export const API_TIMEOUT = 30000;
export const API_RETRY_ATTEMPTS = 3;

// Storage keys
export const STORAGE_KEYS = {
  SCROLLBAR_PREFERENCE: 'tracker.showScrollbar',
  USER_PREFERENCES: 'tracker.preferences',
  AUTH_TOKEN: 'tracker.auth_token',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 25, 50, 100];

// Date formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  ISO: 'YYYY-MM-DD',
} as const;
