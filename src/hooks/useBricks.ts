import { useState, useEffect } from 'react';
import type { Brick, BrickFormData } from '../types';
import { storageService } from '../storage/storageService';
import { brickService } from '../models/brickService';

export function useBricks() {
  const [bricks, setBricks] = useState<Brick[]>(() => {
    const data = storageService.load();
    return data?.bricks || [];
  });
  const [tags, setTags] = useState<string[]>(() => {
    const data = storageService.load();
    return data?.tags || [];
  });

  // Save data to localStorage whenever bricks change
  useEffect(() => {
    if (bricks.length > 0 || tags.length > 0) {
      storageService.save({ bricks, tags });
    }
  }, [bricks, tags]);

  const addBrick = (formData: BrickFormData) => {
    const newBrick = brickService.createBrick(formData);
    const updatedBricks = [...bricks, newBrick];
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const updateBrick = (id: string, formData: BrickFormData) => {
    const updatedBricks = bricks.map((brick) =>
      brick.id === id ? brickService.updateBrick(brick, formData) : brick
    );
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const deleteBrick = (id: string) => {
    const updatedBricks = bricks.filter((brick) => brick.id !== id);
    setBricks(updatedBricks);
    updateTags(updatedBricks);
  };

  const importBricks = (importedBricks: Brick[]) => {
    setBricks(importedBricks);
    updateTags(importedBricks);
  };

  const clearAllBricks = () => {
    setBricks([]);
    setTags([]);
    storageService.clear();
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
