import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  addFavourite,
  listFavourites,
  removeFavourite,
} from '@/api/favourites';
import { getApiErrorMessage } from '@/api/client';
import { isAuthenticated } from '@/api/authStorage';
import type { ApiHomesteadCard } from '@/api/types';
import { FavouritesContext } from './favouritesContext';

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<ApiHomesteadCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((item) => item.id)),
    [favourites],
  );

  const refreshFavourites = useCallback(async () => {
    if (!isAuthenticated()) {
      setFavourites([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listFavourites();
      setFavourites(data);
    } catch (requestError) {
      setFavourites([]);
      setError(getApiErrorMessage(requestError, 'Unable to load favourites.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshFavourites();
  }, [refreshFavourites]);

  const isFavourited = useCallback(
    (homesteadId: number) => favouriteIds.has(homesteadId),
    [favouriteIds],
  );

  const toggleFavourite = useCallback(
    async (homesteadId: number) => {
      if (!isAuthenticated()) {
        setError('Please log in to manage favourites.');
        return;
      }

      setError(null);
      const alreadyFavourited = favouriteIds.has(homesteadId);

      try {
        if (alreadyFavourited) {
          await removeFavourite(homesteadId);
          setFavourites((current) =>
            current.filter((item) => item.id !== homesteadId),
          );
        } else {
          await addFavourite(homesteadId);
          await refreshFavourites();
        }
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, 'Unable to update favourites.'),
        );
      }
    },
    [favouriteIds, refreshFavourites],
  );

  const value = useMemo(
    () => ({
      favourites,
      isLoading,
      error,
      isFavourited,
      toggleFavourite,
      refreshFavourites,
    }),
    [
      favourites,
      isLoading,
      error,
      isFavourited,
      toggleFavourite,
      refreshFavourites,
    ],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}
