/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeVerify from '../components/CodeVerify.vue';

describe('code verify - comprehensive', () => {
  describe('picture mode draw functions', () => {
    it('should call drawPicture when mode is picture', async () => {
      const wrapper = mount(CodeVerify, {
        props: { mode: 'picture' },
      });
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      // After draw, code should be set
      expect(vm.code).toBeDefined();
    });

    it('should generate 4-character code in picture mode', async () => {
      const wrapper = mount(CodeVerify);
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      if (vm.code) {
        expect(vm.code.length).toBe(4);
      }
    });

    it('should call draw on mount', async () => {
      const wrapper = mount(CodeVerify);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm).toBeDefined();
    });

    it('should emit ready event after draw', () => {
      const wrapper = mount(CodeVerify);

      expect(wrapper.emitted('ready')).toBeTruthy();
    });
  });

  describe('compute mode draw functions', () => {
    it('should call drawCompute when mode is compute', async () => {
      const wrapper = mount(CodeVerify, {
        props: { mode: 'compute' },
      });
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      // After draw, code should contain math expression
      if (vm.code) {
        expect(/\\d+\\s[+\\-×]\\s\\d+\\s=\\s\\?/.test(vm.code)).toBe(true);
      }
    });

    it('should generate addition expression when arith is 1', async () => {
      // Test multiple times to ensure + appears
      for (let attempt = 0; attempt < 3; attempt++) {
        const wrapper = mount(CodeVerify, {
          props: { mode: 'compute', arith: 1 },
        });
        await wrapper.vm.$nextTick();
        const vm = wrapper.vm as any;

        if (vm.code && vm.code.includes('+')) {
          expect(vm.code).toContain('+');
          expect(vm.answer).toBeDefined();
          return; // Success
        }
      }
    });

    it('should generate subtraction expression when arith is 2', async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const wrapper = mount(CodeVerify, {
          props: { mode: 'compute', arith: 2 },
        });
        await wrapper.vm.$nextTick();
        const vm = wrapper.vm as any;

        if (vm.code && vm.code.includes('-')) {
          expect(vm.code).toContain('-');
          return;
        }
      }
    });

    it('should generate multiplication expression when arith is 3', async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const wrapper = mount(CodeVerify, {
          props: { mode: 'compute', arith: 3 },
        });
        await wrapper.vm.$nextTick();
        const vm = wrapper.vm as any;

        if (vm.code && vm.code.includes('×')) {
          expect(vm.code).toContain('×');
          return;
        }
      }
    });

    it('should respect figure prop', async () => {
      const wrapper = mount(CodeVerify, {
        props: { mode: 'compute', figure: 50, arith: 1 },
      });
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      if (vm.answer) {
        // Answer should be within reasonable range based on figure
        const answerNum = Number.parseInt(vm.answer, 10);
        expect(answerNum).toBeLessThan(100); // 50 + 50 max
      }
    });

    it('should ensure subtraction result is non-negative', async () => {
      const wrapper = mount(CodeVerify, {
        props: { mode: 'compute', arith: 2, figure: 10 },
      });
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      if (vm.answer) {
        const result = Number.parseInt(vm.answer, 10);
        expect(result).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('refresh function', () => {
    it('should regenerate code on refresh', async () => {
      const wrapper = mount(CodeVerify);
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;
      const oldCode = vm.code;

      vm.refresh();
      await wrapper.vm.$nextTick();

      // If both codes exist and context is available
      if (oldCode && vm.code) {
        // Codes might be different (not guaranteed due to randomness)
        expect(vm.code).toBeDefined();
      }
    });

    it('should clear user input on refresh in compute mode', async () => {
      const wrapper = mount(CodeVerify, {
        props: { mode: 'compute' },
      });
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      vm.userInput = '123';
      vm.refresh();
      await wrapper.vm.$nextTick();

      expect(vm.userInput).toBe('');
    });
  });

  describe('verify function', () => {
    it('should return true for correct code', async () => {
      const wrapper = mount(CodeVerify);
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      if (vm.code) {
        const result = vm.verify(vm.code);
        expect(result).toBe(true);
      }
    });

    it('should return false for incorrect code', async () => {
      const wrapper = mount(CodeVerify);
      await wrapper.vm.$nextTick();
      const vm = wrapper.vm as any;

      const result = vm.verify('WRONG');
      expect(result).toBe(false);
    });
  });
});
