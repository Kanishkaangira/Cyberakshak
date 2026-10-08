import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import as from './locales/as.json';
import bn from './locales/bn.json';
import brx from './locales/brx.json';
import doi from './locales/doi.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ks from './locales/ks.json';
import kok from './locales/kok.json';
import mai from './locales/mai.json';
import ml from './locales/ml.json';
import mni from './locales/mni.json';
import mr from './locales/mr.json';
import ne from './locales/ne.json';
import or from './locales/or.json';
import pa from './locales/pa.json';
import sa from './locales/sa.json';
import sat from './locales/sat.json';
import sd from './locales/sd.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ur from './locales/ur.json';
import { SUPPORTED_LANGUAGE_CODES } from './constants/languages';

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
const initialLanguage = SUPPORTED_LANGUAGE_CODES.includes(deviceLanguage)
  ? deviceLanguage
  : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    as: { translation: as },
    bn: { translation: bn },
    brx: { translation: brx },
    doi: { translation: doi },
    gu: { translation: gu },
    kn: { translation: kn },
    ks: { translation: ks },
    kok: { translation: kok },
    mai: { translation: mai },
    ml: { translation: ml },
    mni: { translation: mni },
    mr: { translation: mr },
    ne: { translation: ne },
    or: { translation: or },
    pa: { translation: pa },
    sa: { translation: sa },
    sat: { translation: sat },
    sd: { translation: sd },
    ta: { translation: ta },
    te: { translation: te },
    ur: { translation: ur },
  },
  lng: initialLanguage,
  supportedLngs: SUPPORTED_LANGUAGE_CODES,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
