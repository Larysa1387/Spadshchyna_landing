import { parseIsoDate, toIsoDateLocal } from './calendar';

export function formatUah(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} UAH`;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  return `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}`;
}

export function addDays(isoDate: string, days: number): string {
  const parts = parseIsoDate(isoDate);
  const date = new Date(parts.year, parts.month, parts.day);
  date.setDate(date.getDate() + days);

  return toIsoDateLocal({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  });
}

export function todayIso(): string {
  const now = new Date();

  return toIsoDateLocal({
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  });
}

export function bookingNights(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  const startDate = new Date(start.year, start.month, start.day);
  const endDate = new Date(end.year, end.month, end.day);
  const diff = endDate.getTime() - startDate.getTime();

  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function formatCompactDateRange(
  checkIn: string,
  checkOut: string,
): string {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });

  if (startMonth === endMonth) {
    return `${start.getDate()}-${end.getDate()} ${endMonth}`;
  }

  return `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}`;
}
