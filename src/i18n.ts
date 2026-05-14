import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import plTranslations from './locales/pl/translation.json';

const resources = {
  en: {
    translation: enTranslations,
  },

  pl: {
    translation: plTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
