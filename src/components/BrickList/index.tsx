import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import type { BrickListProps } from './BrickList.types';
import { brickService } from '../../models/brickService';

export function BrickList({ bricks, onEdit, onDelete, externalLinks = [] }: BrickListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brickToDelete, setBrickToDelete] = useState<BrickListProps['bricks'][0] | null>(null);
  const sortedBricks = brickService.sortByNumber(bricks);

  const handleDeleteClick = (brick: BrickListProps['bricks'][0]) => {
    setBrickToDelete(brick);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (brickToDelete) {
      onDelete(brickToDelete.id);
      setDeleteDialogOpen(false);
      setBrickToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBrickToDelete(null);
  };

  if (bricks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
        }}
      >
        <Typography variant="h2" component="div" sx={{ fontSize: '4rem', mb: 2 }}>
          📦
        </Typography>
        <Typography variant="h5" component="h3" gutterBottom>
          No bricks yet!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add your first brick using the form above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📋 Your Bricks{' '}
        <Typography component="span" variant="h6" color="text.secondary">
          ({bricks.length})
        </Typography>
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {sortedBricks.map((brick) => (
          <Card key={brick.id}>
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
                    onClick={() => handleDeleteClick(brick)}
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
        ))}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Brick</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete brick {brickToDelete?.number}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
