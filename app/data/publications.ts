export interface Publication {
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  url: string;
  distinguished?: boolean;
  image?: string;
  featured?: boolean;
}

export const publications: Publication[] = [
  {
    title: "Learning Symmetry-Independent Jet Representations via Jet-Based Joint Embedding Predictive Architecture",
    authors: ["Subash Katel", "Haoyang Li", "Zihan Zhao", "Javier Duarte"],
    venue: "ML4Jets Workshop & NeurIPS Workshop on Machine Learning for Physical Sciences",
    year: 2024,
    url: "https://arxiv.org/abs/2412.05333",
    image: "/images/jepa.png",
    featured: true,
  },
  {
    title: "Reducing the Carbon Footprint of EdTech with Repurposed Devices",
    authors: ["J. Switzer", "S. Katel", "J. C. Lee", "A. R. A. Rajan", "R. Kastner", "P. Pannuto"],
    venue: "MICRO IGSCC Workshop",
    year: 2024,
    url: "https://ieeexplore.ieee.org/abstract/document/10765841",
    image: "/images/carbon_foot.png",
    featured: true,
  },
];
