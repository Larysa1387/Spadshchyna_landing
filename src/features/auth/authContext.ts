import { createContext } from 'react';
import type { LoginRequest, RegisterRequest, UserResponse } from '@/api/types';

export type AuthModalMode = 'login' | 'register';

export type AuthContextValue = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  authModal: AuthModalMode | null;
  authError: string | null;
  isSubmitting: boolean;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  switchAuthModal: (mode: AuthModalMode) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
