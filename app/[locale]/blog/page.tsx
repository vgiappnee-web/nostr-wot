import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllBlogPosts, getAllTags } from '@/lib/blog';
import { generateAlternates } from '@/lib/metadata';
import { type Locale } from '@/i18n/config';
import { BlogCard, BlogSidebar } from '@/components/blog';
import { ScrollReveal, Section, SectionHeader } from '@/components/ui';
import {NewsletterSection} from "@/components/layout/NewsletterSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('blog.meta');

  return {
    title: t('title'),
    description: t('description'),
    alternates: generateAlternates('/blog', locale as Locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function BlogPage() {
  const t = await getTranslations('blog');
  const posts = getAllBlogPosts();
  const allTags = getAllTags();

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Nostr Web of Trust Blog',
    'description': 'News, updates, and insights about Web of Trust on Nostr',
    'url': 'https://nostr-wot.com/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'Nostr Web of Trust',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://nostr-wot.com/icon-512.png',
      },
    },
    'blogPost': posts.map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt,
      'datePublished': post.date,
      'author': {
        '@type': 'Person',
        'name': post.author.name,
      },
      'url': `https://nostr-wot.com/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Hero Section */}
        <Section padding="lg" className="pt-24">
          <ScrollReveal animation="fade-up">
            <SectionHeader
              title={t('title')}
              description={t('subtitle')}
            />
          </ScrollReveal>
        </Section>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="lg:flex lg:flex-row lg:gap-8">
            {/* Posts */}
            <div className="flex-1 min-w-0">
              {/* Featured Post */}
              {featuredPost && (
                <section className="mb-12">
                  <ScrollReveal animation="fade-up" delay={100}>
                    <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">
                      {t('featured')}
                    </h2>
                    <BlogCard post={featuredPost} featured />
                  </ScrollReveal>
                </section>
              )}

              {/* Other Posts */}
              {otherPosts.length > 0 && (
                <section>
                  <ScrollReveal animation="fade-up">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                      {t('latestPosts')}
                    </h2>
                  </ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-8">
                    {otherPosts.map((post, index) => (
                      <ScrollReveal key={post.slug} animation="fade-up" delay={100 + index * 50}>
                        <BlogCard post={post} />
                      </ScrollReveal>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {posts.length === 0 && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('emptyState.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('emptyState.description')}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <BlogSidebar tags={allTags} />
              </div>
            </aside>
          </div>

          {/* Newsletter */}
          <ScrollReveal animation="fade-left" delay={200}>
            <NewsletterSection />
          </ScrollReveal>
        </div>
      </main>
    </>
  );
}
