import type { Brick, ExternalLink } from '../types';
import { imageStorageService } from './imageStorageService';

const STORAGE_KEY = 'noob-bricks-data';
const FIRST_LAUNCH_KEY = 'noob-bricks-first-launch';

const DEFAULT_EXTERNAL_LINKS: ExternalLink[] = [
  {
    id: 'lego',
    name: 'LEGO',
    url: 'https://www.lego.com/product/',
    enabled: true,
  },
];

export interface StorageData {
  bricks: Brick[];
  tags: string[];
  externalLinks?: ExternalLink[];
}

export const storageService = {
  /**
   * Save data to localStorage
   */
  save(data: StorageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      throw new Error('Failed to save data');
    }
  },

  /**
   * Load data from localStorage
   */
  load(): StorageData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }
      const parsed = JSON.parse(data);
      // Initialize externalLinks with defaults if not present
      if (!parsed.externalLinks) {
        parsed.externalLinks = DEFAULT_EXTERNAL_LINKS;
      }
      return parsed;
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear all data from localStorage and IndexedDB
   */
  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also clear images from IndexedDB
      if (imageStorageService.isSupported()) {
        await imageStorageService.clearAll();
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Failed to clear data');
    }
  },

  /**
   * Delete a brick and its associated image
   */
  async deleteBrickWithImage(_brickId: string, imageUrl?: string): Promise<void> {
    // Delete image from IndexedDB if it's an image ID (not a base64 data URL)
    if (imageUrl && !imageUrl.startsWith('data:image/') && imageStorageService.isSupported()) {
      try {
        await imageStorageService.deleteImage(imageUrl);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // Continue even if image deletion fails
      }
    }
  },

  /**
   * Get external links
   */
  getExternalLinks(): ExternalLink[] {
    const data = this.load();
    return data?.externalLinks || DEFAULT_EXTERNAL_LINKS;
  },

  /**
   * Save external links
   */
  saveExternalLinks(externalLinks: ExternalLink[]): void {
    const data = this.load() || { bricks: [], tags: [], externalLinks: [] };
    data.externalLinks = externalLinks;
    this.save(data);
  },

  /**
   * Check if this is the first launch
   */
  isFirstLaunch(): boolean {
    try {
      const hasSeenDisclaimer = localStorage.getItem(FIRST_LAUNCH_KEY);
      return hasSeenDisclaimer === null;
    } catch (error) {
      console.error('Failed to check first launch status:', error);
      return false;
    }
  },

  /**
   * Mark that the disclaimer has been shown
   */
  markDisclaimerShown(): void {
    try {
      localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    } catch (error) {
      console.error('Failed to mark disclaimer as shown:', error);
    }
  },
};
