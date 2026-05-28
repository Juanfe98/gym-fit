export const languages = ['en', 'es'] as const;
export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'en';

export function isLanguage(value: string | undefined): value is Language {
  return languages.includes(value as Language);
}

export function localizePath(lang: Language, path = ''): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalized === '/' ? '' : normalized}`;
}
