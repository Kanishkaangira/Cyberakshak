export const APP_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'Assamese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'brx', name: 'Bodo' },
  { code: 'doi', name: 'Dogri' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'hi', name: 'Hindi' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'kok', name: 'Konkani' },
  { code: 'mai', name: 'Maithili' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ne', name: 'Nepali' },
  { code: 'or', name: 'Odia' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'sat', name: 'Santali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ur', name: 'Urdu' },
];

export const SUPPORTED_LANGUAGE_CODES = [
  'en',
  'hi',
  'as',
  'bn',
  'brx',
  'doi',
  'gu',
  'kn',
  'ks',
  'kok',
  'mai',
  'ml',
  'mni',
  'mr',
  'ne',
  'or',
  'pa',
  'sa',
  'sat',
  'sd',
  'ta',
  'te',
  'ur',
];

export function getLanguageCode(value) {
  const normalizedValue = value?.trim().toLowerCase();
  const language = APP_LANGUAGES.find(
    ({ code, name }) =>
      code === normalizedValue || name.toLowerCase() === normalizedValue
  );
  return language && SUPPORTED_LANGUAGE_CODES.includes(language.code)
    ? language.code
    : 'en';
}
