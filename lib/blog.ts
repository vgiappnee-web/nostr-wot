import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface AuthorSocials {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
    npub?: string;
    socials?: AuthorSocials;
  };
  featuredImage: string;
  previewImage: string;
  tags: string[];
  published: boolean;
  readingTime: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

/**
 * Get all blog post slugs
 */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

/**
 * Get a single blog post by slug
 */
export function getBlogPost(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  let filePath: string;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    excerpt: data.excerpt || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: {
      name: data.author?.name || 'Nostr WoT Team',
      avatar: data.author?.avatar,
      npub: data.author?.npub,
      socials: data.author?.socials ? {
        linkedin: data.author.socials.linkedin,
        instagram: data.author.socials.instagram,
        twitter: data.author.socials.twitter,
        github: data.author.socials.github,
      } : undefined,
    },
    featuredImage: data.featuredImage || '/images/blog/default-featured.svg',
    previewImage: data.previewImage || data.featuredImage || '/images/blog/default-preview.svg',
    tags: data.tags || [],
    published: data.published !== false,
    readingTime: stats.text,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    ogImage: data.ogImage,
    content,
  };
}

/**
 * Get all published blog posts sorted by date
 */
export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getBlogSlugs();

  const posts = slugs
    .map((slug) => {
      const post = getBlogPost(slug);
      if (!post || !post.published) return null;

      // Return only metadata, not content
      const { content: _, ...meta } = post;
      return meta;
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllBlogPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const posts = getAllBlogPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get related posts based on tags
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getBlogPost(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllBlogPosts().filter((post) => post.slug !== currentSlug);

  // Score posts by number of shared tags
  const scored = allPosts.map((post) => {
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    ).length;
    return { post, score: sharedTags };
  });

  // Sort by score, then by date
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.post);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
