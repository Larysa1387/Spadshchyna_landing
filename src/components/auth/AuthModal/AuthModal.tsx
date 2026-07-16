import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, EyeIcon } from '@/components/icons';
import { paths } from '@/app/paths';
import { auth as authCopy } from '@/content/designContent';
import type { AuthModalMode } from '@/features/auth/authContext';
import styles from './AuthModal.module.scss';

type AuthModalProps = {
  mode: AuthModalMode;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => Promise<void>;
  onClearError: () => void;
};

export function AuthModal({
  mode,
  error,
  isSubmitting,
  onClose,
  onSwitchMode,
  onLogin,
  onRegister,
  onClearError,
}: AuthModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setShowPassword(false);
    onClearError();
  }, [mode, onClearError]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [mode]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'login') {
      await onLogin(email.trim(), password);
      return;
    }

    await onRegister({
      email: email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password,
    });
  };

  const copy = mode === 'login' ? authCopy.login : authCopy.register;

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={authCopy.close}
        >
          <CloseIcon />
        </button>

        <h2 id={titleId} className={styles.title}>
          {copy.title}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${mode}-email`}>
              {copy.email}
            </label>
            <input
              id={`${mode}-email`}
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {mode === 'register' && (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-first-name">
                  {authCopy.register.firstName}
                </label>
                <input
                  id="register-first-name"
                  className={styles.input}
                  type="text"
                  name="first_name"
                  autoComplete="given-name"
                  required
                  maxLength={100}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-last-name">
                  {authCopy.register.lastName}
                </label>
                <input
                  id="register-last-name"
                  className={styles.input}
                  type="text"
                  name="last_name"
                  autoComplete="family-name"
                  required
                  maxLength={100}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${mode}-password`}>
              {copy.password}
            </label>
            <div className={styles.passwordField}>
              <input
                id={`${mode}-password`}
                className={`${styles.input} ${styles.passwordInput}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                required
                minLength={mode === 'register' ? 8 : undefined}
                maxLength={mode === 'register' ? 128 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? authCopy.hidePassword : authCopy.showPassword
                }
              >
                <EyeIcon hidden={showPassword} />
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <Link
              className={styles.forgotLink}
              to={paths.forgotPassword}
              onClick={onClose}
            >
              {authCopy.login.forgotPassword}
            </Link>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {copy.submit}
          </button>
        </form>

        <p className={styles.footer}>
          {copy.footer}
          <button
            type="button"
            className={styles.footerLink}
            onClick={() =>
              onSwitchMode(mode === 'login' ? 'register' : 'login')
            }
          >
            {copy.footerLink}
          </button>
        </p>
      </div>
    </div>
  );
}
