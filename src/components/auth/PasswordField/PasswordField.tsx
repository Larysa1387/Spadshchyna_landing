import { useId, useState } from 'react';
import { EyeIcon } from '@/components/icons';
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
