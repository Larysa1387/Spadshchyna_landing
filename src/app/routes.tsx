import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout/RootLayout';
import { HomePage } from '@/pages/HomePage/HomePage';
import { FavouritesPage } from '@/pages/FavouritesPage/FavouritesPage';
import { ProductPage } from '@/pages/ProductPage/ProductPage';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      { path: paths.favourites, element: <FavouritesPage /> },
      {
        path: `${paths.homesteads}/:homesteadId`,
        element: <ProductPage />,
      },
      { path: '*', element: <Navigate to={paths.home} replace /> },
    ],
  },
]);
