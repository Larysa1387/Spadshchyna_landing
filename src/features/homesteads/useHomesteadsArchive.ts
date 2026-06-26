import { useEffect, useMemo, useState } from 'react';
import { listHomesteads } from '@/api/homesteads';
import { getApiErrorMessage } from '@/api/client';
import type { ApiHomesteadCard } from '@/api/types';
import type { HomesteadCardProps } from '@/components/homestead/HomesteadCard/HomesteadCard';
import {
  applyArchiveFilters,
  getUniqueRegions,
  type ArchiveFilterState,
} from './archiveFilters';
import { mapApiHomesteadToCard } from './mapApiHomesteadToCard';

const CATALOG_FETCH_LIMIT = 100;

export function useHomesteadsArchive(filters: ArchiveFilterState) {
  const [allHomesteads, setAllHomesteads] = useState<ApiHomesteadCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    listHomesteads({ limit: CATALOG_FETCH_LIMIT })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setAllHomesteads(data.items);
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        setAllHomesteads([]);
        setError(
          getApiErrorMessage(requestError, 'Unable to load homesteads.'),
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const regions = useMemo(
    () => getUniqueRegions(allHomesteads),
    [allHomesteads],
  );

  const filteredHomesteads = useMemo(
    () => applyArchiveFilters(allHomesteads, filters),
    [allHomesteads, filters],
  );

  const homesteads = useMemo<HomesteadCardProps[]>(
    () => filteredHomesteads.map(mapApiHomesteadToCard),
    [filteredHomesteads],
  );

  return {
    homesteads,
    regions,
    total: filteredHomesteads.length,
    catalogTotal: allHomesteads.length,
    isLoading,
    error,
  };
}
