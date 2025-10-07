interface BlogCardProps {
  title: string;
  description: string;
  href?: string;
  comingSoon?: boolean;
}

export function BlogCard({ title, description, href, comingSoon = false }: BlogCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  
  return (
    <CardWrapper 
      href={href}
      className={`writing-card ${href ? 'active' : 'upcoming'}`}
    >
      <div className="card-title">{title}</div>
      <div className="card-description">{description}</div>
      {href ? (
        <div className="card-link">Read post →</div>
      ) : (
        <div className="card-coming-soon">Coming soon...</div>
      )}
    </CardWrapper>
  );
}
