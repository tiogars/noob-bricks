import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Brick, ExternalLink } from '../../types';
import { useImage } from '../../hooks/useImage';

interface BrickCardProps {
  brick: Brick;
  onEdit: (brick: Brick) => void;
  onDelete: (brick: Brick) => void;
  externalLinks: ExternalLink[];
}

export function BrickCard({ brick, onEdit, onDelete, externalLinks }: BrickCardProps) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imageData = useImage(brick.imageUrl);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoadError(true);
    setImageLoading(false);
  };

  return (
    <Card>
      {brick.imageUrl && (
        <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'grey.100' }}>
          {imageLoading && !imageLoadError && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          )}
          {!imageLoadError && imageData && (
            <CardMedia
              component="img"
              image={imageData}
              alt={`Brick ${brick.number}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoading ? 'none' : 'block',
              }}
            />
          )}
        </Box>
      )}
      {!brick.imageUrl && (
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '4rem',
              opacity: 0.3,
            }}
          >
            🧱
          </Typography>
        </Box>
      )}
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            🧱 {brick.number}
          </Typography>
          <CardActions sx={{ p: 0 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(brick)}
              aria-label="Edit brick"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(brick)}
              aria-label="Delete brick"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </Box>

        {brick.title && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {brick.title}
          </Typography>
        )}

        {brick.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {brick.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        )}

        {externalLinks.filter(link => link.enabled).length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {externalLinks
              .filter(link => link.enabled)
              .map((link) => (
                <Tooltip key={link.id} title={`Search on ${link.name}`}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => window.open(`${link.url}${brick.number}`, '_blank')}
                  >
                    {link.name}
                  </Button>
                </Tooltip>
              ))}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(brick.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
