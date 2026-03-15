import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '../types';
import { saveSettings, loadSettings } from '../services/storage';
import { setLanguage } from '../i18n';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'auto',
    language: 'uk',
    nameFormat: 'firstLast',
  });

  useEffect(() => {
    loadSettings().then(loadedSettings => {
      setSettings(loadedSettings);
      setLanguage(loadedSettings.language);
    });
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    if (updates.language) {
      setLanguage(updates.language);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}