import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ControlPanel from '@/components/ControlPanel.vue'
import { defaultSettings } from '@/modules/StyleConfig'

describe('ControlPanel', () => {
  const defaultProps = {
    settings: { ...defaultSettings }
  }

  it('should render the panel', () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('should display the title', () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const title = wrapper.find('h2')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('控制面板')
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const closeButton = buttons[0]
    
    await closeButton.trigger('click')
    
    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close.length).toBe(1)
  })

  it('should emit changeMaterial event when material button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const targetButton = buttons.find(btn => btn.text() === '标准材质')
    
    await targetButton.trigger('click')
    
    expect(wrapper.emitted().changeMaterial).toBeTruthy()
    expect(wrapper.emitted().changeMaterial.length).toBe(1)
    expect(wrapper.emitted().changeMaterial[0]).toEqual(['meshStandard'])
  })

  it('should emit changeView event when view preset button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const targetButton = buttons.find(btn => btn.text() === '正面')
    
    await targetButton.trigger('click')
    
    expect(wrapper.emitted().changeView).toBeTruthy()
    expect(wrapper.emitted().changeView.length).toBe(1)
    expect(wrapper.emitted().changeView[0]).toEqual(['front'])
  })

  it('should emit changeColor event when color button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const cyanButton = buttons.find(btn => {
      const style = btn.element.getAttribute('style')
      return style && style.includes('#06b6d4')
    })
    
    if (cyanButton) {
      await cyanButton.trigger('click')
      expect(wrapper.emitted().changeColor).toBeTruthy()
      expect(wrapper.emitted().changeColor.length).toBe(1)
      expect(wrapper.emitted().changeColor[0]).toEqual(['#06b6d4'])
    }
  })

  it('should emit changeSpeed event when speed slider changes', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const sliders = wrapper.findAll('input[type="range"]')
    const speedSlider = sliders[0]
    
    await speedSlider.setValue(2)
    await speedSlider.trigger('input')
    
    expect(wrapper.emitted().changeSpeed).toBeTruthy()
    expect(wrapper.emitted().changeSpeed[0]).toEqual([2])
  })

  it('should emit changeLight event when light intensity slider changes', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const sliders = wrapper.findAll('input[type="range"]')
    const lightSlider = sliders[1]
    
    await lightSlider.setValue(1.5)
    await lightSlider.trigger('input')
    
    expect(wrapper.emitted().changeLight).toBeTruthy()
    expect(wrapper.emitted().changeLight[0]).toEqual([1.5])
  })

  it('should emit toggleRotation event when rotation button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const toggleButton = buttons.find(btn => btn.text() === '暂停旋转')
    
    if (toggleButton) {
      await toggleButton.trigger('click')
      expect(wrapper.emitted().toggleRotation).toBeTruthy()
      expect(wrapper.emitted().toggleRotation.length).toBe(1)
    }
  })

  it('should emit resetView event when reset button is clicked', async () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const buttons = wrapper.findAll('button')
    const resetButton = buttons.find(btn => btn.text() === '重置视角')
    
    if (resetButton) {
      await resetButton.trigger('click')
      expect(wrapper.emitted().resetView).toBeTruthy()
      expect(wrapper.emitted().resetView.length).toBe(1)
    }
  })

  it('should display correct speed value', () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const speedValue = wrapper.find('.text-primary.font-mono')
    
    expect(speedValue.exists()).toBe(true)
    expect(speedValue.text()).toBe('1.0x')
  })

  it('should display correct light intensity value', () => {
    const wrapper = mount(ControlPanel, { props: defaultProps })
    const lightValue = wrapper.find('.text-accent.font-mono')
    
    expect(lightValue.exists()).toBe(true)
    expect(lightValue.text()).toBe('1.0x')
  })
})
