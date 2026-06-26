import { useContext } from 'react';
import { FavouritesContext } from './favouritesContext';

export function useFavourites() {
  const context = useContext(FavouritesContext);

  if (!context) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }

  return context;
}
