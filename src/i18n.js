import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

// Use the JS runtime locale so app startup does not depend on a native locale
// module being present in the installed Android binary.
const deviceLocale = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return 'en';
  }
})();
const deviceLanguage = deviceLocale?.split(/[-_]/)[0]?.toLowerCase();
const initialLanguage = deviceLanguage === 'hi' ? 'hi' : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
