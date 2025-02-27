import { useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hi from '../i18n/locales/hi.json';
import en from '../i18n/locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'en', // Default language is English
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const useTranslation = () => {
  const t = useCallback((key: string) => {
    return i18n.t(key);
  }, []);

  const changeLanguage = (lng: 'en' | 'hi') => {
    i18n.changeLanguage(lng);
  };

  return { t, i18n, changeLanguage };
}; 