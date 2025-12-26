import { imageStorageService } from '../storage/imageStorageService';

/**
 * Generate a unique ID for an image
 */
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataUrl(str: string | undefined): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Check if a string is an image ID reference
 */
export function isImageId(str: string | undefined): boolean {
  if (!str) return false;
  return str.startsWith('img-') && !str.startsWith('data:image/');
}

export const imageService = {
  /**
   * Save an image (base64 data URL) to IndexedDB and return its ID
   */
  async saveImage(base64Data: string): Promise<string> {
    if (!imageStorageService.isSupported()) {
      // Fallback: return the base64 data as-is if IndexedDB is not supported
      return base64Data;
    }

    const imageId = generateImageId();
    await imageStorageService.saveImage(imageId, base64Data);
    return imageId;
  },

  /**
   * Get an image's base64 data URL from IndexedDB using its ID
   */
  async getImage(imageId: string): Promise<string | null> {
    // If it's already a base64 data URL, return it
    if (isBase64DataUrl(imageId)) {
      return imageId;
    }

    // Otherwise, fetch from IndexedDB
    if (!imageStorageService.isSupported()) {
      return null;
    }

    return await imageStorageService.getImage(imageId);
  },

  /**
   * Delete an image from IndexedDB
   */
  async deleteImage(imageId: string): Promise<void> {
    // Only delete if it's an image ID reference (not a base64 data URL)
    if (!isImageId(imageId)) {
      return;
    }

    if (imageStorageService.isSupported()) {
      await imageStorageService.deleteImage(imageId);
    }
  },

  /**
   * Update an image: delete the old one and save the new one
   */
  async updateImage(oldImageId: string | undefined, newBase64Data: string): Promise<string> {
    // Delete old image if it exists
    if (oldImageId && isImageId(oldImageId)) {
      await this.deleteImage(oldImageId);
    }

    // Save new image
    return await this.saveImage(newBase64Data);
  },
};
