import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /* A short address for the CV. Temporary, so the PDF's file name can change later. */
      { source: '/cv', destination: '/cv/subash_cv.pdf', permanent: false },
      /* Pages from the old site. */
      { source: '/publications', destination: '/papers', permanent: true },
      { source: '/credits', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
