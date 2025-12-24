import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import type { ExternalLinksSettingsProps } from './ExternalLinksSettings.types';

export function ExternalLinksSettings({
  open,
  onClose,
  externalLinks,
  onAdd,
  onUpdate,
  onDelete,
  onToggle,
}: ExternalLinksSettingsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      onAdd({
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
        enabled: true,
      });
      setNewLinkName('');
      setNewLinkUrl('');
      setShowAddForm(false);
    }
  };

  const handleEdit = (id: string, name: string, url: string) => {
    onUpdate(id, { name, url });
    setEditingId(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>🔗</span>
          <span>External Reference Links</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure external links to search for brick information. The brick number will be appended to the URL.
        </Typography>

        <List>
          {externalLinks.map((link) => (
            <ListItem
              key={link.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              {editingId === link.id ? (
                <Box sx={{ width: '100%', display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <TextField
                    size="small"
                    label="Name"
                    defaultValue={link.name}
                    id={`edit-name-${link.id}`}
                  />
                  <TextField
                    size="small"
                    label="URL"
                    defaultValue={link.url}
                    id={`edit-url-${link.id}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        const nameInput = document.getElementById(`edit-name-${link.id}`) as HTMLInputElement;
                        const urlInput = document.getElementById(`edit-url-${link.id}`) as HTMLInputElement;
                        handleEdit(link.id, nameInput.value, urlInput.value);
                      }}
                    >
                      Save
                    </Button>
                    <Button size="small" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Switch
                    edge="start"
                    checked={link.enabled}
                    onChange={() => onToggle(link.id)}
                    inputProps={{ 'aria-label': `Enable ${link.name}` }}
                  />
                  <ListItemText
                    primary={link.name}
                    secondary={link.url}
                    sx={{ ml: 2 }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setEditingId(link.id)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(link.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>

        {showAddForm ? (
          <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add New Link
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              sx={{ mb: 1 }}
              placeholder="e.g., BrickLink"
            />
            <TextField
              fullWidth
              size="small"
              label="URL (without brick number)"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              sx={{ mb: 1 }}
              placeholder="e.g., https://www.bricklink.com/v2/search.page?q="
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={!newLinkName.trim() || !newLinkUrl.trim()}
              >
                Add Link
              </Button>
              <Button onClick={() => {
                setShowAddForm(false);
                setNewLinkName('');
                setNewLinkUrl('');
              }}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(true)}
            sx={{ mt: 2 }}
          >
            Add New Link
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
