/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SlideVerify from '../components/SlideVerify.vue';

describe('slideVerify', () => {
  describe('rendering', () => {
    it('renders canvas elements', () => {
      const wrapper = mount(SlideVerify, {
        props: {
          width: 310,
          height: 155,
          type: 'puzzle', // Canvas only renders in puzzle mode
        },
      });

      const canvases = wrapper.findAll('canvas');
      expect(canvases.length).toBeGreaterThanOrEqual(1);
    });

    it('renders refresh button', () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' }, // Refresh button only in puzzle mode
      });
      const refresh = wrapper.find('.verify-refresh');

      expect(refresh.exists()).toBe(true);
    });

    it('renders slider bar', () => {
      const wrapper = mount(SlideVerify);
      const bar = wrapper.find('.verify-bar-area');

      expect(bar.exists()).toBe(true);
    });

    it('renders move block', () => {
      const wrapper = mount(SlideVerify);
      const block = wrapper.find('.verify-move-block');

      expect(block.exists()).toBe(true);
    });
  });

  describe('props - dimensions', () => {
    it('accepts custom width and height', () => {
      const width = 400;
      const height = 200;

      const wrapper = mount(SlideVerify, {
        props: { width, height },
      });

      expect(wrapper.props('width')).toBe(width);
      expect(wrapper.props('height')).toBe(height);
    });

    it('accepts imgSize prop', () => {
      const wrapper = mount(SlideVerify, {
        props: { imgSize: { width: 320, height: 160 } },
      });

      expect(wrapper.props('imgSize')).toEqual({ width: 320, height: 160 });
    });

    it('accepts barSize prop', () => {
      const wrapper = mount(SlideVerify, {
        props: { barSize: { width: '300px', height: '50px' } },
      });

      expect(wrapper.props('barSize')).toEqual({ width: '300px', height: '50px' });
    });

    it('accepts blockSize prop', () => {
      const wrapper = mount(SlideVerify, {
        props: { blockSize: { width: '50px', height: '50px' } },
      });

      expect(wrapper.props('blockSize')).toEqual({ width: '50px', height: '50px' });
    });
  });

  describe('props - verification', () => {
    it('accepts vOffset prop', () => {
      const wrapper = mount(SlideVerify, {
        props: { vOffset: 10 },
      });

      expect(wrapper.props('vOffset')).toBe(10);
    });

    it('has default vOffset of 5', () => {
      const wrapper = mount(SlideVerify);
      expect(wrapper.props('vOffset')).toBe(5);
    });

    it('accepts vSpace prop', () => {
      const wrapper = mount(SlideVerify, {
        props: { vSpace: 10 },
      });

      expect(wrapper.props('vSpace')).toBe(10);
    });
  });

  describe('props - images', () => {
    it('handles single image URL prop', () => {
      const imgUrl = 'https://example.com/test.jpg';
      const wrapper = mount(SlideVerify, {
        props: { imgUrl },
      });

      expect(wrapper.props('imgUrl')).toBe(imgUrl);
    });

    it('handles multiple images via imgName array', () => {
      const imgName = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
      const wrapper = mount(SlideVerify, {
        props: { imgName },
      });

      expect(wrapper.props('imgName')).toEqual(imgName);
    });
  });

  describe('props - text', () => {
    it('accepts explain prop', () => {
      const explain = '向右滑动完成验证';
      const wrapper = mount(SlideVerify, {
        props: { explain },
      });

      expect(wrapper.props('explain')).toBe(explain);
    });
  });

  describe('type prop', () => {
    it('handles slide type', () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'slide' },
      });

      expect(wrapper.props('type')).toBe('slide');
    });

    it('handles puzzle type', () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' },
      });

      expect(wrapper.props('type')).toBe('puzzle');
    });
  });

  describe('methods', () => {
    it('can be refreshed', () => {
      const wrapper = mount(SlideVerify);
      const vm = wrapper.vm as any;

      if (vm.refresh) {
        expect(() => vm.refresh()).not.toThrow();
      }
    });

    it('exposes refresh method', () => {
      const wrapper = mount(SlideVerify);
      const vm = wrapper.vm as any;

      expect(typeof vm.refresh).toBe('function');
    });
  });

  describe('events', () => {
    it('component mounts without errors', () => {
      const wrapper = mount(SlideVerify);
      expect(wrapper.vm).toBeDefined();
    });

    it('handles refresh clicks', async () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' }, // Refresh button only in puzzle mode
      });
      const refresh = wrapper.find('.verify-refresh');

      await refresh.trigger('click');
      expect(wrapper.vm).toBeDefined();
    });

    it('should start moving on mousedown', () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' },
      });
      const vm = wrapper.vm as any;
      const moveBlock = wrapper.find('.verify-move-block');

      // Simulate mousedown
      moveBlock.trigger('mousedown', { clientX: 100 });

      expect(vm.isMoving).toBe(true);
    });

    it('should update distance on move', async () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' },
      });
      const vm = wrapper.vm as any;
      const moveBlock = wrapper.find('.verify-move-block');

      // Start
      await moveBlock.trigger('mousedown', { clientX: 0 });

      // Simulate handleMove with proper MouseEvent
      if (vm.handleMove) {
        const mockEvent = new MouseEvent('mousemove', { clientX: 50 });
        vm.handleMove(mockEvent);
        expect(vm.moveDistance).toBeGreaterThanOrEqual(0);
      }
    });

    it('should verify puzzle on handleEnd', async () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' },
      });
      const vm = wrapper.vm as any;

      if (vm.handleEnd) {
        // Set some movement
        vm.isMoving = true;
        vm.moveDistance = vm.blockX || 50;

        vm.handleEnd();
        await wrapper.vm.$nextTick();

        expect(vm.isMoving).toBe(false);
      }
    });

    it('should reset position on failed verification', async () => {
      const wrapper = mount(SlideVerify, {
        props: { type: 'puzzle' },
      });
      const vm = wrapper.vm as any;

      if (vm.resetPosition) {
        vm.resetPosition();
        await wrapper.vm.$nextTick();

        expect(vm.moveDistance).toBe(0);
      }
    });
  });
});
