type DateParts = {
  year: number;
  month: number;
  day: number;
};

type CalendarDay = {
  date: DateParts;
  iso: string;
  inMonth: boolean;
};

export function parseIsoDate(iso: string): DateParts {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month: month - 1, day };
}

export function toIsoDateLocal(parts: DateParts): string {
  const month = String(parts.month + 1).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
}

function compareDates(a: DateParts, b: DateParts): number {
  if (a.year !== b.year) {
    return a.year - b.year;
  }

  if (a.month !== b.month) {
    return a.month - b.month;
  }

  return a.day - b.day;
}

export function compareIsoDates(a: string, b: string): number {
  return compareDates(parseIsoDate(a), parseIsoDate(b));
}

export function monthLabel(
  year: number,
  month: number,
  locale = 'en-US',
): string {
  return new Date(year, month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const gridStart = new Date(year, month, 1 - startOffset);
  const days: CalendarDay[] = [];

  for (let index = 0; index < totalCells; index += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);

    const date: DateParts = {
      year: current.getFullYear(),
      month: current.getMonth(),
      day: current.getDate(),
    };

    days.push({
      date,
      iso: toIsoDateLocal(date),
      inMonth: current.getMonth() === month,
    });
  }

  return days;
}
