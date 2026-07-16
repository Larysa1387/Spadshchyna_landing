type ChevronIconProps = {
  direction: 'left' | 'right';
  className?: string;
  size?: number;
};

export function ChevronIcon({
  direction,
  className,
  size = 16,
}: ChevronIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d={
          direction === 'left'
            ? 'M10 3.5 5.5 8 10 12.5'
            : 'M6 3.5 10.5 8 6 12.5'
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
