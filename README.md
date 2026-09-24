# subashkatel.com

Next.js, plain markdown, deployed on Vercel.

```
npm install
npm run dev      # http://localhost:3000, drafts included
npm run build    # what Vercel runs; drafts excluded
```

## Writing

Posts are markdown files. The file name is the URL: `content/writing/my-post.md` becomes `/writing/my-post`.

- `content/writing/` is live. Everything here gets published.
- `content/drafts/` is private. Git ignores it, so nothing here reaches GitHub or Vercel. Drafts show up under `npm run dev`, marked as drafts.

To publish, move the file from `drafts/` to `writing/`.

`content/TEMPLATE.md` lists every frontmatter field. Only `title` and `date` are required. The rest (deck, updated, image, caption, song, strip) are optional. Put a post's photos in `public/writing/<slug>/`.

Math is KaTeX: `$inline$` and `$$display$$`. An image on its own line becomes a figure, and its quoted title becomes the caption.

## Where things live

| What | Where |
| --- | --- |
| Home, work, papers copy | `app/page.tsx`, `app/work/page.tsx`, `app/papers/page.tsx` |
| Paper list | `lib/papers.ts` |
| Email, links, CV path | `lib/site.ts` |
| Reading posts, drafts, word counts | `lib/posts.ts` |
| Markdown, math and figures | `lib/markdown.ts` |
| Date formatting (2026.09) | `lib/dates.ts` |
| CV | `public/cv/subash_cv.pdf` (also served at `/cv`) |
| Home photo | `public/photos/central-park.jpg` |
| Colours, type, layout | `app/globals.css` |

## The line

Three files, one job each:

- `lib/line/pen.ts`: the physics. A delay line and an underdamped spring. Every tunable number is a named constant at the top.
- `lib/line/drawTrace.ts`: draws the pen's history onto the canvas.
- `app/components/Line.tsx`: connects them to the page. It handles pointer and scroll events, finds the name in the nav, runs the 60Hz clock, and rests on essays.

The line hangs from whichever element has `data-line-anchor`, currently the name in `app/components/Nav.tsx`, at every screen width. On narrow screens `globals.css` moves the name out into the left padding, so the line runs down the margin instead of through the text.
