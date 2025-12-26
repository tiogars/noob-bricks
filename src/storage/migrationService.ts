import type { Brick } from '../types';
import { storageService, type StorageData } from './storageService';
import { imageStorageService } from './imageStorageService';

const MIGRATION_KEY = 'noob-bricks-migration-v1';

/**
 * Generate a unique ID for an image
 */
function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Check if a string is a base64 data URL
 */
function isBase64DataUrl(str: string | undefined): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

export const migrationService = {
  /**
   * Check if migration has been completed
   */
  hasMigrated(): boolean {
    try {
      return localStorage.getItem(MIGRATION_KEY) === 'true';
    } catch (error) {
      console.error('Failed to check migration status:', error);
      return false;
    }
  },

  /**
   * Mark migration as completed
   */
  markMigrated(): void {
    try {
      localStorage.setItem(MIGRATION_KEY, 'true');
    } catch (error) {
      console.error('Failed to mark migration as completed:', error);
    }
  },

  /**
   * Migrate from old storage format (base64 images in localStorage) 
   * to new format (image references with IndexedDB storage)
   */
  async migrate(): Promise<{ success: boolean; migratedCount: number; error?: string }> {
    // Check if migration is needed
    if (this.hasMigrated()) {
      return { success: true, migratedCount: 0 };
    }

    // Check if IndexedDB is supported
    if (!imageStorageService.isSupported()) {
      console.warn('IndexedDB not supported, skipping migration');
      this.markMigrated();
      return { success: true, migratedCount: 0 };
    }

    try {
      // Load existing data
      const data = storageService.load();
      if (!data || data.bricks.length === 0) {
        this.markMigrated();
        return { success: true, migratedCount: 0 };
      }

      let migratedCount = 0;
      const updatedBricks: Brick[] = [];

      // Process each brick
      for (const brick of data.bricks) {
        // Check if brick has a base64 image
        if (brick.imageUrl && isBase64DataUrl(brick.imageUrl)) {
          // Generate a new image ID
          const imageId = generateImageId();

          // Store the image in IndexedDB
          await imageStorageService.saveImage(imageId, brick.imageUrl);

          // Update brick to reference the image ID instead of storing data
          updatedBricks.push({
            ...brick,
            imageUrl: imageId,
          });

          migratedCount++;
        } else {
          // Keep brick as-is if no image or already migrated
          updatedBricks.push(brick);
        }
      }

      // Save updated data
      if (migratedCount > 0) {
        const updatedData: StorageData = {
          ...data,
          bricks: updatedBricks,
        };
        storageService.save(updatedData);
      }

      // Mark migration as completed
      this.markMigrated();

      console.log(`Migration completed: ${migratedCount} images moved to IndexedDB`);
      return { success: true, migratedCount };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        migratedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Reset migration status (for testing purposes)
   */
  resetMigration(): void {
    try {
      localStorage.removeItem(MIGRATION_KEY);
    } catch (error) {
      console.error('Failed to reset migration status:', error);
    }
  },
};
