import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { toIsoDate } from './dates';

/*
  Posts are plain markdown files.

  content/writing/  Published. Every .md file here is live.
  content/drafts/   Private. Git ignores this folder, so nothing in it
                    reaches GitHub or Vercel. Drafts appear only under
                    `npm run dev`, labelled as drafts.

  Publishing a draft means moving its file from one folder to the other.
  The file name becomes the address: my-post.md is /writing/my-post.
*/

const PUBLISHED_FOLDER = path.join(process.cwd(), 'content', 'writing');
const DRAFTS_FOLDER = path.join(process.cwd(), 'content', 'drafts');
const IS_LOCAL_PREVIEW = process.env.NODE_ENV === 'development';

export type StripPhoto = {
  src: string;
  caption?: string;
  alt?: string;
};

export type Post = {
  slug: string;
  title: string;
  deck?: string;
  date?: string;
  updated?: string;
  image?: string;
  alt?: string;
  caption?: string;
  song?: string;
  songLink?: string;
  strip: StripPhoto[];
  wordCount: number;
  isDraft: boolean;
  markdown: string;
};

/* Frontmatter values arrive untyped. Blank strings count as missing. */
function readOptionalText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (text === '') return undefined;
  return text;
}

/* Each photo in the strip can be a bare path or { src, caption, alt }. */
function readStripPhoto(entry: unknown): StripPhoto | undefined {
  if (typeof entry === 'string') {
    return { src: entry };
  }
  if (typeof entry !== 'object' || entry === null) return undefined;

  const fields = entry as Record<string, unknown>;
  const src = readOptionalText(fields.src);
  if (!src) return undefined;
  return {
    src,
    caption: readOptionalText(fields.caption),
    alt: readOptionalText(fields.alt),
  };
}

function readStrip(value: unknown): StripPhoto[] {
  if (!Array.isArray(value)) return [];
  const photos = value.map(readStripPhoto);
  return photos.filter((photo): photo is StripPhoto => photo !== undefined);
}

const FENCED_CODE = /```[\s\S]*?```/g;
const DISPLAY_MATH = /\$\$[\s\S]*?\$\$/g;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g;
const LINK = /\[([^\]]*)\]\([^)]*\)/g;
const HTML_TAG = /<[^>]+>/g;
const CONTAINS_LETTER_OR_DIGIT = /[A-Za-z0-9]/;

/* Counts words of prose. Code, display math, comments, images and tags don't count; a link counts as its text. */
function countWords(markdown: string): number {
  let prose = markdown;
  prose = prose.replace(FENCED_CODE, ' ');
  prose = prose.replace(DISPLAY_MATH, ' ');
  prose = prose.replace(HTML_COMMENT, ' ');
  prose = prose.replace(IMAGE, ' ');
  prose = prose.replace(LINK, '$1');
  prose = prose.replace(HTML_TAG, ' ');

  const tokens = prose.split(/\s+/);
  const words = tokens.filter((token) => CONTAINS_LETTER_OR_DIGIT.test(token));
  return words.length;
}

function readPostFile(folder: string, fileName: string, isDraft: boolean): Post {
  const slug = fileName.replace(/\.md$/, '');
  const fileContents = fs.readFileSync(path.join(folder, fileName), 'utf8');
  const { data: frontmatter, content: markdown } = matter(fileContents);
  const titleFromSlug = slug.replace(/-/g, ' ');

  return {
    slug,
    title: readOptionalText(frontmatter.title) ?? titleFromSlug,
    deck: readOptionalText(frontmatter.deck),
    date: toIsoDate(frontmatter.date),
    updated: toIsoDate(frontmatter.updated),
    image: readOptionalText(frontmatter.image),
    alt: readOptionalText(frontmatter.alt),
    caption: readOptionalText(frontmatter.caption),
    song: readOptionalText(frontmatter.song),
    songLink: readOptionalText(frontmatter.songLink),
    strip: readStrip(frontmatter.strip),
    wordCount: countWords(markdown),
    isDraft,
    markdown,
  };
}

/* Markdown files only. Hidden files such as .gitkeep are skipped. */
function isPostFile(fileName: string): boolean {
  const isMarkdown = fileName.endsWith('.md');
  const isHidden = fileName.startsWith('.');
  return isMarkdown && !isHidden;
}

function readFolder(folder: string, isDraft: boolean): Post[] {
  if (!fs.existsSync(folder)) return [];
  const fileNames = fs.readdirSync(folder).filter(isPostFile);
  return fileNames.map((fileName) => readPostFile(folder, fileName, isDraft));
}

function newestFirst(first: Post, second: Post): number {
  const firstDate = first.date ?? '';
  const secondDate = second.date ?? '';
  return secondDate.localeCompare(firstDate);
}

/* Everything the site shows: published posts, plus drafts when previewing locally. */
export function getPosts(): Post[] {
  const publishedPosts = readFolder(PUBLISHED_FOLDER, false);
  const draftPosts = IS_LOCAL_PREVIEW ? readFolder(DRAFTS_FOLDER, true) : [];
  const allPosts = [...publishedPosts, ...draftPosts];
  return allPosts.sort(newestFirst);
}

/* Only what is actually published, for the feed and the sitemap. */
export function getPublishedPosts(): Post[] {
  return getPosts().filter((post) => !post.isDraft);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/* The "last touched" date, only when it differs from the publish date. */
export function getTouchedDate(post: Post): string | undefined {
  if (post.updated === post.date) return undefined;
  return post.updated;
}

export function formatWordCount(wordCount: number): string {
  return wordCount.toLocaleString('en-US');
}
