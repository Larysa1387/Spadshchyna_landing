import { CapacityIcon } from './CapacityIcon';
import { HouseIcon } from './HouseIcon';

type PropertyDetailIconProps = {
  type: 'house' | 'capacity' | 'bed' | 'shield';
  className?: string;
  capacityClassName?: string;
};

export function PropertyDetailIcon({
  type,
  className,
  capacityClassName,
}: PropertyDetailIconProps) {
  const iconProps = {
    className,
    viewBox: '0 0 16 16',
    width: 18,
    height: 18,
    'aria-hidden': true as const,
  };

  const strokeProps = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'capacity') {
    return (
      <CapacityIcon
        className={
          [className, capacityClassName].filter(Boolean).join(' ') || undefined
        }
        size={22}
      />
    );
  }

  if (type === 'bed') {
    return (
      <svg {...iconProps}>
        <path
          d="M4.1 2.75h7.8q.85 0 .85.85v1.9H3.25V3.6q0-.85.85-.85Z"
          {...strokeProps}
        />
        <rect
          x="3"
          y="6.1"
          width="3.85"
          height="1.35"
          rx="0.4"
          {...strokeProps}
        />
        <rect
          x="9.15"
          y="6.1"
          width="3.85"
          height="1.35"
          rx="0.4"
          {...strokeProps}
        />
        <rect
          x="2.85"
          y="7.85"
          width="10.3"
          height="2.7"
          rx="0.55"
          {...strokeProps}
        />
        <path
          d="M2.35 10.9h11.3M2.85 10.9v1.2M13.15 10.9v1.2"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg {...iconProps}>
        <path
          d="M8 1.75 12.75 3.5V7.5c0 2.45-1.95 4.74-4.75 5.5-2.8-.76-4.75-3.05-4.75-5.5V3.5L8 1.75Z"
          {...strokeProps}
        />
        <path d="M5.45 7.55 7.2 9.3 11.55 4.85" {...strokeProps} />
      </svg>
    );
  }

  return <HouseIcon className={className} />;
}
