import { apiClient } from './client';
import type {
  BookingListItem,
  CreateBookingRequest,
  CreateBookingResponse,
} from './types';

const BOOKINGS_PATH = '/api/v1/bookings';

export async function createBooking(
  payload: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const { data } = await apiClient.post<CreateBookingResponse>(
    BOOKINGS_PATH,
    payload,
  );
  return data;
}

export async function listBookings(): Promise<BookingListItem[]> {
  const { data } = await apiClient.get<BookingListItem[]>(BOOKINGS_PATH);
  return data;
}
