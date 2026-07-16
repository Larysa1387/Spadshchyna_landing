import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { paths } from '@/app/paths';
import { auth as authCopy } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import styles from './ForgotPasswordPage.module.scss';

const copy = authCopy.forgotPasswordPage;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { openLoginModal } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    try {
      await forgotPassword({ email: trimmedEmail });
      setIsSuccess(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to send reset code.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    const params = new URLSearchParams({ email: email.trim() });
    navigate(`${paths.resetPassword}?${params.toString()}`);
  };

  const handleBackToSignIn = () => {
    navigate(paths.home);
    openLoginModal();
  };

  return (
    <section className={styles.page} aria-labelledby="forgot-password-title">
      <div className={styles.card}>
        <h1 id="forgot-password-title" className={styles.title}>
          {copy.title}
        </h1>
        <p className={styles.description}>{copy.description}</p>

        {isSuccess ? (
          <>
            <p className={styles.success} role="status">
              {copy.success}
            </p>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleContinue}
            >
              {copy.continue}
            </button>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="forgot-password-email">
                {copy.email}
              </label>
              <input
                id="forgot-password-email"
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

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
        )}

        <p className={styles.footer}>
          <button
            type="button"
            className={styles.footerLink}
            onClick={handleBackToSignIn}
          >
            {copy.backToSignIn}
          </button>
        </p>
      </div>
    </section>
  );
}
