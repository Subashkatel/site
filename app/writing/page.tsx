import type { Metadata } from 'next';
import Link from 'next/link';
import { Row } from '../components/Row';
import { formatWordCount, getPosts, getTouchedDate, type Post } from '@/lib/posts';
import { formatMonth } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'Writing',
  alternates: { canonical: '/writing' },
};

/* "2026.01, last touched 2026.09 · 900 words", leaving out whatever the post doesn't have. */
function PostDetails({ post }: { post: Post }) {
  const publishedMonth = formatMonth(post.date);
  const touchedMonth = formatMonth(getTouchedDate(post));
  const hasWords = post.wordCount > 0;
  const needsSeparator = publishedMonth && hasWords;

  if (!publishedMonth && !hasWords) return null;

  return (
    <span className="post-details">
      {publishedMonth && <span className="numerals">{publishedMonth}</span>}
      {touchedMonth && (
        <>
          , last touched <span className="numerals">{touchedMonth}</span>
        </>
      )}
      {needsSeparator && <> &nbsp;&middot;&nbsp; </>}
      {hasWords && (
        <>
          <span className="numerals">{formatWordCount(post.wordCount)}</span> words
        </>
      )}
    </span>
  );
}

function PostEntry({ post }: { post: Post }) {
  return (
    <div className="post-entry">
      <Link className="post-title" href={`/writing/${post.slug}`}>{post.title}</Link>
      {post.isDraft && <span className="draft-label">draft, only visible locally</span>}
      {post.deck && <span className="post-deck">{post.deck}</span>}
      <PostDetails post={post} />
    </div>
  );
}

export default function WritingPage() {
  const posts = getPosts();
  const hasPosts = posts.length > 0;

  return (
    <Row rail="writing" className="section">
      <p className="intro">
        Essays when I&rsquo;ve figured something out, notes when I haven&rsquo;t. I tend to keep
        editing after posting, so a second date is the last time I fiddled with it.
      </p>

      {!hasPosts && <p className="intro">Nothing here yet.</p>}

      {posts.map((post) => (
        <PostEntry key={post.slug} post={post} />
      ))}
    </Row>
  );
}
