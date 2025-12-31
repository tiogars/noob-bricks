import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import PrintIcon from '@mui/icons-material/Print';
import MenuIcon from '@mui/icons-material/Menu';
import { useBricks } from '../hooks/useBricks';
import { useExternalLinks } from '../hooks/useExternalLinks';
import { useAdModal } from '../hooks/useAdModal';
import { Header } from '../components/Header';
import { BrickFormModal } from '../components/BrickFormModal';
import { BrickList } from '../components/BrickList';
import { TagFilter } from '../components/TagFilter';
import { ImportExportModal } from '../components/ImportExportModal';
import { ExternalLinksSettings } from '../components/ExternalLinksSettings';
import { DisclaimerModal } from '../components/DisclaimerModal';
import { AdModal } from '../components/AdModal';
import { Footer } from '../components/Footer';
import { storageService } from '../storage/storageService';
import type { Brick } from '../types';
import type { ImportResult } from '../utils/importService';

export function Home() {
  const navigate = useNavigate();
  const { bricks, tags, addBrick, updateBrick, deleteBrick, importBricks, clearAllBricks } = useBricks();
  const { externalLinks, addExternalLink, updateExternalLink, deleteExternalLink, toggleExternalLink, importExternalLinks } = useExternalLinks();
  const { isAdModalOpen, adModalTimestamp, closeAdModal } = useAdModal();
  const [editingBrick, setEditingBrick] = useState<Brick | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [brickFormModalOpen, setBrickFormModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [externalLinksSettingsOpen, setExternalLinksSettingsOpen] = useState(false);
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(() => storageService.isFirstLaunch());

  const handleDisclaimerClose = () => {
    storageService.markDisclaimerShown();
    setDisclaimerModalOpen(false);
  };

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

  const handleImport = (result: ImportResult) => {
    importBricks(result.bricks);
    if (result.externalLinks) {
      importExternalLinks(result.externalLinks);
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

      {/* SpeedDial for actions */}
      <SpeedDial
        ariaLabel="Actions menu"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon openIcon={<MenuIcon />} />}
        FabProps={{
          sx: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          },
        }}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add New Brick"
          tooltipOpen
          onClick={() => setBrickFormModalOpen(true)}
          FabProps={{
            sx: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            },
          }}
        />
        <SpeedDialAction
          icon={<PrintIcon />}
          tooltipTitle="Print"
          tooltipOpen
          onClick={handlePrint}
          FabProps={{
            sx: {
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
              },
            },
          }}
        />
        <SpeedDialAction
          icon={<ImportExportIcon />}
          tooltipTitle="Import / Export"
          tooltipOpen
          onClick={() => setImportExportModalOpen(true)}
          FabProps={{
            sx: {
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              },
            },
          }}
        />
        <SpeedDialAction
          icon={<SettingsIcon />}
          tooltipTitle="External Links Settings"
          tooltipOpen
          onClick={() => setExternalLinksSettingsOpen(true)}
          FabProps={{
            sx: {
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              },
            },
          }}
        />
      </SpeedDial>

      {/* Modals */}
      <BrickFormModal
        open={brickFormModalOpen}
        onClose={handleBrickFormModalClose}
        onSubmit={handleFormSubmit}
        editingBrick={editingBrick}
        onCancel={handleCancelEdit}
        existingTags={tags}
        existingBricks={bricks}
      />

      <ImportExportModal
        open={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        bricks={bricks}
        externalLinks={externalLinks}
        onImport={handleImport}
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

      <DisclaimerModal
        open={disclaimerModalOpen}
        onClose={handleDisclaimerClose}
      />

      <AdModal
        open={isAdModalOpen}
        timestamp={adModalTimestamp}
        onClose={closeAdModal}
      />
    </Box>
  );
}
