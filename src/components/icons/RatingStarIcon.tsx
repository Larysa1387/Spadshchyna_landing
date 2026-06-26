import { iconSpriteHref, iconSpriteIds } from './sprite';

type RatingStarIconProps = {
  className?: string;
  size?: number;
};

export function RatingStarIcon({ className, size = 14 }: RatingStarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <use href={iconSpriteHref(iconSpriteIds.ratingStar)} />
    </svg>
  );
}
