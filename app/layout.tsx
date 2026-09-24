import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Newsreader, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from './components/Nav';
import { Line } from './components/Line';
import { site } from '@/lib/site';

/* Newsreader for all prose. Exposed to CSS as --font-serif. */
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif',
  display: 'swap',
});

/* IBM Plex Mono for numerals and dates only. Exposed to CSS as --font-mono. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});

const shareImage = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  alt: 'The Lake in Central Park, midtown behind the trees',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: [shareImage.url],
  },
};

/* Matches --paper in light and dark mode, so the browser chrome blends in. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#151413' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVariables = `${newsreader.variable} ${plexMono.variable}`;
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Line />
        <div className="page">
          <Nav />
          <main>{children}</main>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
