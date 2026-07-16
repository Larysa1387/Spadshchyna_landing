import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { paths } from '@/app/paths';
import { PasswordField } from '@/components/auth/PasswordField/PasswordField';
import { auth as authCopy } from '@/content/designContent';
import { useAuth } from '@/features/auth/useAuth';
import styles from './ResetPasswordPage.module.scss';

const copy = authCopy.resetPasswordPage;
const CODE_PATTERN = /^\d{6}$/;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openLoginModal } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!CODE_PATTERN.test(code)) {
      setError(copy.invalidCode);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email: email.trim(),
        code,
        new_password: newPassword,
      });
      setIsSuccess(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to reset password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    navigate(paths.home);
    openLoginModal();
  };

  return (
    <section className={styles.page} aria-labelledby="reset-password-title">
      <div className={styles.card}>
        {isSuccess ? (
          <>
            <h1 id="reset-password-title" className={styles.title}>
              {copy.successTitle}
            </h1>
            <p className={styles.success} role="status">
              {copy.success}
            </p>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSignIn}
            >
              {copy.signIn}
            </button>
          </>
        ) : (
          <>
            <h1 id="reset-password-title" className={styles.title}>
              {copy.title}
            </h1>
            <p className={styles.description}>{copy.description}</p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-password-email">
                  {copy.email}
                </label>
                <input
                  id="reset-password-email"
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-password-code">
                  {copy.code}
                </label>
                <input
                  id="reset-password-code"
                  className={`${styles.input} ${styles.codeInput}`}
                  type="text"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  pattern="\d{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                />
                <p className={styles.hint}>{copy.codeHint}</p>
              </div>

              <PasswordField
                id="reset-password-new"
                label={copy.newPassword}
                value={newPassword}
                minLength={8}
                maxLength={128}
                onChange={setNewPassword}
              />

              <PasswordField
                id="reset-password-confirm"
                label={copy.confirmPassword}
                value={confirmPassword}
                minLength={8}
                maxLength={128}
                onChange={setConfirmPassword}
              />

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

            <div className={styles.footer}>
              <Link className={styles.footerLink} to={paths.forgotPassword}>
                {copy.backToRequest}
              </Link>
              <button
                type="button"
                className={styles.footerLinkButton}
                onClick={handleSignIn}
              >
                {authCopy.forgotPasswordPage.backToSignIn}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
