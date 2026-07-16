import { CalendarIcon } from './CalendarIcon';
import { CapacityIcon } from './CapacityIcon';

type UpcomingMetaIconProps = {
  type: 'calendar' | 'capacity';
  className?: string;
  capacityClassName?: string;
};

export function UpcomingMetaIcon({
  type,
  className,
  capacityClassName,
}: UpcomingMetaIconProps) {
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

  return <CalendarIcon className={className} size={16} />;
}
