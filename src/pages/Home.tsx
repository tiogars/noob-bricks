import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import { useBricks } from '../hooks/useBricks';
import { useExternalLinks } from '../hooks/useExternalLinks';
import { Header } from '../components/Header';
import { BrickFormModal } from '../components/BrickFormModal';
import { BrickList } from '../components/BrickList';
import { TagFilter } from '../components/TagFilter';
import { ImportExportModal } from '../components/ImportExportModal';
import { ExternalLinksSettings } from '../components/ExternalLinksSettings';
import { Footer } from '../components/Footer';
import type { Brick } from '../types';

export function Home() {
  const navigate = useNavigate();
  const { bricks, tags, addBrick, updateBrick, deleteBrick, importBricks, clearAllBricks } = useBricks();
  const { externalLinks, addExternalLink, updateExternalLink, deleteExternalLink, toggleExternalLink } = useExternalLinks();
  const [editingBrick, setEditingBrick] = useState<Brick | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [brickFormModalOpen, setBrickFormModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [externalLinksSettingsOpen, setExternalLinksSettingsOpen] = useState(false);

  const handleEdit = (brick: Brick) => {
    setEditingBrick(brick);
    setBrickFormModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingBrick(null);
  };

  const handleFormSubmit = (formData: { number: string; title?: string; tags: string[] }) => {
    if (editingBrick) {
      updateBrick(editingBrick.id, formData);
      setEditingBrick(null);
    } else {
      addBrick(formData);
    }
  };

  const filteredBricks = selectedTags.length > 0
    ? bricks.filter((brick) => selectedTags.some((tag) => brick.tags.includes(tag)))
    : bricks;

  const handlePrint = () => {
    navigate('/print', { state: { bricks: filteredBricks, selectedTags } });
  };

  const handleBrickFormModalClose = () => {
    setBrickFormModalOpen(false);
    setEditingBrick(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Box>
          <TagFilter
            tags={tags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            onPrint={handlePrint}
          />

          <BrickList
            bricks={filteredBricks}
            onEdit={handleEdit}
            onDelete={deleteBrick}
            externalLinks={externalLinks}
          />
        </Box>
      </Container>
      
      <Footer />

      {/* Floating Action Buttons */}
      <Tooltip title="Add New Brick" placement="left">
        <Fab
          color="primary"
          aria-label="add brick"
          onClick={() => setBrickFormModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <Tooltip title="Import / Export" placement="left">
        <Fab
          color="secondary"
          aria-label="import export"
          onClick={() => setImportExportModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            },
          }}
        >
          <ImportExportIcon />
        </Fab>
      </Tooltip>

      <Tooltip title="External Links Settings" placement="left">
        <Fab
          aria-label="external links settings"
          onClick={() => setExternalLinksSettingsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 168,
            right: 24,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            },
          }}
        >
          <SettingsIcon />
        </Fab>
      </Tooltip>

      {/* Modals */}
      <BrickFormModal
        open={brickFormModalOpen}
        onClose={handleBrickFormModalClose}
        onSubmit={handleFormSubmit}
        editingBrick={editingBrick}
        onCancel={handleCancelEdit}
        existingTags={tags}
      />

      <ImportExportModal
        open={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        bricks={bricks}
        onImport={importBricks}
        onClearAll={clearAllBricks}
      />

      <ExternalLinksSettings
        open={externalLinksSettingsOpen}
        onClose={() => setExternalLinksSettingsOpen(false)}
        externalLinks={externalLinks}
        onAdd={addExternalLink}
        onUpdate={updateExternalLink}
        onDelete={deleteExternalLink}
        onToggle={toggleExternalLink}
      />
    </Box>
  );
}
