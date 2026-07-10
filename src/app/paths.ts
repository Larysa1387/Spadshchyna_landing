export const paths = {
  home: '/',
  homesteads: '/homesteads',
  homesteadDetail: (id: string) => `/homesteads/${id}` as const,
  favourites: '/favourites',
  dashboard: '/dashboard',
  checkout: '/checkout',
  bookingConfirmed: '/booking-confirmed',
  bookingSuccess: '/booking/success',
} as const;
