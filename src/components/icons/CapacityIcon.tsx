type CapacityIconProps = {
  className?: string;
  size?: number;
};

export function CapacityIcon({ className, size = 22 }: CapacityIconProps) {
  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 0.8,
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
      <circle cx="10.35" cy="5.35" r="1.05" {...strokeProps} />
      <path
        d="M8.6 9.85v-.45c0-.95.82-1.72 1.85-1.72s1.85.77 1.85 1.72v.45"
        {...strokeProps}
      />
      <path d="M8.15 10.3h4.3" {...strokeProps} />
      <circle cx="5.65" cy="5.65" r="1.4" {...strokeProps} />
      <path
        d="M2.75 10.75v-.75c0-1.45 1.46-2.625 3.25-2.625s3.25 1.175 3.25 2.625v.75"
        {...strokeProps}
      />
      <path d="M2.75 11.5h6.5" {...strokeProps} />
    </svg>
  );
}
