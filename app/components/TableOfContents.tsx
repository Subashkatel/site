'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string>('');

  useEffect(() => {
    // Extract all h2 and h3 headings from the page
    const elements = Array.from(
      document.querySelectorAll('#right h2, #right h3')
    );

    const headingData: Heading[] = elements.map((element) => ({
      id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    }));

    // Set IDs on headings that don't have them
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = headingData[index].id;
      }
    });

    setHeadings(headingData);

    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
        Table of Contents
      </h3>
  <nav style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const isHovered = hoveredId === heading.id;

            return (
              <li
                key={heading.id}
                style={{
                  paddingLeft: heading.level === 3 ? '1rem' : '0',
                  marginTop: '0.15rem',
                }}
              >
                <a
                  href={`#${heading.id}`}
                  style={{
                    color: isActive ? '#2563eb' : isHovered ? '#374151' : '#6b7280',
                    textDecoration: 'none',
                    fontWeight: isActive ? '600' : '400',
                    backgroundColor: isHovered && !isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    borderRadius: '4px',
                    padding: '0.15rem 0.45rem',
                    display: 'inline-block',
                    transition: 'color 0.2s ease, background-color 0.2s ease',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                  onMouseEnter={() => setHoveredId(heading.id)}
                  onMouseLeave={() => setHoveredId('')}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
