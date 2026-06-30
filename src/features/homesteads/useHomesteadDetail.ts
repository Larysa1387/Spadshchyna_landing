import { useEffect, useState } from 'react';
import { getHomestead } from '@/api/homesteads';
import { getApiErrorMessage } from '@/api/client';
import type { HomesteadDetail } from '@/api/types';

export function useHomesteadDetail(homesteadId: string | undefined) {
  const [homestead, setHomestead] = useState<HomesteadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(homesteadId);

    if (!homesteadId || Number.isNaN(parsedId)) {
      setHomestead(null);
      setError('Homestead not found.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadHomestead() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getHomestead(parsedId);

        if (!cancelled) {
          setHomestead(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setHomestead(null);
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load homestead details.',
            ),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHomestead();

    return () => {
      cancelled = true;
    };
  }, [homesteadId]);

  return { homestead, isLoading, error };
}
