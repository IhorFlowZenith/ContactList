import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from './SettingsContext';
import { createLightTheme, createDarkTheme, Theme } from '../theme/colors';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(createDarkTheme());
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const shouldUseDark = settings.theme === 'auto' 
      ? systemColorScheme === 'dark' 
      : settings.theme === 'dark';

    const newTheme = shouldUseDark 
      ? createDarkTheme(settings.accentColor) 
      : createLightTheme(settings.accentColor);

    setCurrentTheme(newTheme);
    setIsDark(shouldUseDark);
  }, [settings.theme, settings.accentColor, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};