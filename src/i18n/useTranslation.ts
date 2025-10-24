import { useState, useEffect } from 'react';
import { Locale, defaultLocale, getLocaleFromStorage, setLocaleInStorage } from './config';
import enTranslations from './en.json';
import svTranslations from './sv.json';

const translations: Record<Locale, any> = {
  en: enTranslations,
  sv: svTranslations,
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = getLocaleFromStorage();
    setLocale(storedLocale);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocaleInStorage(newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations['en'];
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return value;
  };

  return { t, locale, changeLocale };
}


