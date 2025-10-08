export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://subashkatel.com/sitemap.xml',
    host: 'https://subashkatel.com',
  }
}
