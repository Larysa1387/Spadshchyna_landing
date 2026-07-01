import { useEffect, useMemo, useState } from 'react';
import { getHomesteadRecommendations } from '@/api/homesteads';
import { getApiErrorMessage } from '@/api/client';
import type { ApiHomesteadCard } from '@/api/types';
import { mapApiHomesteadToCard } from './mapApiHomesteadToCard';

export function useHomesteadRecommendations(homesteadId: number | undefined) {
  const [items, setItems] = useState<ApiHomesteadCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!homesteadId) {
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const id = homesteadId;

    async function loadRecommendations() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getHomesteadRecommendations(id);

        if (!cancelled) {
          setItems(data.filter((item) => item.id !== id));
        }
      } catch (requestError) {
        if (!cancelled) {
          setItems([]);
          setError(
            getApiErrorMessage(requestError, 'Unable to load recommendations.'),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [homesteadId]);

  const recommendations = useMemo(
    () => items.map(mapApiHomesteadToCard),
    [items],
  );

  return { recommendations, isLoading, error };
}
