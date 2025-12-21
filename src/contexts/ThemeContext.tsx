import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types/theme';
import { getTheme } from '../themes/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<string>(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'christmas'; // Christmas as default
  });

  const theme = getTheme(themeName);

  useEffect(() => {
    localStorage.setItem('theme', themeName);
    
    // Apply CSS variables to root
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });
  }, [themeName, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
