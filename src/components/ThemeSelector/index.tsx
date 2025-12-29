import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../themes/themes';

const themeEmojis: Record<string, string> = {
  default: '🎨',
  christmas: '🎄',
  dark: '🌙',
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newTheme: string | null) => {
    if (newTheme !== null) {
      setTheme(newTheme);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
        Theme:
      </Typography>
      <ToggleButtonGroup
        value={theme.name}
        exclusive
        onChange={handleChange}
        aria-label="theme selector"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            color: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      >
        {Object.values(themes).map((t) => (
          <ToggleButton key={t.name} value={t.name} aria-label={`${t.displayName} theme`}>
            {themeEmojis[t.name] || '🎨'} {t.displayName}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
