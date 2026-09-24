import type { Metadata } from 'next';
import { Row } from '../components/Row';

/* Carried over from the old site. Not linked from the nav. */
export const metadata: Metadata = {
  title: 'Resources',
  alternates: { canonical: '/resources' },
};

const resources = [
  {
    name: 'LMU NLP Seminar',
    href: 'https://slds-lmu.github.io/seminar_nlp_ss20/',
    description: 'NLP seminar materials and presentations',
  },
  {
    name: 'NSF Fellowship Guide',
    href: 'https://www.alexhunterlang.com/nsf-fellowship',
    description: 'on applying for the NSF GRFP',
  },
  {
    name: 'Scaling Machine Learning with JAX',
    href: 'https://jax-ml.github.io/scaling-book/',
    description: 'on scaling ML systems',
  },
];

export default function ResourcesPage() {
  return (
    <Row rail="resources" className="section">
      <p className="intro">A few things I&rsquo;ve found useful.</p>
      {resources.map((resource) => (
        <div className="post-entry" key={resource.href}>
          <a className="post-title" href={resource.href}>{resource.name}</a>
          <span className="post-deck">{resource.description}</span>
        </div>
      ))}
    </Row>
  );
}
