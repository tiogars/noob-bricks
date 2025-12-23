import { brickService } from '../../models/brickService';
import type { PrintViewProps } from './PrintView.types';
import './PrintView.css';

export function PrintView({ bricks, selectedTags, onClose }: PrintViewProps) {
  const sortedBricks = brickService.sortByNumber(bricks);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-view">
      <div className="print-controls no-print">
        <button onClick={onClose} className="btn btn-secondary">
          ← Back
        </button>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print
        </button>
      </div>

      <div className="print-content">
        <header className="print-header">
          <h1>🧱 Brick Manager</h1>
          <h2>Brick List</h2>
          {selectedTags.length > 0 && (
            <p className="print-filter-info">
              Filtered by tags: <strong>{selectedTags.join(', ')}</strong>
            </p>
          )}
          <p className="print-date">Generated: {new Date().toLocaleString()}</p>
        </header>

        {sortedBricks.length === 0 ? (
          <div className="print-empty">
            <p>No bricks to display.</p>
          </div>
        ) : (
          <table className="print-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {sortedBricks.map((brick) => (
                <tr key={brick.id}>
                  <td className="brick-number-col">{brick.number}</td>
                  <td>{brick.title || '-'}</td>
                  <td>
                    {brick.tags.length > 0 ? brick.tags.join(', ') : '-'}
                  </td>
                  <td>{new Date(brick.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <footer className="print-footer">
          <p>Total bricks: {sortedBricks.length}</p>
        </footer>
      </div>
    </div>
  );
}
