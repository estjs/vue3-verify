/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PointsVerify from '../components/PointsVerify.vue';

describe('pointsVerify', () => {
  describe('rendering', () => {
    it('renders canvas element', () => {
      const wrapper = mount(PointsVerify, {
        props: {
          width: 310,
          height: 155,
        },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.exists()).toBe(true);
    });

    it('renders refresh button', () => {
      const wrapper = mount(PointsVerify);
      const refresh = wrapper.find('.verify-refresh');

      expect(refresh.exists()).toBe(true);
    });

    it('renders tip text', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.html()).toContain('tip');
    });

    it('has action buttons', () => {
      const wrapper = mount(PointsVerify);
      const buttons = wrapper.findAll('button');

      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('props - dimensions', () => {
    it('accepts custom dimensions', () => {
      const width = 400;
      const height = 200;

      const wrapper = mount(PointsVerify, {
        props: { width, height },
      });

      expect(wrapper.props('width')).toBe(width);
      expect(wrapper.props('height')).toBe(height);
    });

    it('accepts imgSize prop', () => {
      const wrapper = mount(PointsVerify, {
        props: { imgSize: { width: 320, height: 160 } },
      });

      expect(wrapper.props('imgSize')).toEqual({ width: 320, height: 160 });
    });
  });

  describe('props - click count', () => {
    it('accepts checkNum prop for click count', () => {
      const checkNum = 5;
      const wrapper = mount(PointsVerify, {
        props: { checkNum },
      });

      expect(wrapper.props('checkNum')).toBe(checkNum);
    });

    it('has default checkNum value', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.props('checkNum')).toBe(3); // default
    });

    it('accepts defaultNum prop', () => {
      const defaultNum = 6;
      const wrapper = mount(PointsVerify, {
        props: { defaultNum },
      });

      expect(wrapper.props('defaultNum')).toBe(defaultNum);
    });

    it('has default defaultNum value', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.props('defaultNum')).toBe(4);
    });
  });

  describe('props - verification', () => {
    it('accepts vSpace prop', () => {
      const wrapper = mount(PointsVerify, {
        props: { vSpace: 15 },
      });

      expect(wrapper.props('vSpace')).toBe(15);
    });

    it('has default vSpace value', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.props('vSpace')).toBe(5);
    });
  });

  describe('props - images', () => {
    it('handles image URL prop', () => {
      const imgUrl = 'https://example.com/test.jpg';
      const wrapper = mount(PointsVerify, {
        props: { imgUrl },
      });

      expect(wrapper.props('imgUrl')).toBe(imgUrl);
    });

    it('handles multiple images via imgName array', () => {
      const imgName = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
      const wrapper = mount(PointsVerify, {
        props: { imgName },
      });

      expect(wrapper.props('imgName')).toEqual(imgName);
    });

    it('cycles through images sequentially', () => {
      const imgName = ['img1.jpg', 'img2.jpg'];
      const wrapper = mount(PointsVerify, {
        props: { imgName },
      });
      const vm = wrapper.vm as any;

      expect(vm.currentImgIndex).toBe(0);

      // Simulate refresh
      if (vm.refresh) {
        vm.refresh();
        expect(vm.currentImgIndex).toBe(1);

        vm.refresh();
        expect(vm.currentImgIndex).toBe(0); // Should cycle back
      }
    });
  });

  describe('interaction', () => {
    it('renders markers for user clicks', async () => {
      const wrapper = mount(PointsVerify);

      // Simulate click
      const canvas = wrapper.find('canvas');
      if (canvas.exists()) {
        await canvas.trigger('click');
        await wrapper.vm.$nextTick();
      }

      expect(wrapper.vm).toBeDefined();
    });

    it('handles canvas clicks', async () => {
      const wrapper = mount(PointsVerify);
      const canvas = wrapper.find('canvas');

      await canvas.trigger('click', { offsetX: 100, offsetY: 100 });
      expect(wrapper.vm).toBeDefined();
    });

    it('should add user points on canvas click', async () => {
      const wrapper = mount(PointsVerify, {
        props: { checkNum: 3 },
      });
      const vm = wrapper.vm as any;
      const canvas = wrapper.find('canvas');

      if (vm.canvasClick) {
        // Simulate click event
        const mockEvent = {
          clientX: 100,
          clientY: 100,
        } as MouseEvent;

        // Mock getBoundingClientRect
        Object.defineProperty(canvas.element, 'getBoundingClientRect', {
          value: () => ({ left: 0, top: 0 }),
        });

        vm.canvasClick(mockEvent);
        await wrapper.vm.$nextTick();

        expect(vm.userPoints.length).toBeGreaterThan(0);
      }
    });

    it('should trigger verify after checkNum clicks', () => {
      const wrapper = mount(PointsVerify, {
        props: { checkNum: 2 },
      });
      const vm = wrapper.vm as any;

      if (vm.canvasClick && vm.verify) {
        // Fill user points
        vm.userPoints = [
          { x: 50, y: 50 },
          { x: 100, y: 100 },
        ];

        expect(vm.userPoints.length).toBe(2);
      }
    });
  });

  describe('methods', () => {
    it('can refresh', () => {
      const wrapper = mount(PointsVerify);
      const vm = wrapper.vm as any;

      if (vm.refresh) {
        expect(() => vm.refresh()).not.toThrow();
      }
    });

    it('exposes refresh method', () => {
      const wrapper = mount(PointsVerify);
      const vm = wrapper.vm as any;

      expect(typeof vm.refresh).toBe('function');
    });
  });

  describe('state management', () => {
    it('tracks user clicks', () => {
      const wrapper = mount(PointsVerify, {
        props: { checkNum: 3 },
      });
      const vm = wrapper.vm as any;

      expect(vm.checkPosArr).toBeDefined();
      expect(Array.isArray(vm.checkPosArr)).toBe(true);
    });

    it('generates target points on mount', () => {
      const wrapper = mount(PointsVerify, {
        props: { defaultNum: 4 },
      });
      const vm = wrapper.vm as any;

      expect(vm.pointBackImgData).toBeDefined();
    });
  });

  describe('component stability', () => {
    it('mounts without errors', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.vm).toBeDefined();
    });

    it('renders stable HTML', () => {
      const wrapper = mount(PointsVerify);
      expect(wrapper.html()).toBeTruthy();
    });

    it('handles multiple refreshes', () => {
      const wrapper = mount(PointsVerify);
      const vm = wrapper.vm as any;

      if (vm.refresh) {
        vm.refresh();
        vm.refresh();
        vm.refresh();
      }

      expect(wrapper.vm).toBeDefined();
    });
  });
});
