# Vue3 Verify

一个现代化、轻量级的 Vue 3 验证组件库，支持 TypeScript。

[![npm version](https://img.shields.io/npm/v/vue3-verify.svg)](https://www.npmjs.com/package/vue3-verify)
[![License](https://img.shields.io/npm/l/vue3-verify.svg)](https://github.com/yourusername/vue3-verify/blob/main/LICENSE)

[English](./README.md)

## ✨ 特性

- 🎯 **5 种验证方式** - 滑动、拼图、点选、图片验证码、计算验证码
- 🎨 **主题定制** - 完全控制颜色和样式
- 📱 **响应式** - 适配所有屏幕尺寸
- 🔒 **类型安全** - 使用 TypeScript 编写
- ⚡ **轻量级** - 最小化依赖
- 🎭 **易于使用** - 简单直观的 API

## 📦 安装

```bash
npm install vue3-verify
# 或
pnpm add vue3-verify
# 或
yarn add vue3-verify
```

## 🚀 快速开始

```vue
<template>
  <Verify
    type="slide"
    img-url="https://example.com/image.jpg"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import { Verify } from 'vue3-verify';

const handleSuccess = (data) => {
  console.log('验证成功！', data);
};

const handleError = () => {
  console.log('验证失败！');
};
</script>
```

## 📖 验证类型

### 1. 滑动验证

简单的滑动解锁验证。

```vue
<Verify
  type="slide"
  :width="310"
  :height="155"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**属性：**
- `type`: `"slide"`
- `width`: 画布宽度（默认：310）
- `height`: 画布高度（默认：155）
- `img-url`: 背景图片 URL

### 2. 拼图验证

滑动拼图块以完成图像。

```vue
<Verify
  type="puzzle"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**属性：**
- `type`: `"puzzle"`
- `width`: 画布宽度
- `height`: 画布高度
- `img-url`: 背景图片 URL

### 3. 点选验证

按正确顺序点击图片。

```vue
<Verify
  type="pick"
  :num="3"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**属性：**
- `type`: `"pick"`
- `num`: 需要点击的点数（默认：3）
- `img-url`: 背景图片 URL

### 4. 图片验证码

传统的图片验证码。

```vue
<template>
  <Verify ref="codeRef" type="picture" />
  <input v-model="userInput" @keyup.enter="verify" />
  <button @click="verify">验证</button>
</template>

<script setup>
import { ref } from 'vue';

const codeRef = ref();
const userInput = ref('');

const verify = () => {
  const isValid = codeRef.value.verify(userInput.value);
  if (isValid) {
    console.log('验证码正确！');
  } else {
    console.log('验证码错误！');
  }
};
</script>
```

**属性：**
- `type`: `"picture"`

**方法：**
- `verify(input: string)`: 验证用户输入
- `refresh()`: 生成新验证码

### 5. 计算验证码

基于数学计算的验证码，内置输入框和确认按钮。

```vue
<template>
  <Verify
    type="compute"
    :figure="100"
    :arith="0"
    @verify="handleVerify"
    @ready="onReady"
  />
</template>

<script setup>
import { Verify } from 'vue3-verify';

const handleVerify = (success) => {
  if (success) {
    console.log('答案正确！');
  } else {
    console.log('答案错误，请重试');
  }
};

const onReady = () => {
  console.log('计算验证码已生成');
};
</script>
```

**属性：**
- `type`: `"compute"`
- `figure`: 表达式中的最大数字（默认：100）
- `arith`: 运算类型 - `0` 随机，`1` 加法，`2` 减法，`3` 乘法（默认：0）

**事件：**
- `@verify`: 用户点击确认按钮时触发，返回 `true/false`
- `@ready`: 验证码生成时触发

**特性：**
- 自动生成输入框和确认按钮
- 支持算术运算（+、-、×）
- 简洁、清爽的样式

## 🎨 主题定制

```vue
<Verify
  type="slide"
  :theme="{
    primaryColor: '#f56c6c',
    successColor: '#67c23a',
    errorColor: '#909399',
    borderRadius: '8px'
  }"
/>
```

**主题选项：**
- `primaryColor`: 主色调（默认：`#409eff`）
- `successColor`: 成功颜色（默认：`#67c23a`）
- `errorColor`: 错误颜色（默认：`#f56c6c`）
- `warningColor`: 警告颜色（默认：`#e6a23c`）
- `infoColor`: 信息颜色（默认：`#909399`）
- `borderRadius`: 圆角（默认：`4px`）
- `fontSize`: 字体大小（默认：`14px`）
- `animationDuration`: 动画时长（默认：`0.3s`）

## 📡 事件

所有验证组件都会触发以下事件：

### `success`

验证成功时触发。

```vue
<Verify @success="handleSuccess" />
```

**参数：**
```typescript
{
  number  // 耗时（毫秒）
}
```

### `error`

验证失败时触发。

```vue
<Verify @error="handleError" />
```

### `ready`

组件准备就绪时触发。

```vue
<Verify @ready="handleReady" />
```

## 🔧 高级用法

### 访问组件方法

```vue
<template>
  <Verify ref="verifyRef" type="slide" />
  <button @click="refresh">刷新</button>
</template>

<script setup>
import { ref } from 'vue';

const verifyRef = ref();

const refresh = () => {
  verifyRef.value.refresh();
};
</script>
```

### 响应式尺寸

```vue
<template>
  <Verify
    type="slide"
    :width="windowWidth * 0.8"
    :height="windowHeight * 0.3"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

onMounted(() => {
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  });
});
</script>
```

## 📝 API 参考

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `VerifyType` | `'slide'` | 验证类型 |
| `width` | `number` | `310` | 组件宽度 |
| `height` | `number` | `155` | 组件高度 |
| `img-url` | `string` | - | 背景图片 URL |
| `num` | `number` | `3` | 点击数量（pick 类型） |
| `theme` | `ThemeConfig` | - | 自定义主题配置 |
| `show-refresh` | `boolean` | `true` | 显示刷新按钮 |

### 组件方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `refresh()` | - | `void` | 刷新验证 |
| `verify()` | `input: string` | `boolean` | 验证码输入（仅 picture/compute） |

### 类型定义

```typescript
type VerifyType = 'picture' | 'compute' | 'slide' | 'puzzle' | 'pick';

interface ThemeConfig {
  primaryColor?: string;
  successColor?: string;
  errorColor?: string;
  warningColor?: string;
  infoColor?: string;
  borderRadius?: string;
  fontSize?: string;
  animationDuration?: string;
}
```

## 🎯 示例

查看 [examples](./examples) 目录获取更多详细示例。

```bash
cd examples
pnpm install
pnpm dev
```

## 📄 许可证

[MIT](./LICENSE)

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。
