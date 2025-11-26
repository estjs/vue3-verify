/**
 * 核心工具函数
 */

// ============ Canvas 工具 ============
export function loadImage(src: string): Promise<HTMLImageElement> {
  // In test environments (happy-dom) data URLs may not trigger load events.
  // Resolve immediately for data URLs to avoid timeout.
  if (src.startsWith('data:')) {
    const img = new Image();
    img.src = src;
    return Promise.resolve(img);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timeout = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 2000);
    img.addEventListener('load', () => {
      clearTimeout(timeout);
      resolve(img);
    });
    img.addEventListener('error', e => {
      clearTimeout(timeout);
      reject(e);
    });
    img.src = src;
  });
}

// ============ 数学工具 ============
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomNum = (min: number, max: number) => Math.random() * (max - min) + min;

// ============ 字符串工具 ============
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function randomCode(len: number = 4): string {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += CHARS[randomInt(0, CHARS.length - 1)];
  }
  return result;
}

// ============ 颜色工具 ============
export function randomColor(min: number = 0, max: number = 255): string {
  const r = randomInt(min, max);
  const g = randomInt(min, max);
  const b = randomInt(min, max);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Calculate relative luminance of RGB color
 * Using the formula from WCAG 2.0
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrasting color based on background luminance at specified positions
 * Samples the background image at given positions and returns a color with high contrast
 * @param ctx Canvas rendering context
 * @param positions Array of {x, y} positions to sample from the background
 * @returns High contrast color (dark for light backgrounds, light for dark backgrounds)
 */
export function calculateContrastColor(
  ctx: CanvasRenderingContext2D,
  positions: Array<{ x: number; y: number }>,
): string {
  // Dark colors for light backgrounds
  const darkColors = ['#000000', '#1a1a1a', '#2d2d2d', '#0C2340', '#003D79'];
  // Light colors for dark backgrounds
  const lightColors = ['#FFFFFF', '#F0F0F0', '#E8E8E8', '#FAFAFA'];

  let totalLuminance = 0;
  let validSamples = 0;

  // Sample pixels at each position
  for (const pos of positions) {
    try {
      const imageData = ctx.getImageData(pos.x, pos.y, 1, 1);
      const [r, g, b] = imageData.data;
      const luminance = getRelativeLuminance(r, g, b);
      totalLuminance += luminance;
      validSamples++;
    } catch (error) {
      // If sampling fails, continue with other positions
      console.warn('Failed to sample pixel at', pos, error);
    }
  }

  // Calculate average luminance
  const avgLuminance = validSamples > 0 ? totalLuminance / validSamples : 0.5;

  // Return dark color for light backgrounds (high luminance)
  // Return light color for dark backgrounds (low luminance)
  if (avgLuminance > 0.5) {
    // Light background, use dark text
    const index = randomInt(0, darkColors.length - 1);
    return darkColors[index];
  } else {
    // Dark background, use light text
    const index = randomInt(0, lightColors.length - 1);
    return lightColors[index];
  }
}
