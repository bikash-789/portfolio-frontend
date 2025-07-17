import { AVATAR_COLORS } from '@/constants';

export interface AvatarConfig {
  name: string;
  size: number;
  shape: 'circle' | 'square';
  backgroundColor?: string;
  textColor?: string;
}

export class AvatarGenerator {
  static getCharacter(name: string): string {
    return (name || '?').charAt(0).toUpperCase();
  }

  static getColorForCharacter(char: string): { bg: string; text: string } {
    const index = char.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }

  static generateSvgDataUrl(config: AvatarConfig): string {
    const { name, size, shape, backgroundColor, textColor } = config;
    const firstChar = this.getCharacter(name);
    const defaultColors = this.getColorForCharacter(firstChar);
    
    const bgColor = backgroundColor || defaultColors.bg;
    const txtColor = textColor || defaultColors.text;
    const radius = shape === 'circle' ? size / 2 : size * 0.15;
    const fontSize = size * 0.4;

    const svgString = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}" />
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              font-size="${fontSize}" fill="${txtColor}" 
              font-family="system-ui, -apple-system, sans-serif" font-weight="600">
          ${firstChar}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }
}

export const avatarGenerator = new AvatarGenerator(); 