import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class OrbitController {
  constructor(camera, domElement) {
    this.controls = new OrbitControls(camera, domElement)
    this.init()
  }

  init() {
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.enableZoom = true
    this.controls.enablePan = true
    this.controls.minDistance = 2
    this.controls.maxDistance = 15
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = 2.0
    this.controls.enableKeys = true
    this.setupTouchHandling()
  }

  setupTouchHandling() {
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    }
  }

  update() {
    this.controls.update()
  }

  enable() {
    this.controls.enabled = true
  }

  disable() {
    this.controls.enabled = false
  }

  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate
    return this.controls.autoRotate
  }

  setAutoRotateSpeed(speed) {
    this.controls.autoRotateSpeed = speed
  }

  setMinDistance(distance) {
    this.controls.minDistance = distance
  }

  setMaxDistance(distance) {
    this.controls.maxDistance = distance
  }

  reset() {
    this.controls.reset()
  }

  goToPreset(preset) {
    const presets = {
      front: { x: 0, y: 0, z: 5 },
      back: { x: 0, y: 0, z: -5 },
      left: { x: -5, y: 0, z: 0 },
      right: { x: 5, y: 0, z: 0 },
      top: { x: 0, y: 5, z: 0 },
      bottom: { x: 0, y: -5, z: 0 },
      isometric: { x: 3, y: 3, z: 3 },
      perspective: { x: 4, y: 2, z: 4 }
    }

    const position = presets[preset]
    if (position) {
      this.controls.target.set(0, 0, 0)
      this.controls.object.position.set(position.x, position.y, position.z)
      this.controls.update()
    }
  }

  getPresets() {
    return [
      { id: 'front', name: '正面' },
      { id: 'back', name: '背面' },
      { id: 'left', name: '左侧' },
      { id: 'right', name: '右侧' },
      { id: 'top', name: '顶部' },
      { id: 'bottom', name: '底部' },
      { id: 'isometric', name: '等轴测' },
      { id: 'perspective', name: '透视' }
    ]
  }

  dispose() {
    this.controls.dispose()
  }
}
