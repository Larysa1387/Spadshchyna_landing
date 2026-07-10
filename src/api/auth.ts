import { apiClient } from './client';
import { clearTokens, setTokens } from './authStorage';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse,
  UserResponse,
} from './types';

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>(
    '/api/v1/auth/login',
    credentials,
  );
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function register(
  payload: RegisterRequest,
): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>(
    '/api/v1/auth/register',
    payload,
  );
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout');
  } finally {
    clearTokens();
  }
}

export async function getCurrentUser(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>('/api/v1/auth/me');
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/api/v1/auth/forgot-password',
    payload,
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/api/v1/auth/reset-password',
    payload,
  );
  return data;
}
