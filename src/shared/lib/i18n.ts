import { en } from '@/content/en';
import { pl } from '@/content/pl';
import type { Dictionary } from '@/content/types';

export const locales = ['en', 'pl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCookie = 'NEXT_LOCALE';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const dictionaries: Record<Locale, Dictionary> = { en, pl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
