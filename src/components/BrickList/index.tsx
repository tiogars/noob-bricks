import type { BrickListProps } from './BrickList.types';
import { brickService } from '../../models/brickService';
import './BrickList.css';

export function BrickList({ bricks, onEdit, onDelete }: BrickListProps) {
  const sortedBricks = brickService.sortByNumber(bricks);

  const handleDelete = (brick: BrickListProps['bricks'][0]) => {
    if (window.confirm(`Are you sure you want to delete brick ${brick.number}?`)) {
      onDelete(brick.id);
    }
  };

  if (bricks.length === 0) {
    return (
      <div className="brick-list-empty">
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No bricks yet!</h3>
          <p>Add your first brick using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brick-list">
      <h2 className="list-title">
        📋 Your Bricks <span className="brick-count">({bricks.length})</span>
      </h2>
      
      <div className="bricks-grid">
        {sortedBricks.map((brick) => (
          <div key={brick.id} className="brick-card">
            <div className="brick-header">
              <h3 className="brick-number">🧱 {brick.number}</h3>
              <div className="brick-actions">
                <button
                  onClick={() => onEdit(brick)}
                  className="btn-icon btn-edit"
                  title="Edit brick"
                  aria-label="Edit brick"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(brick)}
                  className="btn-icon btn-delete"
                  title="Delete brick"
                  aria-label="Delete brick"
                >
                  🗑️
                </button>
              </div>
            </div>

            {brick.title && (
              <p className="brick-title">{brick.title}</p>
            )}

            {brick.tags.length > 0 && (
              <div className="brick-tags">
                {brick.tags.map((tag) => (
                  <span key={tag} className="tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="brick-meta">
              <small>Created: {new Date(brick.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
