import { useEffect, useState } from 'react';
import { Orbit } from 'lucide-react';

interface SpaceImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SpaceImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Space Imagery',
}: SpaceImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1328] via-[#101B36] to-[#060913] text-slate-300 p-6 ${className}`}
      >
        <Orbit className="w-8 h-8 text-cyan-400/80 mb-2" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-mono text-xs tracking-wide text-slate-400 text-center">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
