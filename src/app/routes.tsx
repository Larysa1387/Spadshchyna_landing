import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout/RootLayout';
import { HomePage } from '@/pages/HomePage/HomePage';
import { FavouritesPage } from '@/pages/FavouritesPage/FavouritesPage';
import { ProductPage } from '@/pages/ProductPage/ProductPage';
import { CheckoutPage } from '@/pages/CheckoutPage/CheckoutPage';
import { BookingConfirmedPage } from '@/pages/BookingConfirmedPage/BookingConfirmedPage';
import { UserPage } from '@/pages/UserPage/UserPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage/ResetPasswordPage';
import { paths } from './paths';

const basename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: paths.home, element: <HomePage /> },
        { path: paths.favourites, element: <FavouritesPage /> },
        { path: paths.dashboard, element: <UserPage /> },
        {
          path: `${paths.homesteads}/:homesteadId`,
          element: <ProductPage />,
        },
        { path: paths.checkout, element: <CheckoutPage /> },
        { path: paths.bookingConfirmed, element: <BookingConfirmedPage /> },
        { path: paths.bookingSuccess, element: <BookingConfirmedPage /> },
        { path: paths.forgotPassword, element: <ForgotPasswordPage /> },
        { path: paths.resetPassword, element: <ResetPasswordPage /> },
        { path: '*', element: <Navigate to={paths.home} replace /> },
      ],
    },
  ],
  basename ? { basename } : undefined,
);
