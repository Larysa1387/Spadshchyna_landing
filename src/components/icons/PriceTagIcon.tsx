import { iconSpriteHref, iconSpriteIds } from './sprite';

type PriceTagIconProps = {
  className?: string;
  size?: number;
};

export function PriceTagIcon({ className, size = 14 }: PriceTagIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <use href={iconSpriteHref(iconSpriteIds.priceTag)} />
    </svg>
  );
}
