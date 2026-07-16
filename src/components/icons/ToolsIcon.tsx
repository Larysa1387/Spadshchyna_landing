type ToolsIconProps = {
  className?: string;
  size?: number;
};

export function ToolsIcon({ className, size = 18 }: ToolsIconProps) {
  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d="M10.2 2.4a2.4 2.4 0 0 0-3.4 3.4L2.4 10.2a1.2 1.2 0 0 0 1.7 1.7l4.4-4.4a2.4 2.4 0 0 0 3.4-3.4L10.2 5.8 8.6 4.2Z"
        {...strokeProps}
      />
      <path d="M5.5 10.5 4 13.5" {...strokeProps} />
      <path
        d="M11.1 8.2 13.6 10.7a1.1 1.1 0 0 1 0 1.55L12.7 13.15a1.1 1.1 0 0 1-1.55 0L8.65 10.65"
        {...strokeProps}
      />
    </svg>
  );
}
