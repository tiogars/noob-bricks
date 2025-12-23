import { useState } from 'react';
import type { BrickFormProps } from './BrickForm.types';
import './BrickForm.css';

export function BrickForm({ onSubmit, editingBrick, onCancel, existingTags }: BrickFormProps) {
  const [number, setNumber] = useState(editingBrick?.number || '');
  const [title, setTitle] = useState(editingBrick?.title || '');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(editingBrick?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) {
      alert('Brick number is required!');
      return;
    }

    onSubmit({
      number: number.trim(),
      title: title.trim() || undefined,
      tags: selectedTags,
    });

    setNumber('');
    setTitle('');
    setSelectedTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleQuickAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="brick-form-container">
      <h2 className="form-title">
        {editingBrick ? '✏️ Edit Brick' : '➕ Add New Brick'}
      </h2>
      
      <form onSubmit={handleSubmit} className="brick-form">
        <div className="form-group">
          <label htmlFor="brick-number">
            Brick Number <span className="required">*</span>
          </label>
          <input
            type="text"
            id="brick-number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g., 12345"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="brick-title">Title (Optional)</label>
          <input
            type="text"
            id="brick-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My favorite brick"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag-input">Tags</label>
          <div className="tag-input-group">
            <input
              type="text"
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter tag and press Enter"
              className="form-input"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary"
              disabled={!tagInput.trim()}
            >
              Add Tag
            </button>
          </div>

          {existingTags.length > 0 && (
            <div className="quick-tags">
              <span className="quick-tags-label">Quick add:</span>
              {existingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickAddTag(tag)}
                  className="quick-tag-btn"
                  disabled={selectedTags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="selected-tags">
              {selectedTags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingBrick ? '💾 Update Brick' : '➕ Add Brick'}
          </button>
          {editingBrick && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
