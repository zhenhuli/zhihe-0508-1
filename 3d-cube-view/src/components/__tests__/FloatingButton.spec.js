import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatingButton from '@/components/FloatingButton.vue'

describe('FloatingButton', () => {
  it('should render the button', () => {
    const wrapper = mount(FloatingButton)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should emit click event when clicked', () => {
    const wrapper = mount(FloatingButton)
    const button = wrapper.find('button')
    
    button.trigger('click')
    
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click.length).toBe(1)
  })

  it('should have correct classes', () => {
    const wrapper = mount(FloatingButton)
    const button = wrapper.find('button')
    
    expect(button.classes()).toContain('group')
    expect(button.classes()).toContain('fixed')
    expect(button.classes()).toContain('bottom-6')
    expect(button.classes()).toContain('right-6')
    expect(button.classes()).toContain('z-50')
  })

  it('should contain the icon', () => {
    const wrapper = mount(FloatingButton)
    const svg = wrapper.find('svg')
    
    expect(svg.exists()).toBe(true)
    expect(svg.classes()).toContain('w-6')
    expect(svg.classes()).toContain('h-6')
    expect(svg.classes()).toContain('text-white')
  })
})
