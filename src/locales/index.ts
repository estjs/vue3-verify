import { type ComputedRef, computed } from 'vue';
import zhCN from './zh-CN';
import enUS from './en-US';

export type LocaleType = 'zh-CN' | 'en-US';

export type LocaleMessages = typeof zhCN;

export const locales: Record<LocaleType, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export { zhCN, enUS };

export interface UseLocaleOptions {
  locale?: LocaleType;
  customTexts?: Record<string, any>;
}

export function useLocale(type: string, options: UseLocaleOptions = {}): ComputedRef<any> {
  const { locale = 'zh-CN', customTexts = {} } = options;

  return computed(() => {
    const messages = locales[locale]?.[type as keyof (typeof locales)['zh-CN']] || {};
    return {
      ...messages,
      ...customTexts,
    };
  });
}

export function t(text: string, params: Record<string, any> = {}): string {
  return text.replaceAll(/\{(\w+)\}/g, (_, key) => params[key] || '');
}
