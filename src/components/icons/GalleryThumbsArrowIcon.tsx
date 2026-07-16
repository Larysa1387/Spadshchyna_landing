type GalleryThumbsArrowIconProps = {
  direction?: 'down' | 'left' | 'right';
  className?: string;
  size?: number;
};

export function GalleryThumbsArrowIcon({
  direction = 'down',
  className,
  size = 20,
}: GalleryThumbsArrowIconProps) {
  const rotation = direction === 'left' ? 90 : direction === 'right' ? -90 : 0;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M8 3.25v6.25M5.25 9.5 8 12.25 10.75 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
