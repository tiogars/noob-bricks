import { useState, useEffect } from 'react';
import type { Brick, BrickFormData } from '../types';
import { storageService } from '../storage/storageService';
import { brickService } from '../models/brickService';
import { imageService, isBase64DataUrl } from '../utils/imageService';
import { migrationService } from '../storage/migrationService';
import { imageStorageService } from '../storage/imageStorageService';

export function useBricks() {
  const [bricks, setBricks] = useState<Brick[]>(() => {
    const data = storageService.load();
    return data?.bricks || [];
  });
  const [tags, setTags] = useState<string[]>(() => {
    const data = storageService.load();
    return data?.tags || [];
  });
  const [migrationComplete, setMigrationComplete] = useState(false);

  // Run migration on first load
  useEffect(() => {
    const runMigration = async () => {
      if (!migrationComplete) {
        const result = await migrationService.migrate();
        if (result.success && result.migratedCount > 0) {
          // Reload data after migration
          const data = storageService.load();
          if (data) {
            setBricks(data.bricks);
            setTags(data.tags);
          }
        }
        setMigrationComplete(true);
      }
    };
    runMigration();
  }, [migrationComplete]);

  // Save data to localStorage whenever bricks change
  useEffect(() => {
    if (migrationComplete) {
      const data = storageService.load();
      const externalLinks = data?.externalLinks;
      storageService.save({ bricks, tags, externalLinks });
    }
  }, [bricks, tags, migrationComplete]);

  const addBrick = async (formData: BrickFormData) => {
    // If there's an image, save it to IndexedDB first
    let imageUrl = formData.imageUrl;
    if (imageUrl && isBase64DataUrl(imageUrl) && imageStorageService.isSupported()) {
      imageUrl = await imageService.saveImage(imageUrl);
    }

    const newBrick = brickService.createBrick({ ...formData, imageUrl });
    const updatedBricks = [...bricks, newBrick];
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const updateBrick = async (id: string, formData: BrickFormData) => {
    const existingBrick = bricks.find((brick) => brick.id === id);
    
    // Handle image update
    let imageUrl = formData.imageUrl;
    if (imageUrl && isBase64DataUrl(imageUrl) && imageStorageService.isSupported()) {
      // New image uploaded - save to IndexedDB
      imageUrl = await imageService.updateImage(existingBrick?.imageUrl, imageUrl);
    } else if (!imageUrl && existingBrick?.imageUrl) {
      // Image removed - delete from IndexedDB
      await imageService.deleteImage(existingBrick.imageUrl);
    }

    const updatedBricks = bricks.map((brick) =>
      brick.id === id ? brickService.updateBrick(brick, { ...formData, imageUrl }) : brick
    );
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const deleteBrick = async (id: string) => {
    const brick = bricks.find((b) => b.id === id);
    
    // Delete associated image if it exists
    if (brick?.imageUrl) {
      await storageService.deleteBrickWithImage(brick.id, brick.imageUrl);
    }

    const updatedBricks = bricks.filter((brick) => brick.id !== id);
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const importBricks = async (importedBricks: Brick[]) => {
    // Process imported bricks to handle images
    const processedBricks: Brick[] = [];
    
    for (const brick of importedBricks) {
      let imageUrl = brick.imageUrl;
      
      // If the imported brick has a base64 image, save it to IndexedDB
      if (imageUrl && isBase64DataUrl(imageUrl) && imageStorageService.isSupported()) {
        imageUrl = await imageService.saveImage(imageUrl);
      }
      
      processedBricks.push({ ...brick, imageUrl });
    }
    
    setBricks(processedBricks);
    updateTags(processedBricks);
  };

  const clearAllBricks = async () => {
    const data = storageService.load();
    const externalLinks = data?.externalLinks;
    setBricks([]);
    setTags([]);
    await storageService.clear();
    storageService.save({ bricks: [], tags: [], externalLinks });
  };

  const updateTags = (bricksList: Brick[]) => {
    const extractedTags = brickService.extractTags(bricksList);
    setTags(extractedTags);
  };

  return {
    bricks,
    tags,
    addBrick,
    updateBrick,
    deleteBrick,
    importBricks,
    clearAllBricks,
  };
}
