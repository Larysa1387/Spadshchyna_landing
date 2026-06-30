import axios from 'axios';
import { API_BASE_URL } from './config';
import { getAccessToken } from './authStorage';
import type { ApiErrorDetail } from './types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const detail = (error.response?.data as ApiErrorDetail | undefined)?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail[0]?.msg) {
    return detail[0].msg;
  }

  if (error.response?.status === 401) {
    return 'Please log in to continue.';
  }

  return fallback;
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
