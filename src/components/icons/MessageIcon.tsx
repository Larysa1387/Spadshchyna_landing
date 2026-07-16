type MessageIconProps = {
  className?: string;
  size?: number;
};

export function MessageIcon({ className, size = 16 }: MessageIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d="M3.25 3.25h9.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H7l-2.25 2.25V9.25H3.25a.75.75 0 0 1-.75-.75V4a.75.75 0 0 1 .75-.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="6.25" r="0.45" fill="currentColor" />
      <circle cx="8" cy="6.25" r="0.45" fill="currentColor" />
      <circle cx="10" cy="6.25" r="0.45" fill="currentColor" />
    </svg>
  );
}
