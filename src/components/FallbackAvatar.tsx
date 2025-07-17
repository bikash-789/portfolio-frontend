'use client';

import React from 'react';
import { AvatarGenerator } from '@/utils/avatarGenerator';
import { SIZES } from '@/constants';

interface FallbackAvatarProps {
  name: string;
  size?: number;
  className?: string;
  shape?: 'circle' | 'square';
  backgroundColor?: string;
  textColor?: string;
}

const FallbackAvatar: React.FC<FallbackAvatarProps> = ({
  name,
  size = SIZES.AVATAR.LARGE,
  className = '',
  shape = 'circle',
  backgroundColor,
  textColor,
}) => {
  const firstChar = AvatarGenerator.getCharacter(name);
  const defaultColors = AvatarGenerator.getColorForCharacter(firstChar);
  const bgColor = backgroundColor || defaultColors.bg;
  const txtColor = textColor || defaultColors.text;
  const radius = shape === 'circle' ? size / 2 : size * 0.15;
  const fontSize = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={size}
        height={size}
        rx={radius}
        ry={radius}
        fill={bgColor}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fill={txtColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
      >
        {firstChar}
      </text>
    </svg>
  );
};

export default FallbackAvatar; 