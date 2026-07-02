import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './authStorage';
import type { ApiErrorDetail, TokenResponse } from './types';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  const { data } = await axios.post<TokenResponse>(
    `${API_BASE_URL}/api/v1/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );

  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

function shouldAttemptTokenRefresh(url?: string): boolean {
  if (!url) {
    return true;
  }

  return (
    !url.includes('/auth/login') &&
    !url.includes('/auth/register') &&
    !url.includes('/auth/refresh')
  );
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!shouldAttemptTokenRefresh(config.url)) {
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      clearTokens();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(config);
    } catch (refreshError) {
      clearTokens();
      return Promise.reject(refreshError);
    }
  },
);

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

export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}
