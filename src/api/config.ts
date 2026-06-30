const DEFAULT_API_BASE_URL = 'https://spadshchyna-teamproject.duckdns.org';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : DEFAULT_API_BASE_URL);
