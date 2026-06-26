import { useEffect, useId, useRef, useState } from 'react';
import styles from './ArchiveFilters.module.scss';

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  id: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function FilterSelect({
  id,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`${styles.selectWrap}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        id={id}
        className={`${styles.selectTrigger}${open ? ` ${styles.selectTriggerOpen}` : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className={styles.selectValue}>{selectedOption?.label}</span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className={styles.selectList}
          aria-labelledby={id}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li
                key={option.value || 'empty'}
                role="option"
                aria-selected={isSelected}
                className={`${styles.selectOption}${isSelected ? ` ${styles.selectOptionActive}` : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
