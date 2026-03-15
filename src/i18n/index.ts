import { translations, Language, TranslationKey } from './translations';

let currentLanguage: Language = 'uk';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => {
  return currentLanguage;
};

export const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
  let text = translations[currentLanguage][key] || translations.uk[key] || key;
  
  if (params) {
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, String(params[param]));
    });
  }
  
  return text;
};

export type { Language, TranslationKey };