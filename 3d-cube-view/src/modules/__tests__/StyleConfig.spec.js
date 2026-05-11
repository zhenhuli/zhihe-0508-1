import { describe, it, expect } from 'vitest'
import { materialOptions, cubeColors, presetViews, defaultSettings, config } from '@/modules/StyleConfig'

describe('StyleConfig', () => {
  describe('materialOptions', () => {
    it('should export an array of material options', () => {
      expect(Array.isArray(materialOptions)).toBe(true)
      expect(materialOptions.length).toBeGreaterThan(0)
    })

    it('should have correct structure for each material option', () => {
      materialOptions.forEach(material => {
        expect(material).toHaveProperty('id')
        expect(material).toHaveProperty('name')
        expect(material).toHaveProperty('color')
        expect(typeof material.id).toBe('string')
        expect(typeof material.name).toBe('string')
        expect(typeof material.color).toBe('string')
      })
    })

    it('should contain expected material types', () => {
      const materialIds = materialOptions.map(m => m.id)
      expect(materialIds).toContain('meshStandard')
      expect(materialIds).toContain('meshPhong')
      expect(materialIds).toContain('wireframe')
    })
  })

  describe('cubeColors', () => {
    it('should export an array of color options', () => {
      expect(Array.isArray(cubeColors)).toBe(true)
      expect(cubeColors.length).toBe(8)
    })

    it('should have correct structure for each color option', () => {
      cubeColors.forEach(color => {
        expect(color).toHaveProperty('id')
        expect(color).toHaveProperty('name')
        expect(color).toHaveProperty('hex')
        expect(typeof color.id).toBe('string')
        expect(typeof color.name).toBe('string')
        expect(typeof color.hex).toBe('string')
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })
  })

  describe('presetViews', () => {
    it('should export an array of view presets', () => {
      expect(Array.isArray(presetViews)).toBe(true)
      expect(presetViews.length).toBe(8)
    })

    it('should have correct structure for each preset', () => {
      presetViews.forEach(preset => {
        expect(preset).toHaveProperty('id')
        expect(preset).toHaveProperty('name')
        expect(typeof preset.id).toBe('string')
        expect(typeof preset.name).toBe('string')
      })
    })

    it('should contain all expected view presets', () => {
      const presetIds = presetViews.map(p => p.id)
      const expectedIds = ['front', 'back', 'left', 'right', 'top', 'bottom', 'isometric', 'perspective']
      expectedIds.forEach(id => {
        expect(presetIds).toContain(id)
      })
    })
  })

  describe('defaultSettings', () => {
    it('should export default settings object', () => {
      expect(typeof defaultSettings).toBe('object')
    })

    it('should have correct default values', () => {
      expect(defaultSettings.rotationSpeed).toBe(1)
      expect(defaultSettings.lightIntensity).toBe(1)
      expect(defaultSettings.currentMaterial).toBe('meshStandard')
      expect(defaultSettings.currentColor).toBe('#6366f1')
      expect(defaultSettings.isRotating).toBe(true)
    })
  })

  describe('config', () => {
    it('should export config object with constraints', () => {
      expect(typeof config).toBe('object')
      expect(config.minRotationSpeed).toBe(0)
      expect(config.maxRotationSpeed).toBe(5)
      expect(config.minLightIntensity).toBe(0.1)
      expect(config.maxLightIntensity).toBe(2)
    })

    it('should have default camera position', () => {
      expect(config.defaultCameraPosition).toEqual({ x: 3, y: 3, z: 3 })
    })
  })
})
