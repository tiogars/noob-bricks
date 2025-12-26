import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import type { ExportFormat } from '../../types';
import { exportService } from '../../utils/exportService';
import { enhancedExportService } from '../../utils/enhancedExportService';
import { importService, type ImportResult } from '../../utils/importService';
import type { ImportExportProps } from './ImportExport.types';

export function ImportExportContent({ bricks, externalLinks, onImport, onClearAll }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ result: ImportResult, count: number } | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (bricks.length === 0) {
      setImportError('No bricks to export!');
      return;
    }

    setIsExporting(true);
    setImportError(null);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = await enhancedExportService.toJSONWithImages(bricks, externalLinks);
          filename = `bricks-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          content = await enhancedExportService.toCSVWithImages(bricks, externalLinks);
          filename = `bricks-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'xml':
          content = await enhancedExportService.toXMLWithImages(bricks, externalLinks);
          filename = `bricks-${Date.now()}.xml`;
          mimeType = 'application/xml';
          break;
      }

      exportService.downloadFile(content, filename, mimeType);
      setImportError(null);
    } catch (error) {
      setImportError('Failed to export data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const content = await importService.readFile(file);
      const extension = file.name.split('.').pop()?.toLowerCase();

      let importResult: ImportResult;

      switch (extension) {
        case 'json':
          importResult = importService.fromJSON(content);
          break;
        case 'csv':
          importResult = importService.fromCSV(content);
          break;
        case 'xml':
          importResult = importService.fromXML(content);
          break;
        default:
          throw new Error('Unsupported file format. Please use JSON, CSV, or XML.');
      }

      if (importResult.bricks.length === 0) {
        throw new Error('No bricks found in the imported file.');
      }

      setPendingImport({ result: importResult, count: importResult.bricks.length });
      setImportDialogOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setImportError(errorMessage);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleImportConfirm = () => {
    if (pendingImport) {
      onImport(pendingImport.result);
      setImportDialogOpen(false);
      setPendingImport(null);
    }
  };

  const handleImportCancel = () => {
    setImportDialogOpen(false);
    setPendingImport(null);
  };

  const handleClearAll = () => {
    if (bricks.length === 0) {
      setImportError('No data to clear!');
      return;
    }
    setClearDialogOpen(true);
  };

  const handleClearConfirm = () => {
    onClearAll();
    setClearDialogOpen(false);
  };

  const handleClearCancel = () => {
    setClearDialogOpen(false);
  };

  return (
    <Box>
      {importError && (
        <Alert severity="error" onClose={() => setImportError(null)} sx={{ mb: 2 }}>
          {importError}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Export Your Data
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={() => handleExport('json')}
            disabled={bricks.length === 0 || isExporting}
            size="small"
          >
            JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={() => handleExport('csv')}
            disabled={bricks.length === 0 || isExporting}
            size="small"
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={() => handleExport('xml')}
            disabled={bricks.length === 0 || isExporting}
            size="small"
          >
            XML
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Import Data
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          disabled={isImporting}
          sx={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
            },
          }}
        >
          {isImporting ? 'Importing...' : 'Import File'}
          <input
            type="file"
            accept=".json,.csv,.xml"
            onChange={handleImport}
            disabled={isImporting}
            hidden
          />
        </Button>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Supports JSON, CSV, and XML formats
        </Typography>
      </Box>

      <Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForeverIcon />}
          onClick={handleClearAll}
          disabled={bricks.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            },
          }}
        >
          Clear All Data
        </Button>
      </Box>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={handleClearCancel}>
        <DialogTitle>Clear All Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all {bricks.length} brick(s)? This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel}>Cancel</Button>
          <Button onClick={handleClearConfirm} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <Dialog open={importDialogOpen} onClose={handleImportCancel}>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import {pendingImport?.count} brick(s)
            {pendingImport?.result.externalLinks && pendingImport.result.externalLinks.length > 0 
              ? ` and ${pendingImport.result.externalLinks.length} external link(s)` 
              : ''}? This will replace your current data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportCancel}>Cancel</Button>
          <Button onClick={handleImportConfirm} color="primary" variant="contained">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
