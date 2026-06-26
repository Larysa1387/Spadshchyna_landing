import { homePage } from '@/content/designContent';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { PriceTagIcon } from '@/components/icons/PriceTagIcon';
import { RatingStarIcon } from '@/components/icons/RatingStarIcon';
import {
  PRICE_FILTER_OPTIONS,
  RATING_FILTER_OPTIONS,
} from '@/features/homesteads/archiveFilters';
import { FilterSelect } from './FilterSelect';
import styles from './ArchiveFilters.module.scss';

type ArchiveFiltersProps = {
  regions: string[];
  regionName: string;
  priceFilter: string;
  ratingFilter: string;
  onRegionChange: (regionName: string) => void;
  onPriceChange: (value: string) => void;
  onRatingChange: (value: string) => void;
};

function getRatingOptionLabel(value: string) {
  if (value === '') {
    return homePage.archive.filters.anyRating;
  }

  if (value === 'middle') {
    return homePage.archive.filters.ratingMiddle;
  }

  return homePage.archive.filters.ratingHigh;
}

export function ArchiveFilters({
  regions,
  regionName,
  priceFilter,
  ratingFilter,
  onRegionChange,
  onPriceChange,
  onRatingChange,
}: ArchiveFiltersProps) {
  const regionOptions = [
    { value: '', label: homePage.archive.filters.allRegions },
    ...regions.map((region) => ({ value: region, label: region })),
  ];

  const priceOptions = PRICE_FILTER_OPTIONS.map((option) => ({
    value: option.value,
    label: option.value ? option.label : homePage.archive.filters.anyPrice,
  }));

  const ratingOptions = RATING_FILTER_OPTIONS.map((option) => ({
    value: option.value,
    label: getRatingOptionLabel(option.value),
  }));

  return (
    <div className={styles.filters} aria-label="Homestead filters">
      <div className={`${styles.field} ${styles.regionField}`}>
        <LocationPinIcon className={styles.regionPinIcon} size={32} />
        <label
          className={`${styles.label} ${styles.regionLabel}`}
          htmlFor="archive-filter-region"
        >
          {homePage.archive.filters.region}
        </label>
        <FilterSelect
          id="archive-filter-region"
          className={styles.regionSelect}
          value={regionName}
          options={regionOptions}
          onChange={onRegionChange}
        />
      </div>

      <div className={`${styles.field} ${styles.regionField}`}>
        <PriceTagIcon className={styles.priceTagIcon} size={24} />
        <label
          className={`${styles.label} ${styles.regionLabel}`}
          htmlFor="archive-filter-price"
        >
          {homePage.archive.filters.price}
        </label>
        <FilterSelect
          id="archive-filter-price"
          className={styles.regionSelect}
          value={priceFilter}
          options={priceOptions}
          onChange={onPriceChange}
        />
      </div>

      <div className={`${styles.field} ${styles.regionField}`}>
        <RatingStarIcon className={styles.regionPinIcon} size={32} />
        <label
          className={`${styles.label} ${styles.regionLabel}`}
          htmlFor="archive-filter-rating"
        >
          {homePage.archive.filters.rating}
        </label>
        <FilterSelect
          id="archive-filter-rating"
          className={styles.regionSelect}
          value={ratingFilter}
          options={ratingOptions}
          onChange={onRatingChange}
        />
      </div>
    </div>
  );
}
