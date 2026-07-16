type CalendarIconProps = {
  className?: string;
  size?: number;
};

export function CalendarIcon({ className, size = 18 }: CalendarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M4.5 2.25v1.25M11.5 2.25v1.25M3.25 5.75h9.5M3.25 4h9.5a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
