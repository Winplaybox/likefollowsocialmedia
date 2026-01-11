import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
// import en from './app/locales/en-us.json';
// import fr from './app/locales/fr-ca.json';

// // Add resources directly for local development
// i18n.addResourceBundle('en-us', 'translation', en);
// i18n.addResourceBundle('fr-ca', 'translation', fr);

// Full i18next initialization for React/Expo
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en-us', 'fr-ca'],
    fallbackLng: 'en-us',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: './app/locales/{{lng}}.json',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
