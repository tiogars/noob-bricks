import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import type { BrickListProps } from './BrickList.types';
import { brickService } from '../../models/brickService';
import { BrickCard } from '../BrickCard';

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
          <BrickCard
            key={brick.id}
            brick={brick}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            externalLinks={externalLinks}
          />
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
