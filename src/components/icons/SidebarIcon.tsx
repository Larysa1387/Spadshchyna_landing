import { CalendarIcon } from './CalendarIcon';
import { HeartIcon } from './HeartIcon';
import { HomeOutlineIcon } from './HomeOutlineIcon';
import { LogoIcon } from './LogoIcon';

type SidebarIconProps = {
  type: 'home' | 'calendar' | 'heart' | 'impact';
  className?: string;
};

export function SidebarIcon({ type, className }: SidebarIconProps) {
  switch (type) {
    case 'calendar':
      return <CalendarIcon size={16} />;
    case 'heart':
      return <HeartIcon className={className} size={16} />;
    case 'impact':
      return <LogoIcon size={14} fill="currentColor" aria-hidden />;
    default:
      return <HomeOutlineIcon size={16} variant="sidebar" />;
  }
}
