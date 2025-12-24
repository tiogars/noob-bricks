import type { Brick, ExternalLink } from '../../types';

export interface BrickListProps {
  bricks: Brick[];
  onEdit: (brick: Brick) => void;
  onDelete: (id: string) => void;
  externalLinks?: ExternalLink[];
}
