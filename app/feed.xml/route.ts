import { blogPosts } from '../data/blogPosts'

export async function GET() {
  const siteUrl = 'https://subashkatel.com'
  const author = {
    name: 'Subash Katel',
    email: 'skatel@princeton.edu',
  }

  // Filter to only published posts and sort by date (newest first)
  const publishedPosts = blogPosts
    .filter(post => post.published)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Subash Katel - Blog</title>
    <link>${siteUrl}</link>
    <description>Blog posts about computer architecture, quantum computing, and research</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${publishedPosts
      .map(
        post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/writing/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/writing/${post.slug}</guid>
      <author>${author.email} (${author.name})</author>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
