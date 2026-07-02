type EveIconProps = {
  className?: string;
  size?: number;
};

export function EveIcon({ className, size = 14 }: EveIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M20.5 14.5A8.5 8.5 0 1 1 9 3.5a7 7 0 1 0 11.5 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 5.5 19 4M20.5 8.5l1.5-.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
