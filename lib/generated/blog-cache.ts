// Auto-generated - do not edit
import type { Locale } from '@/i18n/config';
import type { BlogPost } from '@/lib/blog';
import cache from './blog-cache.json';

export interface BlogCache {
  generatedAt: string;
  locales: Record<Locale, {
    posts: BlogPost[];
    tags: string[];
  }>;
}

export const blogCache = cache as BlogCache;
export default blogCache;
