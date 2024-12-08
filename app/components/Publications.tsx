import { Publication } from '../data/publications';

export function Publications({ publications }: { publications: Publication[] }) {
  return (
    <div className='rows'>
      {publications.map((pub, i) => (
        <div key={i} className='row'>
          <p className='pub'>
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
        </div>
      ))}
    </div>
  );
}