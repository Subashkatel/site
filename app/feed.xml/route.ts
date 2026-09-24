import { getPublishedPosts, type Post } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import { site } from '@/lib/site';

/* Built once at deploy time, like the pages. */
export const dynamic = 'force-static';

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/* A literal "]]>" inside the HTML would end the CDATA section early, so it is split across two sections. */
function wrapInCdata(html: string): string {
  const safeHtml = html.replaceAll(']]>', ']]]]><![CDATA[>');
  return `<![CDATA[${safeHtml}]]>`;
}

async function renderFeedItem(post: Post): Promise<string> {
  const postUrl = `${site.url}/writing/${post.slug}`;
  const bodyHtml = await renderMarkdown(post.markdown);

  const lines = [
    '<item>',
    `<title>${escapeXml(post.title)}</title>`,
    `<link>${postUrl}</link>`,
    `<guid>${postUrl}</guid>`,
  ];
  if (post.date) {
    const publishedDate = new Date(post.date).toUTCString();
    lines.push(`<pubDate>${publishedDate}</pubDate>`);
  }
  if (post.deck) {
    lines.push(`<description>${escapeXml(post.deck)}</description>`);
  }
  lines.push(`<content:encoded>${wrapInCdata(bodyHtml)}</content:encoded>`);
  lines.push('</item>');
  return lines.join('\n');
}

export async function GET() {
  const posts = getPublishedPosts();
  const items = await Promise.all(posts.map(renderFeedItem));

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '<channel>',
    `<title>${site.name}</title>`,
    `<link>${site.url}/writing</link>`,
    `<description>Writing by ${site.name}</description>`,
    '<language>en</language>',
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n');

  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
