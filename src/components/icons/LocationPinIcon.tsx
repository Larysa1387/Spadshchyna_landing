import { iconSpriteHref, iconSpriteIds } from './sprite';

type LocationPinIconProps = {
  className?: string;
  size?: number;
};

export function LocationPinIcon({
  className,
  size = 14,
}: LocationPinIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <use href={iconSpriteHref(iconSpriteIds.locationPin)} />
    </svg>
  );
}
