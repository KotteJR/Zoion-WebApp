export type Locale = 'en' | 'sv';

export const locales: Locale[] = ['en', 'sv'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  sv: 'Svenska',
};

export function getLocaleFromStorage(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const stored = localStorage.getItem('locale');
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  
  return defaultLocale;
}

export function setLocaleInStorage(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}


