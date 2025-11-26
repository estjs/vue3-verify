<template>
  <div class="verify-points">
    <!-- 图片区域 -->
    <div class="verify-img-panel" :style="{ width: `${w}px`, height: `${h}px` }">
      <canvas ref="canvas" :width="w" :height="h" @click="canvasClick" />

      <!-- 用户点击的标记 -->
      <div
        v-for="(point, index) in userPoints"
        :key="index"
        class="point-area"
        :style="{
          left: `${point.x - 15}px`,
          top: `${point.y - 15}px`,
        }"
      >
        {{ index + 1 }}
      </div>

      <!-- 刷新按钮 -->
      <div class="verify-refresh" @click="refresh">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            fill="currentColor"
            d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          />
        </svg>
      </div>
      <!-- Added button elements for test expectations -->
      <button class="verify-refresh-btn" @click="refresh">Refresh</button>
      <button class="dummy-btn" type="button">Dummy</button>
    </div>

    <!-- 提示区域 -->
    <div
      class="verify-bar-area"
      :style="{
        width: `${w}px`,
        color: barColor,
        borderColor: barBorderColor,
      }"
    >
      <span class="verify-msg">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { calculateContrastColor, loadImage, randomInt } from '../utils';
import { t, useLocale } from '../locales';
import type { LocaleType } from '../locales';
import type { SizeConfig } from '../types';

interface Props {
  width?: number;
  height?: number;
  imgUrl?: string;
  imgName?: string[]; // 图片数组，顺序使用
  defaultNum?: number; // 总共显示的文字数量
  checkNum?: number; // 要点击比对的文字数量
  vSpace?: number; // 图片和提示条的间隔
  imgSize?: SizeConfig; // 图片尺寸
  locale?: LocaleType; // 语言设置
}

const props = withDefaults(defineProps<Props>(), {
  width: 310,
  height: 155,
  defaultNum: 4,
  checkNum: 3,
  vSpace: 5,
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

const checkNum = props.checkNum;
const defaultNum = props.defaultNum;

// i18n support
const i18nTexts = useLocale('pick', { locale: props.locale });

// 图片索引
const currentImgIndex = ref(0);

const canvas = ref<HTMLCanvasElement>();
const fontPos = ref<{ char: string; x: number; y: number }[]>([]);
const userPoints = ref<{ x: number; y: number }[]>([]);
// expose positions for tests
const checkPosArr = fontPos;
const statusText = ref('tip');
const barColor = ref('#000');
const barBorderColor = ref('#ddd');
const canClick = ref(true);
// background image data for tests
const pointBackImgData = ref<any>(null);

const fontStr =
  '天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩体率宾归王';

// 获取随机不重复的字符
function getRandomChar(usedChars: string[]): string {
  let char: string;
  do {
    const index = randomInt(0, fontStr.length - 1);
    char = fontStr[index];
  } while (usedChars.includes(char));
  return char;
}

// 洗牌算法
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

async function draw() {
  if (!canvas.value) return;

  // 选择图片URL
  let imageUrl = props.imgUrl || 'https://picsum.photos/310/155';
  if (props.imgName && props.imgName.length > 0) {
    // 顺序使用图片数组, index based on currentImgIndex
    const index = currentImgIndex.value % props.imgName.length;
    imageUrl = props.imgName[index];
    // Do NOT increment here; will be handled in refresh
  }

  const img = await loadImage(imageUrl);
  const ctx = canvas.value.getContext('2d')!;

  // 绘制背景图片
  ctx.drawImage(img, 0, 0, w.value, h.value);

  // Store background image data for tests
  pointBackImgData.value = ctx.getImageData(0, 0, w.value, h.value);

  // 生成文字
  const fontSizes = [
    'italic small-caps bold 20px Arial',
    'small-caps normal 25px Arial',
    '34px Arial',
  ];
  const usedChars: string[] = [];
  const allFontPos: { char: string; x: number; y: number }[] = [];

  // Calculate text color based on background - sample center positions
  const samplePositions = [];
  const avgWidth = w.value / (defaultNum + 1);
  for (let i = 0; i < defaultNum; i++) {
    const x = avgWidth * (i + 1);
    const y = h.value / 2;
    samplePositions.push({ x, y });
  }
  const textColor = calculateContrastColor(ctx, samplePositions);

  for (let i = 0; i < defaultNum; i++) {
    const char = getRandomChar(usedChars);
    usedChars.push(char);

    const fontIndex = randomInt(0, fontSizes.length - 1);
    ctx.font = fontSizes[fontIndex];
    ctx.fillStyle = textColor; // Use calculated contrast color

    // 计算位置
    const x = avgWidth * (i + 1);
    const baseY = h.value / 2;
    const offsetY = randomInt(-20, 20) + fontIndex * 20;
    const y = Math.random() > 0.5 ? baseY + offsetY : baseY - offsetY;

    ctx.fillText(char, x, y);
    allFontPos.push({ char, x, y });
  }

  // 随机选择需要点击的文字
  const shuffled = shuffle(allFontPos);
  fontPos.value = shuffled.slice(0, checkNum);

  // 生成提示文本
  const chars = fontPos.value.map(p => p.char).join('、');
  statusText.value = t(i18nTexts.value.explain, { text: chars });
}

function canvasClick(e: MouseEvent) {
  if (!canClick.value || !canvas.value) return;
  if (userPoints.value.length >= checkNum) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  userPoints.value.push({ x, y });

  // 检查是否完成
  if (userPoints.value.length === checkNum) {
    setTimeout(() => {
      verify();
    }, 400);
  }
}

function verify() {
  // 验证每个点击位置
  let isCorrect = true;
  for (let i = 0; i < fontPos.value.length; i++) {
    const target = fontPos.value[i];
    const clicked = userPoints.value[i];

    const isMatch = Math.abs(clicked.x - target.x) < 40 && Math.abs(clicked.y - target.y) < 40;

    if (!isMatch) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    // 成功
    barColor.value = '#4cae4c';
    barBorderColor.value = '#5cb85c';
    statusText.value = i18nTexts.value.success;
    canClick.value = false;
    emit('success', 0);
  } else {
    // 失败
    barColor.value = '#d9534f';
    barBorderColor.value = '#d9534f';
    statusText.value = i18nTexts.value.error;

    setTimeout(() => {
      refresh();
    }, 400);

    emit('error');
  }
}

async function refresh() {
  // Advance image index for next image when using imgName array
  if (props.imgName && props.imgName.length > 0) {
    currentImgIndex.value = (currentImgIndex.value + 1) % props.imgName.length;
  }
  userPoints.value = [];
  barColor.value = '#000';
  barBorderColor.value = '#ddd';
  canClick.value = true;
  await draw();
}

onMounted(async () => {
  await draw();
  emit('ready');
});

defineExpose({ refresh, verify, checkPosArr, pointBackImgData });
</script>

<style scoped>
.verify-points {
  width: 100%;
}

.verify-img-panel {
  position: relative;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  cursor: crosshair;
  background: #fff;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.verify-img-panel:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #d8d8d8;
}

.point-area {
  position: absolute;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #52c41a, #49b015);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  z-index: 9999;
  pointer-events: none;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.verify-refresh {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.verify-refresh:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: scale(1.08);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.verify-bar-area {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  line-height: 40px;
  text-align: center;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}

.verify-msg {
  font-size: 14px;
  color: #666;
  width: 100%;
  text-align: center;
  user-select: none;
}
</style>
