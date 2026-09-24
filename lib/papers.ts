/*
  The papers list, newest first.

  Write his own name exactly as MY_NAME so it gets bolded. Mark equal
  contribution by ending a name with EQUAL_CONTRIBUTION_MARK ("S. Katel*").
*/

export const MY_NAME = 'S. Katel';
export const EQUAL_CONTRIBUTION_MARK = '*';

export type Paper = {
  title: string;
  url?: string;
  authors: string[];
  venue: string;
  year: number;
  links: { label: string; href: string }[];
};

export const papers: Paper[] = [
  {
    title: 'Spatially Aware Linear Transformer (SAL-T) for Particle Jet Tagging',
    url: 'https://arxiv.org/abs/2510.23641',
    authors: ['A. Wang', 'Z. Zhao', 'S. Katel', 'V. Sahu', 'E. E. Khoda', 'A. Gandrakota', 'J. Ngadiuba', 'R. Cavanaugh', 'J. Duarte'],
    venue: 'arXiv preprint',
    year: 2025,
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2510.23641' },
    ],
  },
  {
    title: 'Learning Symmetry-Independent Jet Representations via Jet-Based Joint Embedding Predictive Architecture',
    url: 'https://arxiv.org/abs/2412.05333',
    authors: ['S. Katel*', 'H. Li*', 'Z. Zhao*', 'R. Kansal', 'F. Mokhtar', 'J. Duarte'],
    venue: 'ML4Jets, and NeurIPS Workshop on Machine Learning for Physical Sciences',
    year: 2024,
    links: [
      { label: 'pdf', href: 'https://arxiv.org/pdf/2412.05333' },
      { label: 'arXiv', href: 'https://arxiv.org/abs/2412.05333' },
    ],
  },
  {
    title: 'Reducing the Carbon Footprint of EdTech with Repurposed Devices',
    url: 'https://ieeexplore.ieee.org/document/10765841',
    authors: ['J. Switzer', 'S. Katel', 'J. C. Lee', 'A. R. A. Rajan', 'R. Kastner', 'P. Pannuto'],
    venue: 'International Green and Sustainable Computing Conference (IGSC)',
    year: 2024,
    links: [
      { label: 'pdf', href: 'https://www.jennifer-switzer.com/documents/junkyard_edtech.pdf' },
      { label: 'IEEE', href: 'https://ieeexplore.ieee.org/document/10765841' },
    ],
  },
];
