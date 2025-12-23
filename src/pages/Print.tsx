import { useLocation, useNavigate } from 'react-router-dom';
import { PrintView } from '../components/PrintView';
import type { Brick } from '../types';

interface LocationState {
  bricks: Brick[];
  selectedTags: string[];
}

export function Print() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // If no state is passed, redirect to home
  if (!state || !state.bricks) {
    navigate('/');
    return null;
  }

  const handleClose = () => {
    navigate('/');
  };

  return (
    <PrintView
      bricks={state.bricks}
      selectedTags={state.selectedTags || []}
      onClose={handleClose}
    />
  );
}
