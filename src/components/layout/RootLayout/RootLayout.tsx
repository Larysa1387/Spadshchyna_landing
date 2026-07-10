import { Outlet } from 'react-router-dom';
import { AuthModal } from '@/components/auth/AuthModal/AuthModal';
import { useAuth } from '@/features/auth/useAuth';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './RootLayout.module.scss';

export function RootLayout() {
  const {
    authModal,
    authError,
    isSubmitting,
    closeAuthModal,
    switchAuthModal,
    login,
    register,
    clearAuthError,
  } = useAuth();

  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
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
    </div>
  );
}
