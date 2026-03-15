import { useState, useEffect } from 'react';
import { t, getLanguage } from '../i18n';
import { useSettings } from '../contexts/SettingsContext';

export const useTranslation = () => {
  const { settings } = useSettings();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate(prev => prev + 1);
  }, [settings.language]);

  return { t, language: getLanguage() };
};