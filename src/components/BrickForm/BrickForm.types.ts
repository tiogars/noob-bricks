import type { Brick } from '../../types';

export interface BrickFormProps {
  onSubmit: (formData: { number: string; title?: string; tags: string[] }) => void;
  editingBrick: Brick | null;
  onCancel: () => void;
  existingTags: string[];
}
