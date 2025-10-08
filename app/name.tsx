import myImage from '../public/images/IMG_1226.jpg';
import Image from 'next/image';

export function NameTransition({ showPicture = true }: { showPicture?: boolean }) {
  return (
    <>
      {showPicture && (
        <div className="relative w-[160px] h-[220px] mb-6">
          <Image
            src={myImage}
            alt="Subash Katel"
            fill
            sizes="(max-width: 768px) 180px, 180px"
            className="rounded-lg object-cover"
            priority
          />
        </div>
      )}
      <h1 id="Subash Katel" className="text-2xl font-bold">
        Subash Katel
      </h1>
    </>
  );
}