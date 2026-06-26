import { useMemo, useState } from 'react';
import type { ArchiveFilterState } from './archiveFilters';
import { DEFAULT_ARCHIVE_FILTERS } from './archiveFilters';

export function useArchiveFilters(
  initialFilters: ArchiveFilterState = DEFAULT_ARCHIVE_FILTERS,
) {
  const [regionName, setRegionName] = useState(initialFilters.regionName);
  const [priceFilter, setPriceFilter] = useState(initialFilters.priceFilter);
  const [ratingFilter, setRatingFilter] = useState(initialFilters.ratingFilter);

  const filterState = useMemo<ArchiveFilterState>(
    () => ({
      regionName,
      priceFilter,
      ratingFilter,
    }),
    [regionName, priceFilter, ratingFilter],
  );

  return {
    filterState,
    regionName,
    setRegionName,
    priceFilter,
    setPriceFilter,
    ratingFilter,
    setRatingFilter,
  };
}
