import { HomeOutlineIcon } from './HomeOutlineIcon';
import { LeafIcon } from './LeafIcon';
import { ToolsIcon } from './ToolsIcon';

type ImpactItemIconProps = {
  type: 'home' | 'tools' | 'leaf';
};

export function ImpactItemIcon({ type }: ImpactItemIconProps) {
  if (type === 'leaf') {
    return <LeafIcon size={18} />;
  }

  if (type === 'tools') {
    return <ToolsIcon />;
  }

  return <HomeOutlineIcon size={18} />;
}
