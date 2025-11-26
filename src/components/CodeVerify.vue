<template>
  <div class="verify-code" @click="refresh">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { randomCode, randomColor, randomInt } from '../utils';
import type { LocaleType } from '../locales';

interface Props {
  mode?: 'picture' | 'compute';
  width?: number | string;
  height?: number | string;
  figure?: number; // 计算公式的位数
  arith?: 0 | 1 | 2 | 3; // 0=随机, 1=加, 2=减, 3=乘
  locale?: LocaleType; // 语言设置
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'picture',
  width: 116,
  height: 34,
  figure: 100,
  arith: 0,
  locale: 'zh-CN',
});

const emit = defineEmits<{
  ready: [];
  verify: [boolean];
}>();

const canvas = ref<HTMLCanvasElement>();
const code = ref('');
const answer = ref(''); // 计算公式的答案
const userInput = ref(''); // 输入框绑定值
const showError = ref(false);
const showSuccess = ref(false);

// Canvas尺寸 - 支持数字和百分比
const canvasWidth = computed(() => {
  if (typeof props.width === 'string') {
    return props.mode === 'compute' ? 320 : 116;
  }
  return Number(props.width);
});

const canvasHeight = computed(() => {
  if (typeof props.height === 'string') {
    return props.mode === 'compute' ? 45 : 38;
  }
  return Number(props.height);
});

function draw() {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return; // Guard against null context in test environments

  const w = canvasWidth.value;
  const h = canvasHeight.value;

  // 背景
  ctx.fillStyle = randomColor(200, 220);
  ctx.fillRect(0, 0, w, h);

  if (props.mode === 'compute') {
    // 计算模式
    drawCompute(ctx, w, h);
  } else {
    // 图片验证码模式
    drawPicture(ctx, w, h);
  }
}

function drawPicture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  code.value = randomCode(4);
  answer.value = code.value; // 图片模式，答案就是显示的内容

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(randomInt(0, w), randomInt(0, h));
    ctx.lineTo(randomInt(0, w), randomInt(0, h));
    ctx.strokeStyle = randomColor(100, 200);
    ctx.stroke();
  }

  // 绘制验证码
  code.value.split('').forEach((char, i) => {
    ctx.save();
    ctx.font = `bold ${randomInt(25, 35)}px Arial`;
    ctx.fillStyle = randomColor(30, 130);
    ctx.translate(15 + i * 25, 25);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  // 干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(100, 200);
    ctx.fillRect(randomInt(0, w), randomInt(0, h), 1, 1);
  }
}

function drawCompute(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // 生成计算公式
  let num1 = randomInt(1, props.figure);
  let num2 = randomInt(1, props.figure);

  // 根据 arith 选择运算符
  const operators = ['+', '-', '×'];
  let operatorIndex: number;

  if (props.arith === 0) {
    // 随机选择
    operatorIndex = randomInt(0, 2);
  } else {
    // 使用指定的运算符 (1=加, 2=减, 3=乘)
    operatorIndex = props.arith - 1;
  }

  const operator = operators[operatorIndex];

  // 计算答案
  let result = 0;
  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      // 确保结果为正
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      result = num1 - num2;
      break;
    case '×':
      result = num1 * num2;
      break;
  }

  code.value = `${num1} ${operator} ${num2} = ?`;
  answer.value = String(result);

  // 干扰线
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(randomInt(0, w), randomInt(0, h));
    ctx.lineTo(randomInt(0, w), randomInt(0, h));
    ctx.strokeStyle = randomColor(100, 200);
    ctx.stroke();
  }

  // 绘制公式
  ctx.save();
  ctx.font = `bold ${randomInt(20, 28)}px Arial`;
  ctx.fillStyle = randomColor(30, 130);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(code.value, w / 2, h / 2);
  ctx.restore();

  // 干扰点
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = randomColor(100, 200);
    ctx.fillRect(randomInt(0, w), randomInt(0, h), 1, 1);
  }
}

function refresh() {
  draw();
  userInput.value = '';
  showError.value = false;
  showSuccess.value = false;
}

function verify(input: string): boolean {
  if (!input) {
    console.warn('请输入验证码');
    return false;
  }
  return input.toLowerCase() === answer.value.toLowerCase();
}

onMounted(() => {
  draw();
  emit('ready');
});

defineExpose({ refresh, verify, code });
</script>

<style scoped>
.verify-code {
  display: inline-block;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.verify-code canvas {
  display: block;
}

.compute-area {
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-top: 1px solid #e8e8e8;
}

.verify-input {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  width: 80px;
  outline: none;
  transition: all 0.2s ease;
}

.verify-input:focus {
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
}

.verify-input.error {
  border-color: #d9534f;
  background: #fef0f0;
  animation: shake 0.3s;
}

.verify-input.success {
  border-color: #52c41a;
  background: #f0f9ff;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.verify-btn {
  padding: 6px 16px;
  font-size: 14px;
  background: linear-gradient(135deg, #52c41a, #49b015);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(82, 196, 26, 0.2);
  transition: all 0.2s ease;
}

.verify-btn:hover {
  background: linear-gradient(135deg, #49b015, #3f9b0f);
  box-shadow: 0 3px 8px rgba(82, 196, 26, 0.3);
  transform: translateY(-1px);
}

.verify-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(82, 196, 26, 0.2);
}
</style>
