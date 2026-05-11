import * as THREE from 'three'

export class CubeScene {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.cube = null
    this.lights = []
    this.animationId = null
    this.isRotating = true
    this.rotationSpeed = { x: 0.005, y: 0.01 }
    this.currentMaterial = 'meshStandard'
    this.materials = {}
  }

  init() {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createLights()
    this.createMaterials()
    this.createCube()
    this.addGridHelper()
    this.startAnimation()
    this.setupResizeListener()
  }

  createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0f172a)
  }

  createCamera() {
    const { clientWidth, clientHeight } = this.container
    this.camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000)
    this.camera.position.set(3, 3, 3)
    this.camera.lookAt(0, 0, 0)
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)
    this.lights.push(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)
    this.lights.push(directionalLight)

    const pointLight1 = new THREE.PointLight(0x6366f1, 0.5)
    pointLight1.position.set(-3, 2, 3)
    this.scene.add(pointLight1)
    this.lights.push(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5)
    pointLight2.position.set(3, -2, -3)
    this.scene.add(pointLight2)
    this.lights.push(pointLight2)
  }

  createMaterials() {
    this.materials = {
      meshStandard: new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.3,
        metalness: 0.8,
        envMapIntensity: 1.0
      }),
      meshPhong: new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        shininess: 100,
        specular: 0x444444
      }),
      meshBasic: new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: false
      }),
      meshNormal: new THREE.MeshNormalMaterial(),
      meshPhysical: new THREE.MeshPhysicalMaterial({
        color: 0xec4899,
        roughness: 0.2,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      }),
      wireframe: new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true
      })
    }
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    this.cube = new THREE.Mesh(geometry, this.materials[this.currentMaterial])
    this.cube.castShadow = true
    this.cube.receiveShadow = true
    this.scene.add(this.cube)
  }

  addGridHelper() {
    const gridHelper = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b)
    gridHelper.position.y = -2
    this.scene.add(gridHelper)
  }

  startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      if (this.isRotating && this.cube) {
        this.cube.rotation.x += this.rotationSpeed.x
        this.cube.rotation.y += this.rotationSpeed.y
      }
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  setupResizeListener() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  handleResize() {
    const { clientWidth, clientHeight } = this.container
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(clientWidth, clientHeight)
  }

  setRotationSpeed(speed) {
    this.rotationSpeed = {
      x: speed * 0.005,
      y: speed * 0.01
    }
  }

  toggleRotation() {
    this.isRotating = !this.isRotating
    return this.isRotating
  }

  setMaterial(materialName) {
    if (this.materials[materialName] && this.cube) {
      this.currentMaterial = materialName
      this.cube.material = this.materials[materialName]
    }
  }

  setLightIntensity(intensity) {
    this.lights.forEach(light => {
      if (light.intensity !== undefined) {
        light.intensity = intensity
      }
    })
  }

  setCubeColor(color) {
    if (this.cube && this.cube.material.color) {
      this.cube.material.color.set(color)
    }
  }

  setCameraPosition(position) {
    if (this.camera) {
      this.camera.position.set(position.x, position.y, position.z)
      this.camera.lookAt(0, 0, 0)
    }
  }

  getCameraPosition() {
    return this.camera ? this.camera.position : { x: 0, y: 0, z: 0 }
  }

  dispose() {
    this.stopAnimation()
    window.removeEventListener('resize', this.handleResize.bind(this))
    if (this.cube) {
      this.cube.geometry.dispose()
      Object.values(this.materials).forEach(material => material.dispose())
    }
    if (this.renderer) {
      this.renderer.dispose()
      this.container.removeChild(this.renderer.domElement)
    }
  }
}
