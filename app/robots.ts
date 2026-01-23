export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/cv/'],
      },
    ],
    sitemap: 'https://subashkatel.com/sitemap.xml',
    host: 'https://subashkatel.com',
  }
}
