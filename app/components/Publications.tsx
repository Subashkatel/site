import { Publication } from '../data/publications';
import Image from 'next/image';

export function Publications({ publications }: { publications: Publication[] }) {
  return (
    <div className='rows'>
      {publications.map((pub, i) => (
        <div key={i} className='row' style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <p className='pub' style={{ flex: 1 }}>
            {pub.distinguished && (
              <span className="distinguished">
                (Distinguished Paper)<br />
              </span>
            )}
            <span className="title">{pub.title}</span>
            <br />
            <span className="authors">
              {pub.authors.join(", ")}
            </span>
            <br />
            {pub.venue ? `${pub.venue}, ${pub.year}` : pub.year}.
            <br />
            <a href={pub.url}>[paper]</a>
          </p>
          {pub.image && (
            <div style={{ 
              flexShrink: 0, 
              width: '100px', 
              height: '100px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              <Image
                src={pub.image}
                alt={pub.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}