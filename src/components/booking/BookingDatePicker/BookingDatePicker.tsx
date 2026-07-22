import { useEffect, useId, useRef, useState } from 'react';
import { CalendarIcon, ChevronIcon } from '@/components/icons';
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
  popupPosition?: 'below' | 'above';
  popupAlign?: 'start' | 'end';
  onChange: (value: string) => void;
};

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
  popupPosition = 'below',
  popupAlign = 'start',
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
    <div
      ref={rootRef}
      className={[styles.root, open && styles.rootOpen]
        .filter(Boolean)
        .join(' ')}
    >
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
          <CalendarIcon size={16} />
        </span>
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={label}
          className={[
            styles.popup,
            popupPosition === 'above' && styles.popupAbove,
            popupAlign === 'end' && styles.popupEnd,
          ]
            .filter(Boolean)
            .join(' ')}
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
