import Link from 'next/link'
import 'katex/dist/katex.min.css'
import { TableOfContents } from './TableOfContents'

interface BlogLayoutProps {
  children: React.ReactNode;
  date?: string; // Publish date from metadata (ISO format YYYY-MM-DD)
  updatedDate?: string; // Optional updated date (ISO format YYYY-MM-DD)
  showTableOfContents?: boolean; // Whether to show the table of contents (default: true)
}

/**
 * Format a date from ISO format to display format
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
 * export const metadata = {
 *   title: 'Your Post',
 *   description: 'Description',
 *   date: '2025-01-15',  // Publish date in ISO format
 *   updatedDate: '2025-02-20',  // Optional: Last update date
 * }
 * 
 * <BlogLayout date={metadata.date} updatedDate={metadata.updatedDate}>
 *   # Your Blog Title
 *   Your content here...
 * </BlogLayout>
 * 
 * Now you only specify dates once in metadata!
 */
export function BlogLayout({ children, date, updatedDate, showTableOfContents = true }: BlogLayoutProps) {
  const formattedDate = date ? formatDate(date) : null;
  const formattedUpdatedDate = updatedDate ? formatDate(updatedDate) : null;

  return (
    <div id="wrapper">
      <div id="left" className="container">
        <div className="flex flex-col">
          <p><Link href="/">← Back to home</Link></p>
          {formattedDate && (
            <div className="post-date">
              <div>{formattedDate}</div>
              {formattedUpdatedDate && formattedUpdatedDate !== formattedDate && (
                <div className="text-gray-500 text-sm mt-1">
                  Updated: {formattedUpdatedDate}
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
