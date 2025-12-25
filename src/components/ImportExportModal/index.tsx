import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ImportExportContent } from '../ImportExport/ImportExportContent';
import type { ImportExportProps } from '../ImportExport/ImportExport.types';

interface ImportExportModalProps extends ImportExportProps {
  open: boolean;
  onClose: () => void;
}

export function ImportExportModal({ open, onClose, bricks, externalLinks, onImport, onClearAll }: ImportExportModalProps) {
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
        💾 Import / Export
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
        <ImportExportContent
          bricks={bricks}
          externalLinks={externalLinks}
          onImport={onImport}
          onClearAll={onClearAll}
        />
      </DialogContent>
    </Dialog>
  );
}
