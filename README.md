# Vue3 Verify

A modern, lightweight Vue 3 verification component library with TypeScript support.

[![npm version](https://img.shields.io/npm/v/vue3-verify.svg)](https://www.npmjs.com/package/vue3-verify)
[![License](https://img.shields.io/npm/l/vue3-verify.svg)](https://github.com/yourusername/vue3-verify/blob/main/LICENSE)

[中文文档](./README.zh-CN.md)

## ✨ Features

- 🎯 **5 Verification Types** - Slide, Puzzle, Points, Picture Code, Compute Code
- 🎨 **Customizable Themes** - Full control over colors and styles
- 📱 **Responsive** - Works on all screen sizes
- 🔒 **Type Safe** - Written in TypeScript
- ⚡ **Lightweight** - Minimal dependencies
- 🎭 **Easy to Use** - Simple and intuitive API

## 📦 Installation

```bash
npm install vue3-verify
# or
pnpm add vue3-verify
# or
yarn add vue3-verify
```

## 🚀 Quick Start

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
  console.log('Verification successful!', data);
};

const handleError = () => {
  console.log('Verification failed!');
};
</script>
```

## 📖 Verification Types

### 1. Slide Verification

Simple slide-to-unlock verification.

```vue
<Verify
  type="slide"
  :width="310"
  :height="155"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**Props:**
- `type`: `"slide"`
- `width`: Canvas width (default: 310)
- `height`: Canvas height (default: 155)
- `img-url`: Background image URL

### 2. Puzzle Verification

Slide puzzle piece to complete the image.

```vue
<Verify
  type="puzzle"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**Props:**
- `type`: `"puzzle"`
- `width`: Canvas width
- `height`: Canvas height
- `img-url`: Background image URL

### 3. Points Verification

Click points in the correct order.

```vue
<Verify
  type="pick"
  :num="3"
  img-url="https://example.com/image.jpg"
  @success="onSuccess"
/>
```

**Props:**
- `type`: `"pick"`
- `num`: Number of points to click (default: 3)
- `img-url`: Background image URL

### 4. Picture Code Verification

Traditional image-based captcha.

```vue
<template>
  <Verify ref="codeRef" type="picture" />
  <input v-model="userInput" @keyup.enter="verify" />
  <button @click="verify">Verify</button>
</template>

<script setup>
import { ref } from 'vue';

const codeRef = ref();
const userInput = ref('');

const verify = () => {
  const isValid = codeRef.value.verify(userInput.value);
  if (isValid) {
    console.log('Code is correct!');
  } else {
    console.log('Code is incorrect!');
  }
};
</script>
```

**Props:**
- `type`: `"picture"`

**Methods:**
- `verify(input: string)`: Verify user input
- `refresh()`: Generate new code

### 5. Compute Code Verification

Math-based captcha with built-in input box and confirm button.

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
    console.log('Correct answer!');
  } else {
    console.log('Wrong answer, try again');
  }
};

const onReady = () => {
  console.log('Compute code generated');
};
</script>
```

**Props:**
- `type`: `"compute"`
- `figure`: Maximum number in expression (default: 100)
- `arith`: Operation type - `0` random, `1` addition, `2` subtraction, `3` multiplication (default: 0)

**Events:**
- `@verify`: Emitted when user clicks confirm button, returns `true/false`
- `@ready`: Emitted when code is generated

**Features:**
- Auto-generated input field and confirm button
- Supports arithmetic operations (+, -, ×)
- Clean, minimal styling

<script setup lang="ts">
import { ref } from 'vue';
import Verify from '../../src/components/Verify.vue';

const computeRef = ref();

const handleSuccess = (name: string, data: any) => {
  console.log(`${name} 成功，耗时: ${data.duration}ms`);
};

const handleError = (name: string) => {
  console.log(`${name} 失败，请重试`);
};
</script>
```

**Explanation**
- The component renders a canvas with a math expression (e.g., `12 + 7 = ?`).
- Below the canvas an input field and a **确认** button appear automatically.
- Users type the answer and click **确认**; the component emits `success` or `error` events.
- You can also obtain a reference (`computeRef`) and call `computeRef.value?.verify(value)` manually if needed.

**Props** (same as picture mode)
- `type="compute"` – switches to compute mode.
- `width` / `height` – canvas size.
- `figure` – max number used in the expression (default `100`).
- `arith` – operation: `0` random, `1` addition, `2` subtraction, `3` multiplication.


## 🎨 Theme Customization

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

**Theme Options:**
- `primaryColor`: Primary color (default: `#409eff`)
- `successColor`: Success color (default: `#67c23a`)
- `errorColor`: Error color (default: `#f56c6c`)
- `warningColor`: Warning color (default: `#e6a23c`)
- `infoColor`: Info color (default: `#909399`)
- `borderRadius`: Border radius (default: `4px`)
- `fontSize`: Font size (default: `14px`)
- `animationDuration`: Animation duration (default: `0.3s`)

## 📡 Events

All verification components emit these events:

### `success`

Emitted when verification succeeds.

```vue
<Verify @success="handleSuccess" />
```

**Payload:**
```typescript
{
  number  // Time taken in milliseconds
}
```

### `error`

Emitted when verification fails.

```vue
<Verify @error="handleError" />
```

### `ready`

Emitted when component is ready.

```vue
<Verify @ready="handleReady" />
```

## 🔧 Advanced Usage

### Accessing Component Methods

```vue
<template>
  <Verify ref="verifyRef" type="slide" />
  <button @click="refresh">Refresh</button>
</template>

<script setup>
import { ref } from 'vue';

const verifyRef = ref();

const refresh = () => {
  verifyRef.value.refresh();
};
</script>
```

### Responsive Sizing

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

## 📝 API Reference

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `VerifyType` | `'slide'` | Verification type |
| `width` | `number` | `310` | Component width |
| `height` | `number` | `155` | Component height |
| `img-url` | `string` | - | Background image URL |
| `num` | `number` | `3` | Number of points (for pick type) |
| `theme` | `ThemeConfig` | - | Custom theme configuration |
| `show-refresh` | `boolean` | `true` | Show refresh button |

### Component Methods

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `refresh()` | - | `void` | Refresh verification |
| `verify()` | `input: string` | `boolean` | Verify code input (picture/compute only) |

### Types

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

## 🎯 Examples

Check out the [examples](./examples) directory for more detailed examples.

```bash
cd examples
pnpm install
pnpm dev
```

## 📄 License

[MIT](./LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


