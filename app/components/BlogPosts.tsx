import { BlogPost } from '../data/blogPosts';
import { BlogCard } from './BlogCard';

interface BlogPostsProps {
  posts: BlogPost[];
  showOnlyFeatured?: boolean;
}

export function BlogPosts({ posts, showOnlyFeatured = false }: BlogPostsProps) {
  const filteredPosts = showOnlyFeatured 
    ? posts.filter(post => post.featured && post.published && !post.hidden)
    : posts.filter(post => !post.hidden);

  return (
    <div className="writing-cards">
      {filteredPosts.map((post, i) => (
        <BlogCard
          key={i}
          title={post.title}
          description={post.description}
          href={post.published ? `/writing/${post.slug}` : undefined}
        />
      ))}
    </div>
  );
}
