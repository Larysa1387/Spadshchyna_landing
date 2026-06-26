type LocationMetaIconProps = {
  className?: string;
  size?: number;
};

export function LocationMetaIcon({
  className,
  size = 12,
}: LocationMetaIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M6 1C4.07 1 2.5 2.57 2.5 4.5 2.5 7.25 6 11 6 11s3.5-3.75 3.5-6.5C9.5 2.57 7.93 1 6 1Zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
        fill="currentColor"
      />
    </svg>
  );
}
