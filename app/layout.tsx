import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NameTransition } from './name';

export const metadata: Metadata = {
  metadataBase: new URL('https://subashkatel.com'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  title: {
    default: 'Subash Katel',
    template: '%s | Subash Katel',
  },
  description: 'PhD Student in Computer Science at Princeton University researching computer architecture and quantum computing',
  keywords: ['computer architecture', 'quantum computing', 'Princeton', 'PhD', 'research', 'machine learning'],
  authors: [{ name: 'Subash Katel', url: 'https://subashkatel.com' }],
  creator: 'Subash Katel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subashkatel.com',
    title: 'Subash Katel',
    description: 'PhD Student in Computer Science at Princeton University researching computer architecture and quantum computing',
    siteName: 'Subash Katel',
    images: [
      {
        url: '/images/profile.png',
        width: 1200,
        height: 630,
        alt: 'Subash Katel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subash Katel',
    description: 'PhD Student in Computer Science at Princeton University researching computer architecture and quantum computing',
    images: ['/images/profile.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased tracking-tight">
        <div className="min-h-screen bg-white text-gray-900">
          {children}
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function Footer() {
  const links = [
    { name: 'GitHub', url: 'https://github.com/subashkatel', external: true },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/subashkatel', external: true },
    { name: 'Resources', url: '/resources', external: false },
    { name: 'Credits', url: '/credits', external: false },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
