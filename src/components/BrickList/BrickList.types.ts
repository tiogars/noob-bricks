import type { Brick } from '../../types';

export interface BrickListProps {
  bricks: Brick[];
  onEdit: (brick: Brick) => void;
  onDelete: (id: string) => void;
}
