type EyeIconProps = {
  hidden: boolean;
  className?: string;
  size?: number;
};

export function EyeIcon({ hidden, className, size = 20 }: EyeIconProps) {
  if (hidden) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path
          d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="10"
          cy="10"
          r="2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M4 4l12 12"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="10"
        cy="10"
        r="2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
