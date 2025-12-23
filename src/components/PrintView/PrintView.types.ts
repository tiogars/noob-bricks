import type { Brick } from '../../types';

export interface PrintViewProps {
  bricks: Brick[];
  selectedTags: string[];
  onClose: () => void;
}
