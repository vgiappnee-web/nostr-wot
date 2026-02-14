import { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nostr-wot.com';

/**
 * Generates the full URL for a given path and locale
 * Uses 'as-needed' locale prefix strategy: default locale has no prefix
 */
export function getFullUrl(path: string, locale: Locale): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (locale === defaultLocale) {
    return `${BASE_URL}${normalizedPath}`;
  }

  return `${BASE_URL}/${locale}${normalizedPath}`;
}

/**
 * Generates alternates metadata for canonical URLs and hreflang tags
 * @param path - The path without locale prefix (e.g., '/about', '/docs')
 * @param currentLocale - The current page locale
 */
export function generateAlternates(path: string, currentLocale: Locale): Metadata['alternates'] {
  const normalizedPath = path === '/' ? '' : path;

  // Generate language alternates for hreflang
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = getFullUrl(normalizedPath || '/', locale);
  }

  // Add x-default pointing to default locale
  languages['x-default'] = getFullUrl(normalizedPath || '/', defaultLocale);

  return {
    canonical: getFullUrl(normalizedPath || '/', currentLocale),
    languages,
  };
}

/**
 * Gets the current path from params for use in generateMetadata
 * Use this when you need to extract the path from dynamic routes
 */
export function getPathFromSegments(...segments: string[]): string {
  return '/' + segments.filter(Boolean).join('/');
}
