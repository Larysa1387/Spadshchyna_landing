import { iconSpriteHref, iconSpriteIds } from './sprite';

type DetailsArrowIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function DetailsArrowIcon({
  className,
  width = 30,
  height = 10,
}: DetailsArrowIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 10"
      width={width}
      height={height}
      aria-hidden
    >
      <use href={iconSpriteHref(iconSpriteIds.detailsArrow)} />
    </svg>
  );
}
