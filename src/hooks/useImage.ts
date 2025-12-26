import { useState, useEffect } from 'react';
import { imageService, isBase64DataUrl } from '../utils/imageService';

/**
 * Custom hook to load an image from IndexedDB or return the base64 data URL directly
 */
export function useImage(imageId: string | undefined): string | undefined {
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (!imageId) {
        setImageData(undefined);
        return;
      }

      // If it's already a base64 data URL, use it directly
      if (isBase64DataUrl(imageId)) {
        setImageData(imageId);
        return;
      }

      // Otherwise, load from IndexedDB
      try {
        const data = await imageService.getImage(imageId);
        if (mounted) {
          setImageData(data || undefined);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        if (mounted) {
          setImageData(undefined);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [imageId]);

  return imageData;
}
