/**
 * IndexedDB service for storing brick images
 * This service stores images separately from brick metadata to avoid localStorage limits
 */

const DB_NAME = 'noob-bricks-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export interface ImageData {
  id: string;
  data: string; // base64 data URL
  createdAt: string;
}

class ImageStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize the IndexedDB database
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Store an image in IndexedDB
   */
  async saveImage(id: string, data: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const imageData: ImageData = {
        id,
        data,
        createdAt: new Date().toISOString(),
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(imageData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to save image'));
      });
    } catch (error) {
      console.error('Failed to save image to IndexedDB:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Retrieve an image from IndexedDB
   */
  async getImage(id: string): Promise<string | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => {
          const result = request.result as ImageData | undefined;
          resolve(result ? result.data : null);
        };
        request.onerror = () => reject(new Error('Failed to get image'));
      });
    } catch (error) {
      console.error('Failed to get image from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Delete an image from IndexedDB
   */
  async deleteImage(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to delete image'));
      });
    } catch (error) {
      console.error('Failed to delete image from IndexedDB:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Get all image IDs from IndexedDB
   */
  async getAllImageIds(): Promise<string[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = () => {
          resolve(request.result as string[]);
        };
        request.onerror = () => reject(new Error('Failed to get image IDs'));
      });
    } catch (error) {
      console.error('Failed to get image IDs from IndexedDB:', error);
      return [];
    }
  }

  /**
   * Clear all images from IndexedDB
   */
  async clearAll(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to clear images'));
      });
    } catch (error) {
      console.error('Failed to clear images from IndexedDB:', error);
      throw new Error('Failed to clear images');
    }
  }

  /**
   * Check if IndexedDB is supported
   */
  isSupported(): boolean {
    return typeof indexedDB !== 'undefined';
  }
}

export const imageStorageService = new ImageStorageService();
