export interface Brick {
  id: string;
  number: string;
  title?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrickFormData {
  number: string;
  title?: string;
  tags: string[];
}

export type ExportFormat = 'json' | 'csv' | 'xml';

export interface AppState {
  bricks: Brick[];
  tags: string[];
}
