'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const sections = [
  { href: '/work', label: 'work' },
  { href: '/papers', label: 'papers' },
  { href: '/writing', label: 'writing' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site">
      {/* data-line-anchor: the line in the rail starts just below this name. */}
      <Link className="site-name" href="/" data-line-anchor>
        {site.name}
      </Link>

      {sections.map((section) => {
        const isInSection = pathname.startsWith(section.href);
        const isSectionPage = pathname === section.href;
        return (
          <span key={section.href}>
            <Link
              href={section.href}
              className={isInSection ? 'current' : undefined}
              aria-current={isSectionPage ? 'page' : undefined}
            >
              {section.label}
            </Link>
            <span className="separator" aria-hidden="true">&middot;</span>
          </span>
        );
      })}

      <a href={site.cvPath}>cv</a>
    </nav>
  );
}
