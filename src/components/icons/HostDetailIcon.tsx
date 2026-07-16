import { publicAsset } from '@/lib/assets';
import { GlobeIcon } from './GlobeIcon';
import { MessageIcon } from './MessageIcon';

type HostDetailIconProps = {
  type: 'bell' | 'globe' | 'message';
  className?: string;
};

export function HostDetailIcon({ type, className }: HostDetailIconProps) {
  if (type === 'bell') {
    return (
      <img
        className={className}
        src={publicAsset('assets/icons/notification-bell-svgrepo-com.svg')}
        width={16}
        height={16}
        alt=""
        aria-hidden
      />
    );
  }

  if (type === 'globe') {
    return <GlobeIcon className={className} />;
  }

  return <MessageIcon className={className} />;
}
