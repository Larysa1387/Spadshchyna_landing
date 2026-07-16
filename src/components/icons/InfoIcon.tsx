type InfoIconProps = {
  className?: string;
  size?: number;
};

export function InfoIcon({ className, size = 14 }: InfoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M12 10.5V16M12 8v.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
