import Link from 'next/link';
import { Row } from './components/Row';

export default function NotFoundPage() {
  return (
    <Row rail="404">
      <p>There&rsquo;s no page at this address. It may have moved when the site was rebuilt.</p>
      <p>
        <Link href="/">Home</Link>, <Link href="/writing">writing</Link>, or{' '}
        <Link href="/papers">papers</Link>.
      </p>
    </Row>
  );
}
