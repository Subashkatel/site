import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Root } from 'hast';

/*
  Markdown to HTML: GitHub-flavoured markdown (tables, footnotes),
  KaTeX for $inline$ and $$display$$ math, and raw HTML allowed since
  the only author is the site's owner.
*/

function isBlankText(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/* A paragraph holding nothing but one image, or undefined. */
function findLoneImage(paragraph: Element): Element | undefined {
  const meaningfulChildren = paragraph.children.filter((child) => !isBlankText(child));
  if (meaningfulChildren.length !== 1) return undefined;

  const onlyChild = meaningfulChildren[0];
  if (onlyChild.type !== 'element') return undefined;
  if (onlyChild.tagName !== 'img') return undefined;
  return onlyChild;
}

function buildFigure(image: Element): Element {
  const caption = image.properties.title;
  delete image.properties.title;
  image.properties.loading = 'lazy';

  const hasCaption = typeof caption === 'string' && caption.length > 0;
  const children: ElementContent[] = [image];
  if (hasCaption) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: caption }],
    });
  }
  return { type: 'element', tagName: 'figure', properties: { className: ['wide'] }, children };
}

/*
  An image on a line of its own becomes a figure, and its title becomes
  the caption:

    ![A rowing boat on the Lake](/writing/slug/boat.jpg "The Lake, early.")
*/
function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p') return;
      if (!parent || index === undefined) return;

      const loneImage = findLoneImage(node);
      if (!loneImage) return;

      parent.children[index] = buildFigure(loneImage);
    });
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex, { strict: false })
    .use(rehypeFigures)
    .use(rehypeStringify);
  const renderedFile = await processor.process(markdown);
  return String(renderedFile);
}
