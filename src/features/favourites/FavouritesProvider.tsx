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
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import type { ApiHomesteadCard } from '@/api/types';
import { useAuth } from '@/features/auth/useAuth';
import { FavouritesContext } from './favouritesContext';

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, authModal, openLoginModal, logout } =
    useAuth();
  const [favourites, setFavourites] = useState<ApiHomesteadCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFavouriteId, setPendingFavouriteId] = useState<number | null>(
    null,
  );

  const favouriteIds = useMemo(
    () => new Set(favourites.map((item) => item.id)),
    [favourites],
  );

  const refreshFavourites = useCallback(async () => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated) {
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

      if (isUnauthorizedError(requestError)) {
        await logout();
        openLoginModal();
      }

      setError(getApiErrorMessage(requestError, 'Unable to load favourites.'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isInitializing, logout, openLoginModal]);

  useEffect(() => {
    void refreshFavourites();
  }, [refreshFavourites]);

  useEffect(() => {
    if (authModal !== null || isAuthenticated || pendingFavouriteId === null) {
      return;
    }

    setPendingFavouriteId(null);
  }, [authModal, isAuthenticated, pendingFavouriteId]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated || pendingFavouriteId === null) {
      return;
    }

    const homesteadId = pendingFavouriteId;
    setPendingFavouriteId(null);

    async function completePendingFavourite() {
      if (favouriteIds.has(homesteadId)) {
        return;
      }

      setError(null);

      try {
        await addFavourite(homesteadId);
        await refreshFavourites();
      } catch (requestError) {
        if (isUnauthorizedError(requestError)) {
          await logout();
          openLoginModal();
        }

        setError(
          getApiErrorMessage(requestError, 'Unable to update favourites.'),
        );
      }
    }

    void completePendingFavourite();
  }, [
    favouriteIds,
    isAuthenticated,
    isInitializing,
    logout,
    openLoginModal,
    pendingFavouriteId,
    refreshFavourites,
  ]);

  const isFavourited = useCallback(
    (homesteadId: number) => favouriteIds.has(homesteadId),
    [favouriteIds],
  );

  const toggleFavourite = useCallback(
    async (homesteadId: number) => {
      if (!isAuthenticated) {
        setPendingFavouriteId(homesteadId);
        openLoginModal();
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
        if (isUnauthorizedError(requestError)) {
          await logout();
          openLoginModal();
        }

        setError(
          getApiErrorMessage(requestError, 'Unable to update favourites.'),
        );
      }
    },
    [favouriteIds, isAuthenticated, logout, openLoginModal, refreshFavourites],
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
