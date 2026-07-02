type SpoonIconProps = {
  className?: string;
  size?: number;
};

export function SpoonIcon({ className, size = 14 }: SpoonIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M9 3v7.25c0 2.35 1.35 4.25 3 4.25s3-1.9 3-4.25V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.5v6.5M9.5 21h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
