import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as THREE from 'three'
import { CubeScene } from '@/modules/CubeScene'

vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    add: vi.fn(),
    background: null
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
    aspect: 1,
    updateProjectionMatrix: vi.fn()
  })),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    shadowMap: { enabled: false, type: {} },
    domElement: document.createElement('canvas'),
    render: vi.fn(),
    dispose: vi.fn()
  })),
  MeshStandardMaterial: vi.fn(() => ({ dispose: vi.fn(), color: { set: vi.fn() } })),
  MeshPhongMaterial: vi.fn(() => ({ dispose: vi.fn(), color: { set: vi.fn() } })),
  MeshBasicMaterial: vi.fn(() => ({ dispose: vi.fn(), color: { set: vi.fn() } })),
  MeshNormalMaterial: vi.fn(() => ({ dispose: vi.fn() })),
  MeshPhysicalMaterial: vi.fn(() => ({ dispose: vi.fn(), color: { set: vi.fn() } })),
  BoxGeometry: vi.fn(() => ({ dispose: vi.fn() })),
  Mesh: vi.fn(() => ({
    geometry: { dispose: vi.fn() },
    material: { dispose: vi.fn(), color: { set: vi.fn() } },
    castShadow: false,
    receiveShadow: false,
    rotation: { x: 0, y: 0, z: 0 }
  })),
  AmbientLight: vi.fn(() => ({ intensity: 0.4 })),
  DirectionalLight: vi.fn(() => ({
    intensity: 1,
    castShadow: false,
    position: { set: vi.fn() },
    shadow: { mapSize: { width: 2048, height: 2048 } }
  })),
  PointLight: vi.fn(() => ({ intensity: 0.5, position: { set: vi.fn() } })),
  GridHelper: vi.fn(() => ({ position: { x: 0, y: 0, z: 0 } })),
  Color: vi.fn(() => ({})),
  PCFSoftShadowMap: {}
}))

describe('CubeScene', () => {
  let container
  let cubeScene

  beforeEach(() => {
    container = {
      clientWidth: 800,
      clientHeight: 600,
      appendChild: vi.fn(),
      removeChild: vi.fn()
    }
  })

  afterEach(() => {
    if (cubeScene) {
      cubeScene.dispose()
    }
    vi.clearAllMocks()
  })

  it('should be instantiated with a container', () => {
    cubeScene = new CubeScene(container)
    expect(cubeScene.container).toBe(container)
    expect(cubeScene.scene).toBeNull()
    expect(cubeScene.camera).toBeNull()
    expect(cubeScene.renderer).toBeNull()
    expect(cubeScene.cube).toBeNull()
  })

  it('should initialize the scene, camera, and renderer', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    expect(THREE.Scene).toHaveBeenCalled()
    expect(THREE.PerspectiveCamera).toHaveBeenCalledWith(75, 800 / 600, 0.1, 1000)
    expect(THREE.WebGLRenderer).toHaveBeenCalled()
  })

  it('should create lights', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    expect(THREE.AmbientLight).toHaveBeenCalled()
    expect(THREE.DirectionalLight).toHaveBeenCalled()
    expect(THREE.PointLight).toHaveBeenCalledTimes(2)
    expect(cubeScene.lights.length).toBe(4)
  })

  it('should create materials', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    expect(THREE.MeshStandardMaterial).toHaveBeenCalled()
    expect(THREE.MeshPhongMaterial).toHaveBeenCalled()
    expect(THREE.MeshBasicMaterial).toHaveBeenCalledTimes(2)
    expect(THREE.MeshNormalMaterial).toHaveBeenCalled()
    expect(THREE.MeshPhysicalMaterial).toHaveBeenCalled()
    expect(Object.keys(cubeScene.materials).length).toBe(6)
  })

  it('should create a cube', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    expect(THREE.BoxGeometry).toHaveBeenCalledWith(2, 2, 2)
    expect(THREE.Mesh).toHaveBeenCalled()
    expect(cubeScene.cube).not.toBeNull()
  })

  it('should toggle rotation', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    expect(cubeScene.isRotating).toBe(true)
    
    const result = cubeScene.toggleRotation()
    expect(result).toBe(false)
    expect(cubeScene.isRotating).toBe(false)

    const result2 = cubeScene.toggleRotation()
    expect(result2).toBe(true)
    expect(cubeScene.isRotating).toBe(true)
  })

  it('should set rotation speed', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    cubeScene.setRotationSpeed(2)
    expect(cubeScene.rotationSpeed.x).toBe(0.01)
    expect(cubeScene.rotationSpeed.y).toBe(0.02)
  })

  it('should set material', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    cubeScene.setMaterial('wireframe')
    expect(cubeScene.currentMaterial).toBe('wireframe')
  })

  it('should set light intensity', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    cubeScene.setLightIntensity(0.5)
    cubeScene.lights.forEach(light => {
      if (light.intensity !== undefined) {
        expect(light.intensity).toBe(0.5)
      }
    })
  })

  it('should dispose resources', () => {
    cubeScene = new CubeScene(container)
    cubeScene.init()

    cubeScene.dispose()

    expect(cubeScene.renderer.dispose).toHaveBeenCalled()
  })
})
