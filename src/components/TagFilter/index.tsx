import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import type { TagFilterProps } from './TagFilter.types';

export function TagFilter({ tags, selectedTags, onTagsChange }: TagFilterProps) {
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
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          🏷️ Filter by Tags
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {selectedTags.length > 0 && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          )}
          {selectedTags.length !== tags.length && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<SelectAllIcon />}
              onClick={handleSelectAll}
            >
              Select All
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleToggleTag(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      {selectedTags.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          Showing bricks with tags: <strong>{selectedTags.join(', ')}</strong>
        </Typography>
      )}
    </Paper>
  );
}
