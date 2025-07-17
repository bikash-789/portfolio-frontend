'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { imageUrlConverter } from '@/utils/strategies/ImageUrlConverter';
import { AvatarGenerator } from '@/utils/avatarGenerator';
import { SIZES } from '@/constants';

interface DynamicImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallback?: string;
  fallbackName?: string;
  fallbackShape?: 'circle' | 'square';
  fallbackSize?: number;
  onUrlConverted?: (originalUrl: string, convertedUrl: string) => void;
}

const DynamicImage: React.FC<DynamicImageProps> = ({ 
  src, 
  fallback,
  fallbackName,
  fallbackShape = 'circle',
  fallbackSize = SIZES.AVATAR.LARGE,
  onUrlConverted,
  onError,
  ...props 
}) => {
  const convertedSrc = imageUrlConverter.convert(src);

  React.useEffect(() => {
    if (convertedSrc !== src && onUrlConverted) {
      onUrlConverted(src, convertedSrc);
    }
  }, [src, convertedSrc, onUrlConverted]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    console.error('DynamicImage failed to load:', e.currentTarget.src);
    
    if (fallbackName && !e.currentTarget.src.includes('data:image/svg+xml')) {
      const svgFallback = AvatarGenerator.generateSvgDataUrl({
        name: fallbackName,
        size: fallbackSize,
        shape: fallbackShape,
      });
      e.currentTarget.src = svgFallback;
      return;
    }
    
    if (fallback && e.currentTarget.src !== fallback && !e.currentTarget.src.includes('data:image/svg+xml')) {
      e.currentTarget.src = fallback;
      return;
    }
    
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={convertedSrc}
      alt={props.alt || ''}
      onError={handleError}
    />
  );
};

export default DynamicImage; 