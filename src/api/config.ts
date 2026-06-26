const DEFAULT_API_BASE_URL = 'http://spadshchyna-teamproject.duckdns.org:8000';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : DEFAULT_API_BASE_URL);
