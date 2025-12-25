import type { Brick, ExternalLink } from '../../types';
import type { ImportResult } from '../../utils/importService';

export interface ImportExportProps {
  bricks: Brick[];
  externalLinks: ExternalLink[];
  onImport: (result: ImportResult) => void;
  onClearAll: () => void;
}
