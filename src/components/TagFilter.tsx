import './TagFilter.css';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onPrint: () => void;
}

export function TagFilter({ tags, selectedTags, onTagsChange, onPrint }: TagFilterProps) {
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearFilter = () => {
    onTagsChange([]);
  };

  const handleSelectAll = () => {
    onTagsChange(tags);
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="tag-filter">
      <div className="filter-header">
        <h2 className="filter-title">🏷️ Filter by Tags</h2>
        <div className="filter-actions">
          {selectedTags.length > 0 && (
            <button onClick={handleClearFilter} className="btn btn-small">
              Clear Filter
            </button>
          )}
          {selectedTags.length !== tags.length && (
            <button onClick={handleSelectAll} className="btn btn-small">
              Select All
            </button>
          )}
          <button onClick={onPrint} className="btn btn-small btn-print">
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="tags-container">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleToggleTag(tag)}
            className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <p className="filter-info">
          Showing bricks with tags: <strong>{selectedTags.join(', ')}</strong>
        </p>
      )}
    </div>
  );
}
