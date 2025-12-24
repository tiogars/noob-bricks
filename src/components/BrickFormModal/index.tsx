import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { BrickFormContent } from '../BrickForm/BrickFormContent';
import type { BrickFormProps } from '../BrickForm/BrickForm.types';

interface BrickFormModalProps extends BrickFormProps {
  open: boolean;
  onClose: () => void;
}

export function BrickFormModal({ open, onClose, onSubmit, editingBrick, onCancel, existingTags }: BrickFormModalProps) {
  const handleSubmit = (data: { number: string; title?: string; tags: string[]; imageUrl?: string }) => {
    onSubmit(data);
    // Always close modal after successful submission
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        {editingBrick ? '✏️ Edit Brick' : '➕ Add New Brick'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <BrickFormContent
          onSubmit={handleSubmit}
          editingBrick={editingBrick}
          onCancel={handleCancel}
          existingTags={existingTags}
        />
      </DialogContent>
    </Dialog>
  );
}
