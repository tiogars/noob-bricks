import type { Theme } from '../types/theme';

export const defaultTheme: Theme = {
  name: 'default',
  displayName: 'Default',
  colors: {
    // Primary purple gradient
    primaryGradientStart: '#667eea',
    primaryGradientEnd: '#764ba2',
    
    // Accent colors
    accentColor: '#667eea',
    dangerGradientStart: '#f093fb',
    dangerGradientEnd: '#f5576c',
    
    // Secondary colors
    secondaryGradientStart: '#f5f7fa',
    secondaryGradientEnd: '#c3cfe2',
    
    // Card backgrounds
    cardGradientStart: '#f5f7fa',
    cardGradientEnd: '#c3cfe2',
    
    // Tag colors
    tagBackground: 'rgba(102, 126, 234, 0.2)',
    tagText: '#5a67d8',
    
    // Button colors
    printButtonStart: '#4facfe',
    printButtonEnd: '#00f2fe',
    exportButtonStart: '#4facfe',
    exportButtonEnd: '#00f2fe',
    importButtonStart: '#43e97b',
    importButtonEnd: '#38f9d7',
  },
};

export const christmasTheme: Theme = {
  name: 'christmas',
  displayName: 'Christmas',
  colors: {
    // Christmas red and green gradient
    primaryGradientStart: '#c94b4b',
    primaryGradientEnd: '#4a8e4a',
    
    // Accent colors
    accentColor: '#c94b4b',
    dangerGradientStart: '#d32f2f',
    dangerGradientEnd: '#f44336',
    
    // Secondary colors (gold/cream)
    secondaryGradientStart: '#fff9e6',
    secondaryGradientEnd: '#ffd54f',
    
    // Card backgrounds (snowy white to gold)
    cardGradientStart: '#ffffff',
    cardGradientEnd: '#ffe8b3',
    
    // Tag colors (festive red)
    tagBackground: 'rgba(201, 75, 75, 0.2)',
    tagText: '#c94b4b',
    
    // Button colors
    printButtonStart: '#2e7d32',
    printButtonEnd: '#66bb6a',
    exportButtonStart: '#c62828',
    exportButtonEnd: '#e57373',
    importButtonStart: '#ffd54f',
    importButtonEnd: '#ffa726',
  },
};

export const themes: { [key: string]: Theme } = {
  default: defaultTheme,
  christmas: christmasTheme,
};

export const DEFAULT_THEME_NAME = 'christmas';

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes[DEFAULT_THEME_NAME];
};
