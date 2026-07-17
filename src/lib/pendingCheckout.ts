const STORAGE_PREFIX = 'spadshchyna:pending-checkout:';

export type PendingCheckoutRecord = {
  bookingId: number;
  homesteadId: number;
  checkIn: string;
  checkOut: string;
  checkoutUrl: string;
  savedAt: number;
};

function paramKey(homesteadId: number, checkIn: string, checkOut: string) {
  return `${STORAGE_PREFIX}${homesteadId}:${checkIn}:${checkOut}`;
}

function bookingKey(bookingId: number) {
  return `${STORAGE_PREFIX}id:${bookingId}`;
}

export function isValidCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.includes('stripe');
  } catch {
    return false;
  }
}

function readRecord(key: string): PendingCheckoutRecord | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PendingCheckoutRecord;
    if (!parsed.checkoutUrl || !isValidCheckoutUrl(parsed.checkoutUrl)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function savePendingCheckout(
  record: Omit<PendingCheckoutRecord, 'savedAt'>,
): void {
  if (!isValidCheckoutUrl(record.checkoutUrl)) {
    return;
  }

  const full: PendingCheckoutRecord = { ...record, savedAt: Date.now() };
  const serialized = JSON.stringify(full);

  try {
    sessionStorage.setItem(
      paramKey(record.homesteadId, record.checkIn, record.checkOut),
      serialized,
    );
    sessionStorage.setItem(bookingKey(record.bookingId), serialized);
  } catch {
    // Ignore quota or privacy-mode storage errors.
  }
}

export function getPendingCheckoutByParams(
  homesteadId: number,
  checkIn: string,
  checkOut: string,
): PendingCheckoutRecord | null {
  return readRecord(paramKey(homesteadId, checkIn, checkOut));
}

export function getPendingCheckoutByBookingId(
  bookingId: number,
): PendingCheckoutRecord | null {
  return readRecord(bookingKey(bookingId));
}

export function clearPendingCheckout(
  homesteadId: number,
  checkIn: string,
  checkOut: string,
  bookingId?: number,
): void {
  try {
    sessionStorage.removeItem(paramKey(homesteadId, checkIn, checkOut));
    if (bookingId !== undefined) {
      sessionStorage.removeItem(bookingKey(bookingId));
    }
  } catch {
    // Ignore storage errors.
  }
}

export function redirectToCheckout(checkoutUrl: string): void {
  window.location.assign(checkoutUrl);
}
