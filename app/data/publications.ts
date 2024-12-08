export interface Publication {
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  url: string;
  distinguished?: boolean;
}

export const publications: Publication[] = [
  {
    title: "Learning Symmetry-Independent Jet Representations via Jet-Based Joint Embedding Predictive Architecture",
    authors: ["Subash Katel", "Haoyang Li", "Zihan Zhao", "Javier Duarte"],
    venue: "ML4Jets Workshop & NeurIPS Workshop on Machine Learning for Physical Sciences",
    year: 2024,
    url: "#",
  },
  {
    title: "Reducing the Carbon Footprint of EdTech with Repurposed Devices",
    authors: ["J. Switzer", "S. Katel", "J. C. Lee", "A. R. A. Rajan", "R. Kastner", "P. Pannuto"],
    venue: "MICRO IGSCC Workshop",
    year: 2024,
    url: "#"
  },
//   {
//     title: "Your Publication Title",
//     authors: ["Subash Katel", "Other Authors"],
//     venue: "Conference/Journal Name",
//     year: 2024,
//     url: "#"
//   },
];