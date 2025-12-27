import { useEffect, useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdUnitsIcon from '@mui/icons-material/AdUnits';

interface AdModalProps {
  open: boolean;
  timestamp: number;
  onClose: () => void;
}

function AdModalContent({ onClose }: { onClose: () => void }) {
  const [countdown, setCountdown] = useState(5);
  const canClose = countdown === 0;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start countdown on mount
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <AdUnitsIcon color="primary" />
        <Typography variant="h6" component="span">
          Advertisement
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', py: 4 }}>
          <Box
            sx={{
              width: '100%',
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Ad Space Placeholder
            </Typography>
          </Box>
          
          {!canClose && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Please wait {countdown} second{countdown !== 1 ? 's' : ''} before closing...
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          fullWidth
          disabled={!canClose}
          sx={{
            background: canClose 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : undefined,
            '&:hover': canClose ? {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            } : undefined,
          }}
        >
          {canClose ? 'Close' : `Wait ${countdown}s`}
        </Button>
      </DialogActions>
    </>
  );
}

export function AdModal({ open, timestamp, onClose }: AdModalProps) {
  const handleClose = () => {
    // Only allow closing via the button in AdModalContent
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      {open && <AdModalContent key={timestamp} onClose={onClose} />}
    </Dialog>
  );
}
