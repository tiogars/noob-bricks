import type { ExternalLink } from '../../types';

export interface ExternalLinksSettingsProps {
  open: boolean;
  onClose: () => void;
  externalLinks: ExternalLink[];
  onAdd: (link: Omit<ExternalLink, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<ExternalLink>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}
