import type { Brick } from '../types';

const STORAGE_KEY = 'noob-bricks-data';

export interface StorageData {
  bricks: Brick[];
  tags: string[];
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
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear all data from localStorage
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw new Error('Failed to clear data');
    }
  },
};
