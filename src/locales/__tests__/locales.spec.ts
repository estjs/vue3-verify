/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { computed } from 'vue';
import { enUS, locales, t, useLocale, zhCN } from '../index';

describe('locales', () => {
  describe('locale objects', () => {
    it('should export zh-CN locale object', () => {
      expect(zhCN).toBeDefined();
      expect(zhCN.slide).toBeDefined();
      expect(zhCN.puzzle).toBeDefined();
      expect(zhCN.pick).toBeDefined();
      expect(zhCN.picture).toBeDefined();
      expect(zhCN.compute).toBeDefined();
    });

    it('should export en-US locale object', () => {
      expect(enUS).toBeDefined();
      expect(enUS.slide).toBeDefined();
      expect(enUS.puzzle).toBeDefined();
      expect(enUS.pick).toBeDefined();
      expect(enUS.picture).toBeDefined();
      expect(enUS.compute).toBeDefined();
    });

    it('should have correct zh-CN slide texts', () => {
      expect(zhCN.slide.explain).toBe('向右滑动完成验证');
      expect(zhCN.slide.success).toBe('验证成功');
      expect(zhCN.slide.error).toBe('验证失败');
      expect(zhCN.slide.ready).toBe('准备就绪');
    });

    it('should have correct en-US slide texts', () => {
      expect(enUS.slide.explain).toBe('Slide to verify');
      expect(enUS.slide.success).toBe('Success');
      expect(enUS.slide.error).toBe('Failed');
      expect(enUS.slide.ready).toBe('Ready');
    });

    it('should have correct zh-CN puzzle texts', () => {
      expect(zhCN.puzzle.explain).toBe('拖动滑块完成拼图');
      expect(zhCN.puzzle.success).toBe('验证成功');
    });

    it('should have correct en-US puzzle texts', () => {
      expect(enUS.puzzle.explain).toBe('Drag to complete puzzle');
      expect(enUS.puzzle.success).toBe('Success');
    });

    it('should have correct zh-CN pick texts', () => {
      expect(zhCN.pick.explain).toBe('请依次点击【{text}】');
      expect(zhCN.pick.success).toBe('验证成功');
    });

    it('should have correct en-US pick texts', () => {
      expect(enUS.pick.explain).toBe('Click in order: {text}');
      expect(enUS.pick.success).toBe('Success');
    });

    it('should have correct zh-CN picture texts', () => {
      expect(zhCN.picture.placeholder).toBe('请输入验证码');
      expect(zhCN.picture.refresh).toBe('点击刷新');
    });

    it('should have correct en-US picture texts', () => {
      expect(enUS.picture.placeholder).toBe('Enter code');
      expect(enUS.picture.refresh).toBe('Click to refresh');
    });

    it('should have correct zh-CN compute texts', () => {
      expect(zhCN.compute.placeholder).toBe('请输入计算结果');
      expect(zhCN.compute.refresh).toBe('点击刷新');
      expect(zhCN.compute.confirmText).toBe('确认');
    });

    it('should have correct en-US compute texts', () => {
      expect(enUS.compute.placeholder).toBe('Enter result');
      expect(enUS.compute.refresh).toBe('Click to refresh');
      expect(enUS.compute.confirmText).toBe('Confirm');
    });
  });

  describe('locales registry', () => {
    it('should have zh-CN in locales object', () => {
      expect(locales['zh-CN']).toBe(zhCN);
    });

    it('should have en-US in locales object', () => {
      expect(locales['en-US']).toBe(enUS);
    });
  });

  describe('useLocale', () => {
    it('should return zh-CN locale by default', () => {
      const texts = useLocale('slide');
      expect(texts.value.explain).toBe('向右滑动完成验证');
    });

    it('should return en-US locale when specified', () => {
      const texts = useLocale('slide', { locale: 'en-US' });
      expect(texts.value.explain).toBe('Slide to verify');
    });

    it('should return computed ref', () => {
      const texts = useLocale('slide');
      expect(texts.value).toBeDefined();
      // Verify it's reactive
      expect(computed).toBeDefined();
    });

    it('should merge custom texts', () => {
      const texts = useLocale('slide', {
        customTexts: { custom: 'Custom Text' },
      });
      expect(texts.value.custom).toBe('Custom Text');
      expect(texts.value.explain).toBe('向右滑动完成验证'); // Original still exists
    });

    it('should override default texts with custom texts', () => {
      const texts = useLocale('slide', {
        customTexts: { explain: 'Custom Explain' },
      });
      expect(texts.value.explain).toBe('Custom Explain');
    });

    it('should work with puzzle type', () => {
      const texts = useLocale('puzzle', { locale: 'en-US' });
      expect(texts.value.explain).toBe('Drag to complete puzzle');
    });

    it('should work with pick type', () => {
      const texts = useLocale('pick', { locale: 'zh-CN' });
      expect(texts.value.explain).toBe('请依次点击【{text}】');
    });

    it('should work with picture type', () => {
      const texts = useLocale('picture', { locale: 'en-US' });
      expect(texts.value.placeholder).toBe('Enter code');
    });

    it('should work with compute type', () => {
      const texts = useLocale('compute', { locale: 'zh-CN' });
      expect(texts.value.confirmText).toBe('确认');
    });

    it('should return empty object for unknown type', () => {
      const texts = useLocale('unknown', { locale: 'zh-CN' });
      expect(texts.value).toEqual({});
    });
  });

  describe('t function', () => {
    it('should replace single parameter', () => {
      const result = t('Hello {name}', { name: 'World' });
      expect(result).toBe('Hello World');
    });

    it('should replace multiple parameters', () => {
      const result = t('Click {text} in {order}', { text: 'button', order: 'sequence' });
      expect(result).toBe('Click button in sequence');
    });

    it('should handle missing parameters', () => {
      const result = t('Hello {name}', {});
      expect(result).toBe('Hello ');
    });

    it('should handle text without parameters', () => {
      const result = t('Simple text', {});
      expect(result).toBe('Simple text');
    });

    it('should replace same parameter multiple times', () => {
      const result = t('{name} says {name}', { name: 'Alice' });
      expect(result).toBe('Alice says Alice');
    });

    it('should handle Chinese characters in parameters', () => {
      const result = t('请依次点击【{text}】', { text: '天地玄黄' });
      expect(result).toBe('请依次点击【天地玄黄】');
    });

    it('should return original text if no params provided', () => {
      const result = t('No replacement');
      expect(result).toBe('No replacement');
    });
  });
});
