import { useEffect, useId, useRef, useState } from 'react';
import { formatDisplayDate, todayIso } from '@/lib/format';
import {
  buildCalendarGrid,
  compareIsoDates,
  monthLabel,
  parseIsoDate,
} from '@/lib/calendar';
import styles from './BookingDatePicker.module.scss';

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

type BookingDatePickerProps = {
  label: string;
  value: string;
  min: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.25v1.25M11.5 2.25v1.25M3.25 5.75h9.5M3.25 4h9.5a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d={
          direction === 'left'
            ? 'M10 3.5 5.5 8 10 12.5'
            : 'M6 3.5 10.5 8 6 12.5'
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getViewMonth(value: string, min: string) {
  const source = value || min || todayIso();
  const { year, month } = parseIsoDate(source);
  return { year, month };
}

export function BookingDatePicker({
  label,
  value,
  min,
  placeholder,
  disabled = false,
  onChange,
}: BookingDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => getViewMonth(value, min).year);
  const [viewMonth, setViewMonth] = useState(
    () => getViewMonth(value, min).month,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const today = todayIso();
  const displayValue = value ? formatDisplayDate(value) : placeholder;
  const triggerLabel = `${label}: ${value ? formatDisplayDate(value) : placeholder}`;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const nextView = getViewMonth(value, min);
    setViewYear(nextView.year);
    setViewMonth(nextView.month);

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
  }, [min, open, value]);

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  const handleSelectToday = () => {
    if (compareIsoDates(today, min) < 0) {
      return;
    }

    onChange(today);
    setOpen(false);
  };

  const showPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewYear((current) => current - 1);
      setViewMonth(11);
      return;
    }

    setViewMonth((current) => current - 1);
  };

  const showNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((current) => current + 1);
      setViewMonth(0);
      return;
    }

    setViewMonth((current) => current + 1);
  };

  const selectDate = (iso: string) => {
    onChange(iso);
    setOpen(false);
  };

  const days = buildCalendarGrid(viewYear, viewMonth);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className={styles.triggerLabel}>{label}</span>
        <span className={styles.triggerValue}>
          <span className={value ? undefined : styles.triggerPlaceholder}>
            {displayValue}
          </span>
          <CalendarIcon />
        </span>
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={label}
          className={styles.popup}
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={showPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronIcon direction="left" />
            </button>
            <p className={styles.monthLabel}>
              {monthLabel(viewYear, viewMonth)}
            </p>
            <button
              type="button"
              className={styles.navBtn}
              onClick={showNextMonth}
              aria-label="Next month"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          <div className={styles.weekdays} aria-hidden>
            {WEEKDAY_LABELS.map((weekday) => (
              <span key={weekday} className={styles.weekday}>
                {weekday}
              </span>
            ))}
          </div>

          <div className={styles.grid} role="grid" aria-label={label}>
            {days.map((day) => {
              const isSelected = value === day.iso;
              const isToday = today === day.iso;
              const isDisabled = compareIsoDates(day.iso, min) < 0;

              return (
                <button
                  key={day.iso}
                  type="button"
                  role="gridcell"
                  className={[
                    styles.day,
                    !day.inMonth && styles.dayOutside,
                    isSelected && styles.daySelected,
                    isToday && styles.dayToday,
                    isDisabled && styles.dayDisabled,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={isDisabled}
                  aria-selected={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => selectDate(day.iso)}
                >
                  {day.date.day}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.footerBtn}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className={styles.footerBtn}
              disabled={compareIsoDates(today, min) < 0}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleSelectToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
