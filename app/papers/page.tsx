import type { Metadata } from 'next';
import { Fragment } from 'react';
import { Row } from '../components/Row';
import { EQUAL_CONTRIBUTION_MARK, MY_NAME, papers, type Paper } from '@/lib/papers';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Papers',
  alternates: { canonical: '/papers' },
};

function hasEqualContributionMark(author: string): boolean {
  return author.endsWith(EQUAL_CONTRIBUTION_MARK);
}

function isMe(author: string): boolean {
  const nameWithoutMark = author.replace(EQUAL_CONTRIBUTION_MARK, '');
  return nameWithoutMark === MY_NAME;
}

function AuthorList({ authors }: { authors: string[] }) {
  return (
    <span className="authors">
      {authors.map((author, position) => {
        const isFirstAuthor = position === 0;
        return (
          <Fragment key={author}>
            {!isFirstAuthor && ', '}
            {isMe(author) ? <b>{author}</b> : author}
          </Fragment>
        );
      })}
    </span>
  );
}

function PaperEntry({ paper }: { paper: Paper }) {
  const title = paper.url ? <a href={paper.url}>{paper.title}</a> : <span>{paper.title}</span>;
  const hasLinks = paper.links.length > 0;

  return (
    <div className="paper">
      {title}
      <AuthorList authors={paper.authors} />
      <span className="venue">
        {paper.venue}, <span className="numerals">{paper.year}</span>
      </span>
      {hasLinks && (
        <span className="links">
          {paper.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </span>
      )}
    </div>
  );
}

export default function PapersPage() {
  const anyEqualContribution = papers.some((paper) => paper.authors.some(hasEqualContributionMark));

  return (
    <Row rail="papers" className="section">
      {papers.map((paper) => (
        <PaperEntry key={paper.title} paper={paper} />
      ))}

      {anyEqualContribution && <p className="equal-contribution-note">* equal contribution</p>}

      <p className="closing follows-note">
        Talks, posters and the full list are on the <a href={site.cvPath}>CV</a> and
        on <a href={site.scholarUrl}>Google Scholar</a>. Code is on <a href={site.githubUrl}>GitHub</a>.
      </p>
    </Row>
  );
}
