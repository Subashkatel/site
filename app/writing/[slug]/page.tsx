import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Row } from '../../components/Row';
import { formatWordCount, getPost, getPosts, getTouchedDate, type Post } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import { formatMonth } from '@/lib/dates';

/* Every post is built ahead of time. Any other address under /writing/ is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const shareImages = post.image ? [{ url: post.image }] : undefined;
  return {
    title: post.title,
    description: post.deck,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.deck,
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: shareImages,
    },
    robots: post.isDraft ? { index: false } : undefined,
  };
}

/* The dates and word count, stacked in the left rail. */
function EssayRail({ post }: { post: Post }) {
  const publishedMonth = formatMonth(post.date);
  const touchedMonth = formatMonth(getTouchedDate(post));
  const hasWords = post.wordCount > 0;

  return (
    <>
      {publishedMonth && (
        <>
          <span className="numerals">{publishedMonth}</span>
          <br />
        </>
      )}
      {touchedMonth && (
        <>
          touched <span className="numerals">{touchedMonth}</span>
          <br />
        </>
      )}
      {hasWords && (
        <>
          <span className="numerals">{formatWordCount(post.wordCount)}</span> words
        </>
      )}
    </>
  );
}

function LeadFigure({ src, alt, caption }: { src: string; alt?: string; caption?: string }) {
  const altText = alt ?? caption ?? '';
  return (
    <figure className="wide lead-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={altText} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* "written to Artist, Title". The play button appears only when there is a link to follow. */
function SongLine({ song, songLink }: { song: string; songLink?: string }) {
  return (
    <p className="song">
      {songLink && (
        <a className="song-play" href={songLink} aria-label={`Listen to ${song}`}>
          &#9654;
        </a>
      )}
      <span>written to {song}</span>
    </p>
  );
}

function PhotoStrip({ photos }: { photos: Post['strip'] }) {
  return (
    <div className="photo-strip">
      <h3>what was around while I wrote this</h3>
      <div className="photo-strip-frames">
        {photos.map((photo) => (
          <figure key={photo.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt ?? ''} loading="lazy" />
            {photo.caption && <figcaption>{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const bodyHtml = await renderMarkdown(post.markdown);
  const hasStrip = post.strip.length > 0;

  return (
    <article className="essay">
      <Row rail={<EssayRail post={post} />}>
        <h1>{post.title}</h1>
        {post.deck ? <p className="deck">{post.deck}</p> : <div className="deck-spacer" />}
      </Row>

      <Row>
        {post.image && <LeadFigure src={post.image} alt={post.alt} caption={post.caption} />}
        {post.song && <SongLine song={post.song} songLink={post.songLink} />}

        <div className="essay-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {hasStrip && <PhotoStrip photos={post.strip} />}

        <p className="back-link">
          <Link href="/writing">Back to writing</Link>
        </p>
      </Row>
    </article>
  );
}
