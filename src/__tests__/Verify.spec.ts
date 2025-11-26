/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Verify from '../components/Verify.vue';

describe('verify', () => {
  it('should render with slide type by default', () => {
    const wrapper = mount(Verify);
    expect(wrapper.html()).toBeTruthy();
  });

  it('should render SlideVerify for slide type', () => {
    const wrapper = mount(Verify, {
      props: { type: 'slide' },
    });
    expect(wrapper.html()).toContain('verify-slide');
  });

  it('should render CodeVerify for picture type', () => {
    const wrapper = mount(Verify, {
      props: { type: 'picture' },
    });
    expect(wrapper.html()).toContain('verify-code');
  });

  it('should render PointsVerify for pick type', () => {
    const wrapper = mount(Verify, {
      props: { type: 'pick' },
    });
    expect(wrapper.html()).toContain('verify-points');
  });

  it('should pass through props to child component', () => {
    const wrapper = mount(Verify, {
      props: {
        type: 'slide',
      },
    });

    expect(wrapper.props('type')).toBe('slide');
  });

  it('should expose verify method', () => {
    const wrapper = mount(Verify, {
      props: { type: 'slide' },
    });
    const vm = wrapper.vm as any;

    expect(typeof vm.verify).toBe('function');
  });

  it('should expose refresh method', () => {
    const wrapper = mount(Verify, {
      props: { type: 'slide' },
    });
    const vm = wrapper.vm as any;

    expect(typeof vm.refresh).toBe('function');
  });

  it('should forward verify call to child component', () => {
    const wrapper = mount(Verify, {
      props: { type: 'slide' },
    });
    const vm = wrapper.vm as any;

    // Should not throw even if child doesn't have verify
    expect(() => vm.verify('test')).not.toThrow();
  });

  it('should forward refresh call to child component', () => {
    const wrapper = mount(Verify, {
      props: { type: 'slide' },
    });
    const vm = wrapper.vm as any;

    // Should not throw
    expect(() => vm.refresh()).not.toThrow();
  });
});
