export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date?: string;
  featured?: boolean;
  published?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Anki for Researchers",
    description: "How I use spaced repetition to retain complex concepts",
    slug: "anki-for-researchers",
    date: "2025-01-15",
    featured: true,
    published: true,
  },
  {
    title: "Quantum Entanglement and Bell States: A Mathematical Journey",
    description: "Exploring quantum entanglement through rigorous mathematics and hands-on implementations",
    slug: "quantum-entanglement-bell-states",
    date: "2025-01-12",
    featured: true,
    published: true,
  },
  {
    title: "Gradient Descent: From Theory to Modern Optimizers",
    description: "A comprehensive mathematical and practical guide to gradient descent and its variants",
    slug: "gradient-descent-deep-dive",
    date: "2025-01-11",
    featured: true,
    published: true,
  },
  {
    title: "Paper Review: Quantum Architecture",
    description: "Deep dive into recent quantum architecture research",
    slug: "paper-review-quantum",
    featured: true,
    published: false,
  },
  {
    title: "My Princeton Journey",
    description: "Reflections on transitioning from undergrad to PhD",
    slug: "princeton-journey",
    featured: false,
    published: false,
  },
  {
    title: "Learning Systems",
    description: "Building effective knowledge management workflows",
    slug: "learning-systems",
    featured: false,
    published: false,
  },
];
