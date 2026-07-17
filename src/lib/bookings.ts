import type { BookingListItem } from '@/api/types';

export function isPendingBookingStatus(status: string): boolean {
  return status.trim().toLowerCase() === 'pending';
}

export function findPendingBookingForStay(
  bookings: BookingListItem[],
  homesteadId: number,
  checkIn: string,
  checkOut: string,
): BookingListItem | null {
  return (
    bookings.find(
      (booking) =>
        booking.homestead_id === homesteadId &&
        booking.check_in === checkIn &&
        booking.check_out === checkOut &&
        isPendingBookingStatus(booking.status),
    ) ?? null
  );
}

export function findBookingForStay(
  bookings: BookingListItem[],
  homesteadId: number,
  checkIn: string,
  checkOut: string,
): BookingListItem | null {
  return (
    bookings.find(
      (booking) =>
        booking.homestead_id === homesteadId &&
        booking.check_in === checkIn &&
        booking.check_out === checkOut,
    ) ?? null
  );
}
