import styles from './RatingFilledStarIcon.module.scss';

type RatingFilledStarIconProps = {
  rating: number;
  className?: string;
  size?: number;
};

function getRatingStarTone(rating: number) {
  if (rating >= 4.9) {
    return styles.high;
  }

  if (rating >= 4.6 && rating < 4.9) {
    return styles.middle;
  }

  if (rating < 4.7) {
    return styles.low;
  }

  return styles.middle;
}

export function RatingFilledStarIcon({
  rating,
  className,
  size = 18,
}: RatingFilledStarIconProps) {
  return (
    <svg
      className={`${styles.star} ${getRatingStarTone(rating)}${className ? ` ${className}` : ''}`}
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M6 1.2 7.55 4.35 11 4.85 8.5 7.2 9.1 10.6 6 8.95 2.9 10.6 3.5 7.2 1 4.85 4.45 4.35 6 1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
