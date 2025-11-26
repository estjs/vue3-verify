<template>
  <div class="verify-slide">
    <!-- 图片区域 (仅puzzle模式显示) -->
    <div
      v-if="isPuzzle"
      class="verify-img-panel"
      :style="{ width: `${w}px`, height: `${h}px`, marginBottom: `${vSpace}px` }"
    >
      <canvas ref="canvas" :width="w" :height="h" />
      <!-- 拼图块 (仅puzzle模式) -->
      <canvas
        v-if="isPuzzle"
        ref="blockCanvas"
        class="verify-sub-block"
        :style="{ left: `${moveDistance}px`, top: `${blockY}px` }"
        :width="blockW"
        :height="blockH"
      />
      <!-- 缺口 -->
      <div
        class="verify-gap"
        :style="{
          width: `${blockW}px`,
          height: `${blockH}px`,
          top: `${blockY}px`,
          left: `${blockX}px`,
        }"
      />

      <!-- 刷新按钮 -->
      <div class="verify-refresh" @click="refresh">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            fill="currentColor"
            d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          />
        </svg>
      </div>
    </div>

    <!-- 滑动条区域 -->
    <div class="verify-bar-area" :style="{ width: barWidth, height: barHeight }">
      <span class="verify-msg">{{ statusText }}</span>

      <!-- 进度条 -->
      <div
        class="verify-left-bar"
        :style="{
          width: `${moveDistance}px`,
          borderColor: leftBarColor,
          transition: transitionWidth,
        }"
      >
        <span class="verify-msg">{{ successText }}</span>
      </div>

      <!-- 可移动滑块 -->
      <div
        class="verify-move-block"
        :style="{
          left: `${moveDistance}px`,
          backgroundColor: blockBgColor,
          transition: transitionLeft,
        }"
        @mousedown="handleStart"
        @touchstart="handleStart"
      >
        <!-- 图标 -->
        <svg v-if="iconType === 'arrow'" viewBox="0 0 24 24" width="20" height="20">
          <path :fill="iconColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
        <svg v-else-if="iconType === 'check'" viewBox="0 0 24 24" width="20" height="20">
          <path :fill="iconColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20">
          <path
            :fill="iconColor"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { loadImage, randomInt } from '../utils';
import { useLocale } from '../locales';
import type { LocaleType } from '../locales';
import type { BarSize, BlockSize, SizeConfig } from '../types';

interface Props {
  width?: number;
  height?: number;
  imgUrl?: string;
  imgName?: string[]; // 图片数组，顺序使用
  type?: string; // 'slide' | 'puzzle'
  vOffset?: number; // 误差量
  explain?: string; // 提示文字
  barSize?: BarSize; // 滑动条尺寸
  vSpace?: number; // 图片和滑动条间隔
  imgSize?: SizeConfig; // 图片尺寸
  blockSize?: BlockSize; // 拼图块尺寸
  locale?: LocaleType; // 语言设置
}

const props = withDefaults(defineProps<Props>(), {
  width: 310,
  height: 155,
  type: 'slide',
  vOffset: 5,
  vSpace: 10,
  locale: 'zh-CN',
});

const emit = defineEmits<{
  success: [number];
  error: [];
  ready: [];
}>();

// 实际使用的尺寸
const w = computed(() => {
  if (props.imgSize?.width) {
    return typeof props.imgSize.width === 'string' ? props.width : props.imgSize.width;
  }
  return props.width;
});

const h = computed(() => {
  if (props.imgSize?.height) {
    return typeof props.imgSize.height === 'string' ? props.height : props.imgSize.height;
  }
  return props.height;
});

const blockW = computed(() => {
  if (props.blockSize?.width) {
    return Number.parseInt(props.blockSize.width);
  }
  return 50;
});

const blockH = computed(() => {
  if (props.blockSize?.height) {
    return Number.parseInt(props.blockSize.height);
  }
  return 50;
});

const barWidth = computed(() => {
  if (props.barSize?.width) {
    return props.barSize.width;
  }
  return `${w.value}px`;
});

const barHeight = computed(() => {
  if (props.barSize?.height) {
    return props.barSize.height;
  }
  return '40px';
});

const isPuzzle = computed(() => props.type === 'puzzle');

// i18n support
const localeType = computed(() => (isPuzzle.value ? 'puzzle' : 'slide'));
const i18nTexts = useLocale(localeType.value, { locale: props.locale });
const defaultExplain = computed(() => props.explain || i18nTexts.value.explain);

// 图片索引（用于imgName数组）
const currentImgIndex = ref(0);

const canvas = ref<HTMLCanvasElement>();
const blockCanvas = ref<HTMLCanvasElement>();
const blockX = ref(0);
const blockY = ref(0);
const moveDistance = ref(0);
const startX = ref(0);
const isMoving = ref(false);
const isFinished = ref(false);
const startTime = ref(0);

// UI状态
const statusText = ref('');
const successText = ref('');
const blockBgColor = ref('#fff');
const leftBarColor = ref('#ddd');
const iconColor = ref('#000');
const iconType = ref<'arrow' | 'check' | 'close'>('arrow');
const transitionLeft = ref('');
const transitionWidth = ref('');

async function draw() {
  if (!canvas.value) return;

  // 选择图片URL
  let imageUrl = props.imgUrl || 'https://picsum.photos/310/155';
  if (props.imgName && props.imgName.length > 0) {
    // 顺序使用图片数组
    const index = currentImgIndex.value % props.imgName.length;
    imageUrl = props.imgName[index];
    currentImgIndex.value++;
  }

  const img = await loadImage(imageUrl);
  const ctx = canvas.value.getContext('2d')!;

  blockX.value = randomInt(w.value * 0.5, w.value - 60);
  blockY.value = randomInt(10, h.value - 60);

  ctx.drawImage(img, 0, 0, w.value, h.value);

  if (isPuzzle.value && blockCanvas.value) {
    const bctx = blockCanvas.value.getContext('2d')!;
    // 在目标canvas上绘制拼图块
    bctx.clearRect(0, 0, 50, 50);
    bctx.drawImage(img, blockX.value, blockY.value, 50, 50, 0, 0, 50, 50);
  }
}

function handleStart(e: MouseEvent | TouchEvent) {
  if (isFinished.value) return;

  const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  startX.value = x;
  isMoving.value = true;
  startTime.value = Date.now();

  statusText.value = '';
  blockBgColor.value = '#337ab7';
  leftBarColor.value = '#337ab7';
  iconColor.value = '#fff';

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);
  window.addEventListener('touchmove', handleMove);
  window.addEventListener('touchend', handleEnd);
}

function handleMove(e: MouseEvent | TouchEvent) {
  if (!isMoving.value) return;

  const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  let distance = x - startX.value;

  // 限制范围
  if (distance < 0) distance = 0;
  if (distance > w.value - 50) {
    distance = w.value - 50;
    if (!isPuzzle.value) {
      successText.value = i18nTexts.value.ready || '松开验证';
    }
  } else {
    successText.value = '';
  }

  moveDistance.value = distance;
}

function handleEnd() {
  if (!isMoving.value) return;

  isMoving.value = false;
  window.removeEventListener('mousemove', handleMove);
  window.removeEventListener('mouseup', handleEnd);
  window.removeEventListener('touchmove', handleMove);
  window.removeEventListener('touchend', handleEnd);

  const duration = Date.now() - startTime.value;

  // Puzzle verification logic
  if (isPuzzle.value) {
    const offset = Math.abs(moveDistance.value - blockX.value);
    if (offset < props.vOffset) {
      // success
      leftBarColor.value = '#5cb85c';
      iconColor.value = '#fff';
      iconType.value = 'check';
      successText.value = i18nTexts.value.success;
      isFinished.value = true;
      emit('success', offset);
    } else {
      // fail, reset
      blockBgColor.value = '#d9534f';
      leftBarColor.value = '#d9534f';
      iconColor.value = '#fff';
      iconType.value = 'close';
      setTimeout(() => {
        resetPosition();
      }, 400);
      emit('error');
    }
    return;
  }

  // Existing slide verification logic (unchanged)
  if (moveDistance.value >= w.value - 50) {
    isFinished.value = true;
    successText.value = i18nTexts.value.success;
    emit('success', duration);
  } else {
    moveDistance.value = 0;
    statusText.value = i18nTexts.value.error;
    emit('error');
  }
}

function resetPosition() {
  transitionLeft.value = 'left 0.3s';
  transitionWidth.value = 'width 0.3s';

  moveDistance.value = 0;
  successText.value = '';
  blockBgColor.value = '#fff';
  leftBarColor.value = '#ddd';
  iconColor.value = '#000';
  iconType.value = 'arrow';
  statusText.value = defaultExplain.value;
  isFinished.value = false;

  setTimeout(() => {
    transitionLeft.value = '';
    transitionWidth.value = '';
  }, 300);
}

async function refresh() {
  resetPosition();
  await draw();
}

function verify() {
  return isFinished.value;
}

onMounted(async () => {
  statusText.value = defaultExplain.value;
  await draw();
  emit('ready');
});

defineExpose({ refresh, verify });
</script>

<style scoped>
.verify-slide {
  width: 100%;
}

.verify-img-panel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  margin-bottom: 12px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.verify-img-panel:hover {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  border-color: #d0d0d0;
  transform: translateY(-1px);
}

.verify-gap {
  position: absolute;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4));
  border: 2px solid rgba(255, 255, 255, 0.95);
  z-index: 2;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}

.verify-refresh {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.65));
  border-radius: 8px;
  color: white;
  cursor: pointer;
  z-index: 3;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
}

.verify-refresh:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
  transform: scale(1.1) rotate(15deg);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.verify-refresh:active {
  transform: scale(1.05) rotate(15deg);
}

.verify-bar-area {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #f8f9fa, #f0f1f3);
  border-radius: 4px;
  text-align: center;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.02);
}

.verify-msg {
  width: 100%;
  color: #5a5a5a;
  font-size: 14px;
  user-select: none;
  line-height: inherit;
  transition: color 0.3s ease;
  font-weight: 400;
}

.verify-left-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 50%, #52c41a 100%);
  background-size: 200% 100%;
  border-radius: 4px 0 0 4px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.verify-left-bar .verify-msg {
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.verify-move-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 4px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 1px solid #e0e0e0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.verify-move-block::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(82, 196, 26, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.verify-move-block:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f0f3f8 100%);
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.08);
}

.verify-move-block svg path {
  fill: #52c41a;
}

.verify-move-block:active {
  cursor: grabbing;
  background: #52c41a;
}

.verify-sub-block {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.95);
  z-index: 3;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease;
  border-radius: 2px;
}
</style>
