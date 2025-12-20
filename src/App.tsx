import { useState } from 'react';
import { useBricks } from './hooks/useBricks';
import { Header } from './components/Header';
import { BrickForm } from './components/BrickForm';
import { BrickList } from './components/BrickList';
import { TagFilter } from './components/TagFilter';
import { ImportExport } from './components/ImportExport';
import { PrintView } from './components/PrintView';
import type { Brick } from './types';
import './App.css';

function App() {
  const { bricks, tags, addBrick, updateBrick, deleteBrick, importBricks, clearAllBricks } = useBricks();
  const [editingBrick, setEditingBrick] = useState<Brick | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPrintView, setShowPrintView] = useState(false);

  const handleEdit = (brick: Brick) => {
    setEditingBrick(brick);
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

  if (showPrintView) {
    return (
      <PrintView
        bricks={filteredBricks}
        selectedTags={selectedTags}
        onClose={() => setShowPrintView(false)}
      />
    );
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="control-panel">
            <BrickForm
              key={editingBrick?.id || 'new'}
              onSubmit={handleFormSubmit}
              editingBrick={editingBrick}
              onCancel={handleCancelEdit}
              existingTags={tags}
            />
            
            <ImportExport
              bricks={bricks}
              onImport={importBricks}
              onClearAll={clearAllBricks}
            />
          </div>

          <div className="content-section">
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              onPrint={() => setShowPrintView(true)}
            />

            <BrickList
              bricks={filteredBricks}
              onEdit={handleEdit}
              onDelete={deleteBrick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
