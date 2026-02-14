'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { GitHubIcon, XTwitterIcon, NostrIcon } from '@/components/icons';
import type { AuthorSocials } from '@/lib/blog';

interface BlogSidebarProps {
  tags: string[];
  relatedPosts?: {
    slug: string;
    title: string;
    date: string;
  }[];
  currentTag?: string;
  authorNpub?: string;
  authorSocials?: AuthorSocials;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function BlogSidebar({ tags, relatedPosts, currentTag, authorNpub, authorSocials }: BlogSidebarProps) {
  const t = useTranslations('blog.sidebar');
  const [searchQuery, setSearchQuery] = useState('');

  const hasSocials = authorNpub || authorSocials?.linkedin || authorSocials?.instagram || authorSocials?.twitter || authorSocials?.github;

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
          {t('search')}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {t('tags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  currentTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts - only on post pages */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {t('relatedPosts')}
          </h3>
          <div className="space-y-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <time className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Follow Author - only when author info is provided (on post pages) */}
      {hasSocials && (
        <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-xl border border-primary/20 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {t('followUs')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('followDescription')}
          </p>
          <div className="flex items-center gap-3">
            {authorSocials?.linkedin && (
              <a
                href={`https://linkedin.com/in/${authorSocials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#0077B5] hover:bg-[#0077B5]/10 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
            )}
            {authorSocials?.instagram && (
              <a
                href={`https://instagram.com/${authorSocials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
            {authorSocials?.twitter && (
              <a
                href={`https://twitter.com/${authorSocials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="X (Twitter)"
              >
                <XTwitterIcon className="w-5 h-5" />
              </a>
            )}
            {authorSocials?.github && (
              <a
                href={`https://github.com/${authorSocials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>
            )}
            {authorNpub && (
              <a
                href={`https://njump.me/${authorNpub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors"
                aria-label="Nostr"
              >
                <NostrIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
