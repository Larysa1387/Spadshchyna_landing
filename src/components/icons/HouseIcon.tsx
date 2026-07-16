type HouseIconProps = {
  className?: string;
  size?: number;
};

export function HouseIcon({ className, size = 18 }: HouseIconProps) {
  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M2.5 5.75 8 1.75l5.5 4V13a.75.75 0 0 1-.75.75H3.25A.75.75 0 0 1 2.5 13V5.75Zm2 1.25v5.5h3.5v-5.5"
        {...strokeProps}
      />
    </svg>
  );
}
