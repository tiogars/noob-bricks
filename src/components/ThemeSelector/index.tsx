import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../themes/themes';
import './ThemeSelector.css';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-selector">
      <label className="theme-label">Theme:</label>
      <div className="theme-buttons">
        {Object.values(themes).map((t) => (
          <button
            key={t.name}
            className={`theme-btn ${theme.name === t.name ? 'active' : ''}`}
            onClick={() => setTheme(t.name)}
            title={`Switch to ${t.displayName} theme`}
          >
            {t.name === 'christmas' ? '🎄' : '🎨'} {t.displayName}
          </button>
        ))}
      </div>
    </div>
  );
};
