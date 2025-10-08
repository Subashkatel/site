import Link from 'next/link'
import { TableOfContents } from './TableOfContents'

interface BlogLayoutProps {
  children: React.ReactNode;
  date?: string; // Original publish date - Format: "Month Day, Year" (e.g., "January 15, 2025")
  updatedDate?: string; // Last updated date - Format: "Month Day, Year"
  showTableOfContents?: boolean; // Whether to show the table of contents (default: true)
}

/**
 * BlogLayout Component
 * 
 * Provides a consistent two-column layout for blog posts:
 * - Left sidebar: Back button, dates, and table of contents
 * - Right column: Main blog content
 * 
 * Usage in your blog post MDX file:
 * 
 * import { BlogLayout } from '../../components/BlogLayout'
 * 
 * // Basic usage with publish date:
 * <BlogLayout date="January 15, 2025">
 *   # Your Blog Title
 *   Your content here...
 * </BlogLayout>
 * 
 * // With updated date (shows both original and updated):
 * <BlogLayout date="January 15, 2025" updatedDate="February 20, 2025">
 *   # Your Blog Title
 *   Your content here...
 * </BlogLayout>
 * 
 * // Without table of contents:
 * <BlogLayout date="January 15, 2025" showTableOfContents={false}>
 *   # Your Blog Title
 *   Your content here...
 * </BlogLayout>
 */
export function BlogLayout({ children, date, updatedDate, showTableOfContents = true }: BlogLayoutProps) {
  return (
    <div id="wrapper">
      <div id="left" className="container">
        <div className="flex flex-col">
          <p><Link href="/">← Back to home</Link></p>
          {date && (
            <div className="post-date">
              <div>{date}</div>
              {updatedDate && updatedDate !== date && (
                <div className="text-gray-500 text-sm mt-1">
                  Updated: {updatedDate}
                </div>
              )}
            </div>
          )}
          {showTableOfContents && <TableOfContents />}
        </div>
      </div>
      
      <div id="right" className="container">
        {children}
      </div>
    </div>
  );
}
