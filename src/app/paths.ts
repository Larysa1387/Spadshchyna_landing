export const paths = {
  home: '/',
  homesteads: '/homesteads',
  homesteadDetail: (id: string) => `/homesteads/${id}` as const,
  dashboard: '/dashboard',
  checkout: '/checkout',
  bookingConfirmed: '/booking-confirmed',
} as const;
