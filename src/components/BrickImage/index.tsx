import { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useImage } from '../../hooks/useImage';

interface BrickImageProps {
  imageId?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Component that handles loading images from IndexedDB or displaying base64 images
 */
export function BrickImage({ imageId, alt, width, height, style, className }: BrickImageProps) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imageData = useImage(imageId);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoadError(true);
    setImageLoading(false);
  };

  if (!imageId) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {imageLoading && !imageLoadError && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      {!imageLoadError && imageData && (
        <img
          src={imageData}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            ...style,
            display: imageLoading ? 'none' : 'block',
          }}
          className={className}
        />
      )}
    </Box>
  );
}
