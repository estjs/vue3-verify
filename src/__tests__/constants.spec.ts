/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import {
  CODE_CHARS,
  DEFAULT_COLORS,
  DEFAULT_CONFIG,
  VERIFY_STATUS,
  VERIFY_TYPES,
} from '../constants';

describe('constants', () => {
  describe('vERIFY_TYPES', () => {
    it('should have all 5 verification types', () => {
      expect(Object.keys(VERIFY_TYPES)).toHaveLength(5);
    });

    it('should have PICTURE type', () => {
      expect(VERIFY_TYPES.PICTURE).toBe('picture');
    });

    it('should have COMPUTE type', () => {
      expect(VERIFY_TYPES.COMPUTE).toBe('compute');
    });

    it('should have SLIDE type', () => {
      expect(VERIFY_TYPES.SLIDE).toBe('slide');
    });

    it('should have PUZZLE type', () => {
      expect(VERIFY_TYPES.PUZZLE).toBe('puzzle');
    });

    it('should have PICK type', () => {
      expect(VERIFY_TYPES.PICK).toBe('pick');
    });
  });

  describe('vERIFY_STATUS', () => {
    it('should have all status types', () => {
      expect(Object.keys(VERIFY_STATUS)).toHaveLength(5);
    });

    it('should have IDLE status', () => {
      expect(VERIFY_STATUS.IDLE).toBe('idle');
    });

    it('should have VERIFYING status', () => {
      expect(VERIFY_STATUS.VERIFYING).toBe('verifying');
    });

    it('should have SUCCESS status', () => {
      expect(VERIFY_STATUS.SUCCESS).toBe('success');
    });

    it('should have ERROR status', () => {
      expect(VERIFY_STATUS.ERROR).toBe('error');
    });

    it('should have LOADING status', () => {
      expect(VERIFY_STATUS.LOADING).toBe('loading');
    });
  });

  describe('dEFAULT_CONFIG', () => {
    it('should have IMG_WIDTH', () => {
      expect(DEFAULT_CONFIG.IMG_WIDTH).toBe(310);
    });

    it('should have IMG_HEIGHT', () => {
      expect(DEFAULT_CONFIG.IMG_HEIGHT).toBe(155);
    });

    it('should have BLOCK_WIDTH', () => {
      expect(DEFAULT_CONFIG.BLOCK_WIDTH).toBe(50);
    });

    it('should have BLOCK_HEIGHT', () => {
      expect(DEFAULT_CONFIG.BLOCK_HEIGHT).toBe(50);
    });

    it('should have BAR_WIDTH', () => {
      expect(DEFAULT_CONFIG.BAR_WIDTH).toBe(310);
    });

    it('should have BAR_HEIGHT', () => {
      expect(DEFAULT_CONFIG.BAR_HEIGHT).toBe(40);
    });

    it('should have CODE_LENGTH', () => {
      expect(DEFAULT_CONFIG.CODE_LENGTH).toBe(4);
    });

    it('should have POINTS_COUNT', () => {
      expect(DEFAULT_CONFIG.POINTS_COUNT).toBe(3);
    });

    it('should have TOLERANCE', () => {
      expect(DEFAULT_CONFIG.TOLERANCE).toBe(5);
    });
  });

  describe('cODE_CHARS', () => {
    it('should be a string', () => {
      expect(typeof CODE_CHARS).toBe('string');
    });

    it('should contain digits', () => {
      expect(CODE_CHARS).toContain('0');
      expect(CODE_CHARS).toContain('9');
    });

    it('should contain uppercase letters', () => {
      expect(CODE_CHARS).toContain('A');
      expect(CODE_CHARS).toContain('Z');
    });

    it('should contain lowercase letters', () => {
      expect(CODE_CHARS).toContain('a');
      expect(CODE_CHARS).toContain('z');
    });

    it('should have correct length', () => {
      expect(CODE_CHARS.length).toBe(62); // 10 + 26 + 26
    });
  });

  describe('dEFAULT_COLORS', () => {
    it('should have primary color', () => {
      expect(DEFAULT_COLORS.primary).toBe('#409eff');
    });

    it('should have success color', () => {
      expect(DEFAULT_COLORS.success).toBe('#67c23a');
    });

    it('should have error color', () => {
      expect(DEFAULT_COLORS.error).toBe('#f56c6c');
    });

    it('should have warning color', () => {
      expect(DEFAULT_COLORS.warning).toBe('#e6a23c');
    });

    it('should have info color', () => {
      expect(DEFAULT_COLORS.info).toBe('#909399');
    });

    it('should have all 5 colors', () => {
      expect(Object.keys(DEFAULT_COLORS)).toHaveLength(5);
    });
  });
});
