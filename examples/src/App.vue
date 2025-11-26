<template>
  <div id="app">
    <header class="header">
      <h1>Vue3-Verify 示例演示</h1>
      <p>5种验证方式完整示例</p>
    </header>

    <main class="container">
      <!-- 滑动验证 -->
      <section class="example-section">
        <div class="section-header">
          <h2>1. 滑动验证 (Slide)</h2>
          <code>type="slide"</code>
        </div>
        <div class="demo-box">
          <Verify
            type="slide"
            :width="310"
            :height="155"
            img-url="https://picsum.photos/310/155?random=1"
            @success="handleSuccess('滑动验证', $event)"
            @error="handleError('滑动验证')"
          />
        </div>
      </section>

      <!-- 拼图验证 -->
      <section class="example-section">
        <div class="section-header">
          <h2>2. 拼图验证 (Puzzle)</h2>
          <code>type="puzzle"</code>
        </div>
        <div class="demo-box">
          <Verify
            type="puzzle"
            :width="310"
            :height="155"
            img-url="https://picsum.photos/310/155?random=2"
            @success="handleSuccess('拼图验证', $event)"
            @error="handleError('拼图验证')"
          />
        </div>
      </section>

      <!-- 点选验证 -->
      <section class="example-section">
        <div class="section-header">
          <h2>3. 点选验证 (Pick)</h2>
          <code>type="pick"</code>
        </div>
        <div class="demo-box">
          <Verify
            type="pick"
            :width="310"
            :height="155"
            :num="3"
            img-url="https://picsum.photos/310/155?random=3"
            @success="handleSuccess('点选验证', $event)"
            @error="handleError('点选验证')"
          />
        </div>
      </section>

      <!-- 图片验证码 -->
      <section class="example-section">
        <div class="section-header">
          <h2>4. 图片验证码 (Picture)</h2>
          <code>type="picture"</code>
        </div>
        <div class="demo-box">
          <div style="display: flex; gap: 20px; align-items: center">
            <Verify ref="codeVerifyRef" type="picture" @ready="onCodeReady" />
            <div>
              <input
                v-model="codeInput"
                type="text"
                placeholder="请输入验证码"
                class="code-input"
                @keyup.enter="checkCode"
              />
              <button class="btn" @click="checkCode">验证</button>
            </div>
          </div>
          <div v-if="codeResult" :class="['result', codeResult.success ? 'success' : 'error']">
            {{ codeResult.message }}
          </div>
        </div>
      </section>

      <!-- 计算验证码 -->
      <section class="example-section">
        <div class="section-header">
          <h2>5. 计算验证码 (Compute)</h2>
          <code>type="compute"</code>
        </div>
        <div class="demo-box">
          <Verify
            ref="computeVerifyRef"
            type="compute"
            :figure="100"
            :arith="0"
            @verify="handleComputeVerify"
            @ready="onComputeReady"
          />
          <div>
            <input
              v-model="computeInput"
              type="text"
              placeholder="请输入验证码"
              class="code-input"
              @keyup.enter="checkComputeCode"
            />
            <button class="btn" @click="checkComputeCode">验证</button>
          </div>
        </div>
        <div v-if="computeResult" :class="['result', computeResult.success ? 'success' : 'error']">
          {{ computeResult.message }}
        </div>
      </section>

      <!-- 事件日志 -->
      <section class="example-section">
        <div class="section-header">
          <h2>事件日志</h2>
        </div>
        <div class="event-log">
          <div v-for="(log, index) in eventLogs" :key="index" :class="['log-item', log.type]">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-type">{{ log.eventType }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Verify from '../../src/components/Verify.vue';

// 验证码相关
const codeVerifyRef = ref();
const codeInput = ref('');
const codeResult = ref<{ success: boolean; message: string } | null>(null);

// 计算验证码相关
const computeVerifyRef = ref();
const computeInput = ref('');
const computeResult = ref<{ success: boolean; message: string } | null>(null);

// 事件日志
interface EventLog {
  time: string;
  type: 'success' | 'error' | 'ready';
  eventType: string;
  message: string;
}

const eventLogs = ref<EventLog[]>([]);

const addLog = (type: 'success' | 'error' | 'ready', eventType: string, message: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  eventLogs.value.unshift({
    time,
    type,
    eventType,
    message,
  });

  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10);
  }
};

const handleSuccess = (name: string, data: any) => {
  addLog('success', name, `验证成功！耗时: ${data.duration}ms`);
};

const handleError = (name: string) => {
  addLog('error', name, '验证失败，请重试');
};

const onCodeReady = () => {
  addLog('ready', '验证码', '验证码已生成');
};

const onComputeReady = () => {
  addLog('ready', '计算验证码', '计算验证码已生成');
};

const handleComputeVerify = (success: boolean) => {
  if (success) {
    computeResult.value = { success: true, message: '✓ 答案正确！' };
    addLog('success', '计算验证码', '答案正确');
  } else {
    computeResult.value = { success: false, message: '✗ 答案错误，请重试' };
    addLog('error', '计算验证码', '答案错误');
  }

  setTimeout(() => {
    computeResult.value = null;
  }, 1500);
};

const checkCode = () => {
  if (!codeInput.value) {
    codeResult.value = { success: false, message: '请输入验证码' };
    return;
  }

  const isValid = codeVerifyRef.value?.verify(codeInput.value);

  if (isValid) {
    codeResult.value = { success: true, message: '✓ 验证码正确！' };
    addLog('success', '验证码验证', '验证码输入正确');
    setTimeout(() => {
      codeVerifyRef.value?.refresh();
      codeInput.value = '';
      codeResult.value = null;
    }, 1500);
  } else {
    codeResult.value = { success: false, message: '✗ 验证码错误，请重试' };
    addLog('error', '验证码验证', '验证码输入错误');
    setTimeout(() => {
      codeVerifyRef.value?.refresh();
      codeInput.value = '';
      codeResult.value = null;
    }, 1500);
  }
};

const checkComputeCode = () => {
  if (!computeInput.value) {
    computeResult.value = { success: false, message: '请输入验证码' };
    return;
  }

  const isValid = computeVerifyRef.value?.verify(computeInput.value);

  if (isValid) {
    computeResult.value = { success: true, message: '✓ 验证码正确！' };
    addLog('success', '计算验证码验证', '计算验证码输入正确');
    setTimeout(() => {
      computeVerifyRef.value?.refresh();
      computeInput.value = '';
      computeResult.value = null;
    }, 1500);
  } else {
    computeResult.value = { success: false, message: '✗ 验证码错误，请重试' };
    addLog('error', '计算验证码验证', '计算验证码输入错误');
    setTimeout(() => {
      computeVerifyRef.value?.refresh();
      computeInput.value = '';
      computeResult.value = null;
    }, 1500);
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
}

.header {
  background: white;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #333;
  font-size: 32px;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.example-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
}

.section-header code {
  background: #f5f7fa;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #409eff;
}

.demo-box {
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
}

.code-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  margin-right: 10px;
}

.btn {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #66b1ff;
}

.result {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.result.success {
  background: #f0f9ff;
  color: #67c23a;
}

.result.error {
  background: #fef0f0;
  color: #f56c6c;
}

.event-log {
  background: #282c34;
  border-radius: 4px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  display: flex;
  gap: 12px;
}

.log-item.success {
  background: rgba(103, 194, 58, 0.1);
  border-left: 3px solid #67c23a;
}

.log-item.error {
  background: rgba(245, 108, 108, 0.1);
  border-left: 3px solid #f56c6c;
}

.log-item.ready {
  background: rgba(64, 158, 255, 0.1);
  border-left: 3px solid #409eff;
}

.log-time {
  color: #909399;
}

.log-type {
  color: #409eff;
  font-weight: bold;
  min-width: 80px;
}

.log-message {
  color: #abb2bf;
}
</style>
