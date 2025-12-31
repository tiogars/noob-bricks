import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BrickFormProps, BrickFormInputs } from './BrickForm.types';

export function BrickForm({ onSubmit, editingBrick, onCancel, existingTags, existingBricks }: BrickFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(editingBrick?.imageUrl);
  const [imageError, setImageError] = useState<string>('');
  
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
      imageUrl: editingBrick?.imageUrl || '',
    },
    mode: 'onBlur',
  });

  const selectedTags = watch('tags');

  // Reset form when editingBrick changes
  useEffect(() => {
    reset({
      number: editingBrick?.number || '',
      title: editingBrick?.title || '',
      tags: editingBrick?.tags || [],
      imageUrl: editingBrick?.imageUrl || '',
    });
    setImagePreview(editingBrick?.imageUrl);
  }, [editingBrick, reset]);

  const onFormSubmit = (data: BrickFormInputs) => {
    onSubmit({
      number: data.number.trim(),
      title: data.title?.trim() || undefined,
      tags: data.tags,
      imageUrl: data.imageUrl,
    });

    // Reset form after submission if not editing
    if (!editingBrick) {
      reset({
        number: '',
        title: '',
        tags: [],
        imageUrl: '',
      });
      setTagInput('');
      setImagePreview(undefined);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 500KB for localStorage efficiency)
      if (file.size > 500 * 1024) {
        setImageError('Image size should be less than 500KB for optimal storage. Please resize your image.');
        e.target.value = ''; // Reset file input
        return;
      }

      setImageError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('imageUrl', base64String, { shouldValidate: true });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('imageUrl', '', { shouldValidate: true });
    setImagePreview(undefined);
    setImageError('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        {editingBrick ? '✏️ Edit Brick' : '➕ Add New Brick'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Stack spacing={3}>
          <Controller
            name="number"
            control={control}
            rules={{
              required: 'Brick number is required',
              validate: {
                notEmpty: (value) => value.trim().length > 0 || 'Brick number cannot be empty',
                unique: (value) => {
                  const trimmedValue = value.trim();
                  const duplicate = existingBricks.find(
                    (brick) => brick.number === trimmedValue && brick.id !== editingBrick?.id
                  );
                  return !duplicate || 'This brick number already exists';
                },
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Brick Number"
                placeholder="e.g., 12345"
                required
                fullWidth
                error={!!errors.number}
                helperText={errors.number?.message}
              />
            )}
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title (Optional)"
                placeholder="e.g., My favorite brick"
                fullWidth
              />
            )}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Brick Image (Optional)
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {imagePreview && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
            {imagePreview && (
              <Box sx={{ mt: 2, maxWidth: 200 }}>
                <CardMedia
                  component="img"
                  image={imagePreview}
                  alt="Brick preview"
                  sx={{
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
              </Box>
            )}
            {imageError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {imageError}
              </Typography>
            )}
            {!imageError && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Recommended: JPEG or PNG, max 500KB, 300x300px or smaller
              </Typography>
            )}
          </Box>

          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                label="Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag and press Enter"
                fullWidth
                size="small"
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                sx={{ minWidth: '100px' }}
              >
                Add Tag
              </Button>
            </Stack>

            {existingTags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Quick add:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {existingTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleQuickAddTag(tag)}
                      disabled={selectedTags.includes(tag)}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {selectedTags.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Selected tags:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {selectedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={editingBrick ? <SaveIcon /> : <AddIcon />}
              fullWidth
            >
              {editingBrick ? 'Update Brick' : 'Add Brick'}
            </Button>
            {editingBrick && (
              <Button
                variant="outlined"
                onClick={onCancel}
                fullWidth
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
