import Link from 'next/link';
import { Row } from './components/Row';
import { site } from '@/lib/site';
import { formatMonth, todayAsIsoDate } from '@/lib/dates';

const interests = [
  'Decoders fast enough to keep up with a quantum computer, and whether they can be stacked the way memory is',
  'When it’s worth mixing different error-correcting codes',
  'Simulating the whole machine, quantum and classical bits together',
];

export default function HomePage() {
  /* The page is built at deploy time, so this is the month of the last deploy. */
  const lastChangedMonth = formatMonth(todayAsIsoDate());

  return (
    <Row>
      <p className="introduction">
        I&rsquo;m a second-year PhD student in computer science at Princeton, advised by{' '}
        <a href={site.advisorUrl}>Margaret Martonosi</a>, working at the intersection of
        classical and quantum architecture.
      </p>

      <p>Lately I&rsquo;ve been thinking about:</p>
      <ul className="interests">
        {interests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
      </ul>

      <p>
        Before Princeton I was at UC San Diego, working with Hadi Esmaeilzadeh, Ryan Kastner and
        Javier Duarte on compilers, sustainable computing and machine learning for particle physics.
      </p>

      <figure className="home-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/central-park.jpg"
          width={1000}
          height={1000}
          alt="A rowing boat on the Lake in Central Park, the midtown skyline beyond the trees"
        />
        <figcaption>The Lake, with midtown just out of earshot.</figcaption>
      </figure>

      <p>
        <Link href="/work">Work</Link>, for what I&rsquo;m up to.
        <br />
        <Link href="/papers">Papers</Link>, and <Link href="/writing">writing</Link>, which are
        different things.
        <br />
        <a href={site.cvPath}>CV</a>, for the ordinary version.
      </p>

      <p className="closing contact">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.scholarUrl}>Scholar</a>
        <a href={site.githubUrl}>GitHub</a>
        <br />
        <span className="numerals">Last changed {lastChangedMonth}</span>
      </p>
    </Row>
  );
}
