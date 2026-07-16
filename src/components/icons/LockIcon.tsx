type LockIconProps = {
  className?: string;
  size?: number;
  filled?: boolean;
};

export function LockIcon({
  className,
  size = 16,
  filled = false,
}: LockIconProps) {
  if (filled) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
      >
        <path
          d="M12 2a4.5 4.5 0 0 0-4.5 4.5V9H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-.5V6.5A4.5 4.5 0 0 0 12 2Zm0 2a2.5 2.5 0 0 1 2.5 2.5V9h-5V6.5A2.5 2.5 0 0 1 12 4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
