<template>
  <component :is="comp" v-if="comp" v-bind="props" ref="componentRef" />
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
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

const comp = shallowRef();
const map: Record<string, any> = {
  picture: CodeVerify,
  compute: CodeVerify,
  slide: SlideVerify,
  puzzle: SlideVerify,
  pick: PointsVerify,
};

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
