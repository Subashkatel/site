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

  // Add blog posts
  const blogPosts = [
    '/writing/anki-for-researchers',
    '/writing/quantum-entanglement-bell-states',
    '/writing/gradient-descent-deep-dive',
  ].map((route) => ({
    url: `https://subashkatel.com${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogPosts];
}
