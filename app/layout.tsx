import './globals.css';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Analytics } from '@vercel/analytics/react';
import { NameTransition } from './name';

export const metadata: Metadata = {
  metadataBase: new URL('https://subashkatel.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Subash Katel',
    template: '%s | Subash Katel',
  },
  description: 'Computer Science at UCSD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className="antialiased tracking-tight">
          <div className="min-h-screen bg-white text-gray-900">
            {children}
            <Footer />
          </div>
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}

function Footer() {
  const links = [
    { name: 'GitHub', url: 'https://github.com/subashkatel' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/subashkatel' },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
