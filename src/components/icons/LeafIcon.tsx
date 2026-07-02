type LeafIconProps = {
  className?: string;
  size?: number;
};

export function LeafIcon({ className, size = 14 }: LeafIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M12 3C7.5 6.5 5 10.5 5 14.5a7 7 0 0 0 14 0c0-4-2.5-8-7-11.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20.5V12M12 12c-2.5-1.5-4.5-3.5-5.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
