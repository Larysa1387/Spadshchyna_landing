export const paths = {
  home: '/',
  homesteads: '/homesteads',
  homesteadDetail: (id: string) => `/homesteads/${id}` as const,
  favourites: '/favourites',
  checkout: '/checkout',
  bookingConfirmed: '/booking-confirmed',
} as const;
