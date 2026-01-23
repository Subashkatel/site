import { blogPosts } from './data/blogPosts';

export default async function sitemap() {
  const routes = [
    '',
    '/writing',
    '/publications',
    '/resources',
    '/credits',
  ].map((route) => ({
    url: `https://subashkatel.com${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Add published blog posts dynamically
  const blogRoutes = blogPosts
    .filter((post) => post.published && !post.hidden)
    .map((post) => ({
      url: `https://subashkatel.com/writing/${post.slug}`,
      lastModified: new Date().toISOString(),
    }));

  return [...routes, ...blogRoutes];
}
