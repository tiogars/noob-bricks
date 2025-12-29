export interface Theme {
  name: string;
  displayName: string;
  mode: 'light' | 'dark';
  colors: {
    // Primary gradients
    primaryGradientStart: string;
    primaryGradientEnd: string;
    
    // Accent colors
    accentColor: string;
    dangerGradientStart: string;
    dangerGradientEnd: string;
    
    // Secondary colors
    secondaryGradientStart: string;
    secondaryGradientEnd: string;
    
    // Card backgrounds
    cardGradientStart: string;
    cardGradientEnd: string;
    
    // Tag colors
    tagBackground: string;
    tagText: string;
    
    // Button colors
    printButtonStart: string;
    printButtonEnd: string;
    exportButtonStart: string;
    exportButtonEnd: string;
    importButtonStart: string;
    importButtonEnd: string;
  };
}
