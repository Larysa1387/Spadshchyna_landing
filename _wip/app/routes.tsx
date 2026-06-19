import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout/RootLayout';
import { BookingConfirmedPage } from '@/pages/BookingConfirmedPage/BookingConfirmedPage';
import { CheckoutPage } from '@/pages/CheckoutPage/CheckoutPage';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { HomePage } from '@/pages/HomePage/HomePage';
import { HomesteadDetailPage } from '@/pages/HomesteadDetailPage/HomesteadDetailPage';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      {
        path: `${paths.homesteads}/:homesteadId`,
        element: <HomesteadDetailPage />,
      },
      { path: paths.favourites, element: <DashboardPage /> },
      { path: paths.checkout, element: <CheckoutPage /> },
      { path: paths.bookingConfirmed, element: <BookingConfirmedPage /> },
      { path: '*', element: <Navigate to={paths.home} replace /> },
    ],
  },
]);
