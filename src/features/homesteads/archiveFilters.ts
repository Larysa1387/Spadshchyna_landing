export type ArchiveFilterState = {
  regionName: string;
  priceFilter: string;
  ratingFilter: string;
};

export const DEFAULT_ARCHIVE_FILTERS: ArchiveFilterState = {
  regionName: '',
  priceFilter: '',
  ratingFilter: '',
};

export type PriceFilterOption = {
  value: string;
  label: string;
  price_min?: number;
  price_max?: number | null;
};

export type RatingFilterOption = {
  value: string;
  label: string;
  rating_min?: number | null;
  rating_max?: number | null;
};

export const PRICE_FILTER_OPTIONS: PriceFilterOption[] = [
  { value: '', label: 'Any price' },
  { value: '0-2000', label: 'Up to 2000 UAH', price_min: 0, price_max: 2000 },
  {
    value: '2000-3000',
    label: '2000 – 3000 UAH',
    price_min: 2000,
    price_max: 3000,
  },
  { value: '3000+', label: '3000+ UAH', price_min: 3000, price_max: null },
];

export const RATING_FILTER_OPTIONS: RatingFilterOption[] = [
  { value: '', label: 'All' },
  { value: 'middle', label: '4.6 – 4.8', rating_min: 4.6, rating_max: 4.8 },
  { value: 'high', label: '4.8+', rating_min: 4.8, rating_max: 5.0 },
];

export function getPriceFilterParams(priceFilter: string) {
  const option = PRICE_FILTER_OPTIONS.find(
    (item) => item.value === priceFilter,
  );

  if (!option || !option.value) {
    return { price_min: null, price_max: null };
  }

  return {
    price_min: option.price_min ?? null,
    price_max: option.price_max ?? null,
  };
}

export function getRatingFilterParams(ratingFilter: string) {
  const option = RATING_FILTER_OPTIONS.find(
    (item) => item.value === ratingFilter,
  );

  if (!option || !option.value) {
    return { rating_min: null, rating_max: null };
  }

  return {
    rating_min: option.rating_min ?? null,
    rating_max: option.rating_max ?? null,
  };
}

export function matchesRatingBand(
  rating: number,
  ratingMin: number | null,
  ratingMax: number | null,
) {
  if (ratingMin != null && rating < ratingMin) {
    return false;
  }

  // Upper band uses 4.8+; middle band keeps 4.8 in the top tier only.
  if (ratingMax != null && rating >= ratingMax) {
    return false;
  }

  return true;
}

export function applyArchiveFilters<
  T extends {
    region: string;
    price_per_night: number;
    rating: number;
  },
>(items: T[], filters: ArchiveFilterState): T[] {
  const { price_min, price_max } = getPriceFilterParams(filters.priceFilter);
  const { rating_min, rating_max } = getRatingFilterParams(
    filters.ratingFilter,
  );

  return items.filter((item) => {
    if (filters.regionName && item.region !== filters.regionName) {
      return false;
    }

    if (price_min != null && item.price_per_night < price_min) {
      return false;
    }

    if (price_max != null && item.price_per_night > price_max) {
      return false;
    }

    return matchesRatingBand(item.rating, rating_min, rating_max);
  });
}

export function getUniqueRegions<T extends { region: string }>(
  items: T[],
): string[] {
  return [...new Set(items.map((item) => item.region))].sort((a, b) =>
    a.localeCompare(b),
  );
}
