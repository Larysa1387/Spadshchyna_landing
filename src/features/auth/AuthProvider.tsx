import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '@/api/auth';
import {
  clearTokens,
  isAuthenticated as hasStoredToken,
} from '@/api/authStorage';
import { getApiErrorMessage } from '@/api/client';
import type { LoginRequest, RegisterRequest } from '@/api/types';
import { AuthModal } from '@/components/auth/AuthModal/AuthModal';
import { AuthContext, type AuthModalMode } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof getCurrentUser>
  > | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModalMode | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!hasStoredToken()) {
        if (!cancelled) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        clearTokens();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthError(null);
    setAuthModal('login');
  }, []);

  const openRegisterModal = useCallback(() => {
    setAuthError(null);
    setAuthModal('register');
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
    setAuthError(null);
  }, []);

  const switchAuthModal = useCallback((mode: AuthModalMode) => {
    setAuthError(null);
    setAuthModal(mode);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const completeAuth = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setAuthModal(null);
    setAuthError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsSubmitting(true);
      setAuthError(null);

      try {
        await loginRequest(credentials);
        await completeAuth();
      } catch (requestError) {
        setAuthError(getApiErrorMessage(requestError, 'Unable to sign in.'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [completeAuth],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      setIsSubmitting(true);
      setAuthError(null);

      try {
        await registerRequest(payload);
        await completeAuth();
      } catch (requestError) {
        setAuthError(
          getApiErrorMessage(requestError, 'Unable to create account.'),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [completeAuth],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      clearTokens();
    } finally {
      setUser(null);
      setAuthError(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      authModal,
      authError,
      isSubmitting,
      openLoginModal,
      openRegisterModal,
      closeAuthModal,
      switchAuthModal,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [
      user,
      isInitializing,
      authModal,
      authError,
      isSubmitting,
      openLoginModal,
      openRegisterModal,
      closeAuthModal,
      switchAuthModal,
      login,
      register,
      logout,
      clearAuthError,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {authModal && (
        <AuthModal
          mode={authModal}
          error={authError}
          isSubmitting={isSubmitting}
          onClose={closeAuthModal}
          onSwitchMode={switchAuthModal}
          onLogin={async (email, password) => login({ email, password })}
          onRegister={register}
          onClearError={clearAuthError}
        />
      )}
    </AuthContext.Provider>
  );
}
