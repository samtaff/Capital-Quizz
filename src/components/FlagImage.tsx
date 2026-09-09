import React, { useState } from 'react';

interface FlagImageProps {
  countryId: string;
  countryName: string;
  className?: string;
  fallbackEmoji?: string;
}

export const FlagImage: React.FC<FlagImageProps> = ({
  countryId,
  countryName,
  className = '',
  fallbackEmoji = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const code = (countryId || '').trim().toLowerCase();

  if (!code || loadError) {
    return (
      <span className={`inline-flex items-center justify-center select-none ${className}`}>
        {fallbackEmoji || '🏳️'}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w160/${code}.png`}
      srcSet={`https://flagcdn.com/w320/${code}.png 2x`}
      alt={`Drapeau ${countryName}`}
      loading="eager"
      onError={() => setLoadError(true)}
      className={`object-cover shadow-sm select-none ${className}`}
    />
  );
};
