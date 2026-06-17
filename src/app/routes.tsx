import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout/RootLayout';
import { HomePage } from '@/pages/HomePage/HomePage';
import { paths } from './paths';
import { RoutePlaceholder } from './RoutePlaceholder';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      {
        path: paths.dashboard,
        element: <RoutePlaceholder title="Dashboard" />,
      },
      { path: '*', element: <Navigate to={paths.home} replace /> },
    ],
  },
]);
