import { useId, useState } from 'react';
import { auth as authCopy } from '@/content/designContent';
import styles from './PasswordField.module.scss';

type PasswordFieldProps = {
  id?: string;
  label: string;
  value: string;
  autoComplete?: 'new-password' | 'current-password';
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  onChange: (value: string) => void;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
        <path
          d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="10"
          cy="10"
          r="2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M4 4l12 12"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="10"
        cy="10"
        r="2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function PasswordField({
  id,
  label,
  value,
  autoComplete = 'new-password',
  minLength,
  maxLength,
  required = true,
  onChange,
}: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
      </label>
      <div className={styles.passwordField}>
        <input
          id={fieldId}
          className={`${styles.input} ${styles.passwordInput}`}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
  );
}
