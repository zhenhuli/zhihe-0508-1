import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrbitController } from '@/modules/OrbitController'

global.THREE = {
  TOUCH: {
    ROTATE: 0,
    DOLLY_PAN: 2
  }
}

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    enableDamping: false,
    dampingFactor: 0,
    enableZoom: false,
    enablePan: false,
    minDistance: 0,
    maxDistance: 0,
    autoRotate: false,
    autoRotateSpeed: 0,
    enableKeys: false,
    touches: {},
    update: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
    target: { set: vi.fn() },
    object: { position: { set: vi.fn() } }
  }))
}))

describe('OrbitController', () => {
  let camera
  let domElement
  let orbitController

  beforeEach(() => {
    camera = { position: { x: 0, y: 0, z: 0 } }
    domElement = document.createElement('div')
  })

  afterEach(() => {
    if (orbitController) {
      orbitController.dispose()
    }
    vi.clearAllMocks()
  })

  it('should be instantiated with camera and domElement', () => {
    orbitController = new OrbitController(camera, domElement)
    expect(orbitController.controls).not.toBeNull()
  })

  it('should initialize controls with default settings', () => {
    orbitController = new OrbitController(camera, domElement)
    
    expect(orbitController.controls.enableDamping).toBe(true)
    expect(orbitController.controls.dampingFactor).toBe(0.05)
    expect(orbitController.controls.enableZoom).toBe(true)
    expect(orbitController.controls.enablePan).toBe(true)
    expect(orbitController.controls.minDistance).toBe(2)
    expect(orbitController.controls.maxDistance).toBe(15)
    expect(orbitController.controls.autoRotate).toBe(false)
    expect(orbitController.controls.autoRotateSpeed).toBe(2.0)
    expect(orbitController.controls.enableKeys).toBe(true)
  })

  it('should setup touch handling', () => {
    orbitController = new OrbitController(camera, domElement)
    
    expect(orbitController.controls.touches.ONE).toBeDefined()
    expect(orbitController.controls.touches.TWO).toBeDefined()
  })

  it('should update controls', () => {
    orbitController = new OrbitController(camera, domElement)
    orbitController.update()
    
    expect(orbitController.controls.update).toHaveBeenCalled()
  })

  it('should toggle auto rotate', () => {
    orbitController = new OrbitController(camera, domElement)
    
    expect(orbitController.controls.autoRotate).toBe(false)
    
    const result = orbitController.toggleAutoRotate()
    expect(result).toBe(true)
    expect(orbitController.controls.autoRotate).toBe(true)

    const result2 = orbitController.toggleAutoRotate()
    expect(result2).toBe(false)
    expect(orbitController.controls.autoRotate).toBe(false)
  })

  it('should set auto rotate speed', () => {
    orbitController = new OrbitController(camera, domElement)
    orbitController.setAutoRotateSpeed(5)
    
    expect(orbitController.controls.autoRotateSpeed).toBe(5)
  })

  it('should set min and max distance', () => {
    orbitController = new OrbitController(camera, domElement)
    
    orbitController.setMinDistance(1)
    expect(orbitController.controls.minDistance).toBe(1)
    
    orbitController.setMaxDistance(20)
    expect(orbitController.controls.maxDistance).toBe(20)
  })

  it('should reset controls', () => {
    orbitController = new OrbitController(camera, domElement)
    orbitController.reset()
    
    expect(orbitController.controls.reset).toHaveBeenCalled()
  })

  it('should go to preset view', () => {
    orbitController = new OrbitController(camera, domElement)
    orbitController.goToPreset('front')
    
    expect(orbitController.controls.target.set).toHaveBeenCalledWith(0, 0, 0)
    expect(orbitController.controls.object.position.set).toHaveBeenCalledWith(0, 0, 5)
    expect(orbitController.controls.update).toHaveBeenCalled()
  })

  it('should get preset views', () => {
    orbitController = new OrbitController(camera, domElement)
    const presets = orbitController.getPresets()
    
    expect(Array.isArray(presets)).toBe(true)
    expect(presets.length).toBe(8)
    
    presets.forEach(preset => {
      expect(preset).toHaveProperty('id')
      expect(preset).toHaveProperty('name')
    })
  })

  it('should dispose controls', () => {
    orbitController = new OrbitController(camera, domElement)
    orbitController.dispose()
    
    expect(orbitController.controls.dispose).toHaveBeenCalled()
  })
})
