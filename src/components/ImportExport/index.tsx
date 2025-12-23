import { useState } from 'react';
import type { Brick, ExportFormat } from '../../types';
import { exportService } from '../../utils/exportService';
import { importService } from '../../utils/importService';
import type { ImportExportProps } from './ImportExport.types';
import './ImportExport.css';

export function ImportExport({ bricks, onImport, onClearAll }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = (format: ExportFormat) => {
    if (bricks.length === 0) {
      alert('No bricks to export!');
      return;
    }

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = exportService.toJSON(bricks);
          filename = `bricks-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          content = exportService.toCSV(bricks);
          filename = `bricks-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'xml':
          content = exportService.toXML(bricks);
          filename = `bricks-${Date.now()}.xml`;
          mimeType = 'application/xml';
          break;
      }

      exportService.downloadFile(content, filename, mimeType);
    } catch (error) {
      alert('Failed to export data: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

      let importedBricks: Brick[];

      switch (extension) {
        case 'json':
          importedBricks = importService.fromJSON(content);
          break;
        case 'csv':
          importedBricks = importService.fromCSV(content);
          break;
        case 'xml':
          importedBricks = importService.fromXML(content);
          break;
        default:
          throw new Error('Unsupported file format. Please use JSON, CSV, or XML.');
      }

      if (importedBricks.length === 0) {
        throw new Error('No bricks found in the imported file.');
      }

      const shouldReplace = window.confirm(
        `Import ${importedBricks.length} brick(s)? This will replace your current data.`
      );

      if (shouldReplace) {
        onImport(importedBricks);
        alert(`Successfully imported ${importedBricks.length} brick(s)!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setImportError(errorMessage);
      alert('Import failed: ' + errorMessage);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleClearAll = () => {
    if (bricks.length === 0) {
      alert('No data to clear!');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all bricks? This action cannot be undone!'
    );

    if (confirmed) {
      onClearAll();
      alert('All bricks have been deleted.');
    }
  };

  return (
    <div className="import-export-container">
      <h2 className="section-title">💾 Import / Export</h2>

      <div className="export-section">
        <h3 className="subsection-title">Export Your Data</h3>
        <div className="button-group">
          <button
            onClick={() => handleExport('json')}
            className="btn btn-export"
            disabled={bricks.length === 0}
          >
            📄 Export JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-export"
            disabled={bricks.length === 0}
          >
            📊 Export CSV
          </button>
          <button
            onClick={() => handleExport('xml')}
            className="btn btn-export"
            disabled={bricks.length === 0}
          >
            📋 Export XML
          </button>
        </div>
      </div>

      <div className="import-section">
        <h3 className="subsection-title">Import Data</h3>
        <label className="import-label">
          <input
            type="file"
            accept=".json,.csv,.xml"
            onChange={handleImport}
            disabled={isImporting}
            className="import-input"
          />
          <span className="btn btn-import">
            {isImporting ? '⏳ Importing...' : '📥 Import File'}
          </span>
        </label>
        <p className="import-note">Supports JSON, CSV, and XML formats</p>
        {importError && (
          <p className="import-error">❌ {importError}</p>
        )}
      </div>

      <div className="danger-section">
        <button
          onClick={handleClearAll}
          className="btn btn-danger"
          disabled={bricks.length === 0}
        >
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
}
