type BedIconProps = {
  className?: string;
  size?: number;
};

const strokeProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function BedIcon({ className, size = 24 }: BedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 28"
      width={size}
      height={(size / 40) * 28}
      aria-hidden
    >
      <rect x="2" y="2" width="36" height="10" rx="2" {...strokeProps} />
      <rect x="6" y="5.5" width="11" height="5" rx="1.2" {...strokeProps} />
      <rect x="23" y="5.5" width="11" height="5" rx="1.2" {...strokeProps} />
      <rect x="3" y="13" width="34" height="7" rx="1.5" {...strokeProps} />
      <path d="M2 21.5h36" {...strokeProps} />
      <path d="M5 21.5v3.5M35 21.5v3.5" {...strokeProps} />
    </svg>
  );
}
