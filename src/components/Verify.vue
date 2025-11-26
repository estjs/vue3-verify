<template>
  <component :is="comp" v-if="comp" v-bind="computedProps" ref="componentRef" />
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, useAttrs, watch } from 'vue';
import SlideVerify from './SlideVerify.vue';
import PointsVerify from './PointsVerify.vue';
import CodeVerify from './CodeVerify.vue';
import type { VerifyType } from '../types';
import type { LocaleType } from '../locales';

interface Props {
  type?: VerifyType;
  locale?: LocaleType;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'slide',
  locale: 'zh-CN',
});

const componentRef = ref();
const attrs = useAttrs();

const comp = shallowRef();
const map: Record<string, any> = {
  picture: CodeVerify,
  compute: CodeVerify,
  slide: SlideVerify,
  puzzle: SlideVerify,
  pick: PointsVerify,
};

const computedProps = computed(() => {
  const baseProps = {
    ...attrs,
    locale: props.locale,
  };

  switch (props.type) {
    case 'pick':
      return baseProps;
    default:
      return { ...baseProps, mode: props.type };
  }
});

watch(
  () => props.type,
  t => {
    comp.value = map[t] || SlideVerify;
  },
  { immediate: true },
);

defineExpose({
  verify(...args: any[]) {
    return componentRef.value?.verify(...args);
  },
  refresh(...args: any[]) {
    componentRef.value?.refresh(...args);
  },
});
</script>
