import { iconSpriteHref, iconSpriteIds } from './sprite';

type LogoIconProps = {
  fill?: string;
  className?: string;
  size?: number;
};

export function LogoIcon({
  fill = 'currentColor',
  className,
  size = 32,
}: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 5 5"
      width={size}
      height={size}
      fill={fill}
      aria-hidden
    >
      <use href={iconSpriteHref(iconSpriteIds.logoIcon)} />
    </svg>
  );
}
