import type { Brick } from '../../types';

export interface ImportExportProps {
  bricks: Brick[];
  onImport: (bricks: Brick[]) => void;
  onClearAll: () => void;
}
