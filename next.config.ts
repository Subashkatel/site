import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import postgres from 'postgres';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

export const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'allow',
});

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  async redirects() {
    if (!process.env.POSTGRES_URL) {
      return [];
    }

    let redirects = await sql`
      SELECT source, destination, permanent
      FROM redirects;
    `;

    return redirects.map(({ source, destination, permanent }) => ({
      source,
      destination,
      permanent: !!permanent,
    }));
  },
  // Use JS MDX compiler for full LaTeX/math support (Rust mode has issues with complex equations)
  experimental: {
    mdxRs: false,
    optimizePackageImports: ['katex'],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex],
  },
});

export default withMDX(nextConfig);
