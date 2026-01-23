const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Industry standard for frontmatter

const writingDir = path.join(__dirname, '../app/writing');
const outputFile = path.join(__dirname, '../app/data/blogPosts.ts');

// Scan all directories in app/writing/
const dirs = fs.readdirSync(writingDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => !name.includes('-template')); // Skip all template folders

const blogPosts = [];

for (const slug of dirs) {
  const mdxPath = path.join(writingDir, slug, 'page.mdx');

  if (!fs.existsSync(mdxPath)) continue;

  const fileContent = fs.readFileSync(mdxPath, 'utf-8');

  // Try to extract metadata from MDX export
  const metadataMatch = fileContent.match(/export const metadata = \{([^}]+)\}/s);

  let metadata = {};

  if (metadataMatch) {
    // Parse the metadata object
    const metadataStr = metadataMatch[1];
    const title = metadataStr.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
    const description = metadataStr.match(/description:\s*['"]([^'"]+)['"]/)?.[1];
    const date = metadataStr.match(/date:\s*['"]([^'"]+)['"]/)?.[1];
    const published = !metadataStr.match(/published:\s*false/);
    const featured = metadataStr.match(/featured:\s*true/) !== null;
    const hidden = metadataStr.match(/hidden:\s*true/) !== null;

    metadata = { title, description, date, published, featured, hidden };
  } else {
    // Fallback: Try YAML frontmatter (for Obsidian integration!)
    try {
      const parsed = matter(fileContent);
      metadata = {
        title: parsed.data.title,
        description: parsed.data.description,
        date: parsed.data.date,
        published: parsed.data.published !== false,
        featured: parsed.data.featured === true,
        hidden: parsed.data.hidden === true,
      };
    } catch (error) {
      console.warn(`Could not parse metadata for ${slug}`);
      continue;
    }
  }

  if (metadata.title && metadata.description) {
    blogPosts.push({
      title: metadata.title,
      description: metadata.description,
      slug,
      date: metadata.date || undefined,
      published: metadata.published,
      featured: metadata.featured,
      hidden: metadata.hidden,
    });
  }
}

// Sort by date (newest first)
blogPosts.sort((a, b) => {
  if (!a.date || !b.date) return 0;
  return new Date(b.date) - new Date(a.date);
});

// Generate TypeScript file
const output = `// Auto-generated from MDX files - DO NOT EDIT MANUALLY
// Run: npm run gen-posts

export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date?: string;
  featured?: boolean;
  published?: boolean;
  hidden?: boolean;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};
`;

fs.writeFileSync(outputFile, output);
console.log(`✓ Generated ${blogPosts.length} blog posts in app/data/blogPosts.ts`);
