import { createTheme } from '@mui/material/styles';
import type { Theme } from '../types/theme';

export const createMuiTheme = (theme: Theme) => {
  return createTheme({
    palette: {
      mode: theme.mode,
      primary: {
        main: theme.colors.accentColor,
        light: theme.colors.primaryGradientStart,
        dark: theme.colors.primaryGradientEnd,
      },
      secondary: {
        main: theme.colors.secondaryGradientStart,
        light: theme.colors.secondaryGradientStart,
        dark: theme.colors.secondaryGradientEnd,
      },
      error: {
        main: theme.colors.dangerGradientEnd,
        light: theme.colors.dangerGradientStart,
      },
      background: {
        default: theme.mode === 'dark' ? '#1a202c' : '#ffffff',
        paper: theme.colors.cardGradientStart,
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${theme.colors.cardGradientStart} 0%, ${theme.colors.cardGradientEnd} 100%)`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            padding: '8px 24px',
          },
          contained: {
            background: `linear-gradient(135deg, ${theme.colors.primaryGradientStart} 0%, ${theme.colors.primaryGradientEnd} 100%)`,
            color: 'white',
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.colors.primaryGradientEnd} 0%, ${theme.colors.primaryGradientStart} 100%)`,
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: theme.colors.tagBackground,
            color: theme.colors.tagText,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${theme.colors.primaryGradientStart} 0%, ${theme.colors.primaryGradientEnd} 100%)`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
    },
  });
};
