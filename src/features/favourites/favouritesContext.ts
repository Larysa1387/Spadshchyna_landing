import { createContext } from 'react';
import type { ApiHomesteadCard } from '@/api/types';

export type FavouritesContextValue = {
  favourites: ApiHomesteadCard[];
  isLoading: boolean;
  error: string | null;
  isFavourited: (homesteadId: number) => boolean;
  toggleFavourite: (homesteadId: number) => Promise<void>;
  refreshFavourites: () => Promise<void>;
};

export const FavouritesContext = createContext<FavouritesContextValue | null>(
  null,
);
