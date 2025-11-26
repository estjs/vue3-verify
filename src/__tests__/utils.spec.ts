/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import {
  calculateContrastColor,
  loadImage,
  randomCode,
  randomColor,
  randomInt,
  randomNum,
} from '../utils';

describe('utils', () => {
  describe('loadImage', () => {
    it('should load image successfully', async () => {
      const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const img = await loadImage(src);

      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toBe(src);
    });

    it('should reject on error', async () => {
      const invalidSrc = 'invalid-url';

      await expect(loadImage(invalidSrc)).rejects.toThrow();
    });
  });

  describe('randomInt', () => {
    it('should generate random integer in range', () => {
      const min = 1;
      const max = 10;

      for (let i = 0; i < 100; i++) {
        const result = randomInt(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should return min when min equals max', () => {
      const value = 5;
      expect(randomInt(value, value)).toBe(value);
    });
  });

  describe('randomNum', () => {
    it('should generate random number in range', () => {
      const min = 1.5;
      const max = 10.5;

      for (let i = 0; i < 100; i++) {
        const result = randomNum(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });
  });

  describe('randomCode', () => {
    it('should generate code with default length', () => {
      const code = randomCode();
      expect(code).toHaveLength(4);
      expect(/^[0-9A-Z]+$/i.test(code)).toBe(true);
    });

    it('should generate code with custom length', () => {
      const length = 8;
      const code = randomCode(length);
      expect(code).toHaveLength(length);
      expect(/^[0-9A-Z]+$/i.test(code)).toBe(true);
    });

    it('should generate different codes', () => {
      const code1 = randomCode(10);
      const code2 = randomCode(10);
      expect(code1).not.toBe(code2);
    });
  });

  describe('randomColor', () => {
    it('should generate valid RGB color', () => {
      const color = randomColor();
      expect(/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(color)).toBe(true);
    });

    it('should respect min and max values', () => {
      const min = 100;
      const max = 200;

      for (let i = 0; i < 50; i++) {
        const color = randomColor(min, max);
        const matches = color.match(/\d+/g);

        expect(matches).toHaveLength(3);
        matches!.forEach(val => {
          const num = Number.parseInt(val);
          expect(num).toBeGreaterThanOrEqual(min);
          expect(num).toBeLessThanOrEqual(max);
        });
      }
    });
  });
});

describe('calculateContrastColor', () => {
  it('returns dark color for light background', () => {
    const ctx = {
      getImageData: () => ({ data: [200, 200, 200, 255] }),
    } as any;
    const color = calculateContrastColor(ctx, [{ x: 0, y: 0 }]);
    const darkColors = ['#000000', '#1a1a1a', '#2d2d2d', '#0C2340', '#003D79'];
    expect(darkColors).toContain(color);
  });

  it('returns light color for dark background', () => {
    const ctx = {
      getImageData: () => ({ data: [10, 10, 10, 255] }),
    } as any;
    const color = calculateContrastColor(ctx, [{ x: 0, y: 0 }]);
    const lightColors = ['#FFFFFF', '#F0F0F0', '#E8E8E8', '#FAFAFA'];
    expect(lightColors).toContain(color);
  });

  it('handles getImageData errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ctx = {
      getImageData: () => {
        throw new Error('getImageData failed');
      },
    } as any;
    const color = calculateContrastColor(ctx, [{ x: 0, y: 0 }]);

    // Should return fallback color (avgLuminance = 0.5)
    const allColors = [
      '#000000',
      '#1a1a1a',
      '#2d2d2d',
      '#0C2340',
      '#003D79',
      '#FFFFFF',
      '#F0F0F0',
      '#E8E8E8',
      '#FAFAFA',
    ];
    expect(allColors).toContain(color);
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
