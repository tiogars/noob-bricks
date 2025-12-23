import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { BrickFormProps, BrickFormInputs } from './BrickForm.types';
import './BrickForm.css';

export function BrickForm({ onSubmit, editingBrick, onCancel, existingTags }: BrickFormProps) {
  const [tagInput, setTagInput] = useState('');
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BrickFormInputs>({
    defaultValues: {
      number: editingBrick?.number || '',
      title: editingBrick?.title || '',
      tags: editingBrick?.tags || [],
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const selectedTags = watch('tags');

  // Reset form when editingBrick changes
  useEffect(() => {
    reset({
      number: editingBrick?.number || '',
      title: editingBrick?.title || '',
      tags: editingBrick?.tags || [],
    });
  }, [editingBrick, reset]);

  const onFormSubmit = (data: BrickFormInputs) => {
    onSubmit({
      number: data.number.trim(),
      title: data.title?.trim() || undefined,
      tags: data.tags,
    });

    // Reset form after submission if not editing
    if (!editingBrick) {
      reset({
        number: '',
        title: '',
        tags: [],
      });
      setTagInput('');
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setValue('tags', [...selectedTags, tag], { shouldValidate: true });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue('tags', selectedTags.filter((t) => t !== tag), { shouldValidate: true });
  };

  const handleQuickAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setValue('tags', [...selectedTags, tag], { shouldValidate: true });
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
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="brick-form">
        <div className="form-group">
          <label htmlFor="brick-number">
            Brick Number <span className="required">*</span>
          </label>
          <Controller
            name="number"
            control={control}
            rules={{
              required: 'Brick number is required',
              validate: {
                notEmpty: (value) => value.trim().length > 0 || 'Brick number cannot be empty',
              },
            }}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="text"
                  id="brick-number"
                  placeholder="e.g., 12345"
                  className={`form-input ${errors.number ? 'error' : ''}`}
                />
                {errors.number && (
                  <span className="error-message">{errors.number.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div className="form-group">
          <label htmlFor="brick-title">Title (Optional)</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="brick-title"
                placeholder="e.g., My favorite brick"
                className="form-input"
              />
            )}
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
