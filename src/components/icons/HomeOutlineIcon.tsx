type HomeOutlineIconProps = {
  className?: string;
  size?: number;
  variant?: 'default' | 'sidebar';
};

export function HomeOutlineIcon({
  className,
  size = 16,
  variant = 'default',
}: HomeOutlineIconProps) {
  const strokeProps =
    variant === 'sidebar'
      ? {
          fill: 'none' as const,
          stroke: 'currentColor',
          strokeWidth: 1.1,
          strokeLinejoin: 'round' as const,
        }
      : {
          fill: 'none' as const,
          stroke: 'currentColor',
          strokeWidth: 1.1,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d="M2.75 6.75 8 2.75l5.25 4V12.5a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75V6.75Z"
        {...strokeProps}
      />
    </svg>
  );
}
