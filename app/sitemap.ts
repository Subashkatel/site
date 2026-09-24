import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/posts';
import { site } from '@/lib/site';

const pagePaths = ['', '/work', '/papers', '/writing'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pageEntries = pagePaths.map((pagePath) => ({
    url: `${site.url}${pagePath}`,
  }));

  const postEntries = getPublishedPosts().map((post) => ({
    url: `${site.url}/writing/${post.slug}`,
    lastModified: post.updated ?? post.date,
  }));

  return [...pageEntries, ...postEntries];
}
