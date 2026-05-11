import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const continentData = [
  {
    id: 'asia',
    name: '亚洲',
    icon: '🌏',
    color: '#ef4444',
    population: 4700000000,
    area: 44579000,
    density: 105,
    countries: 48,
    percentage: 59.5,
    lat: 35,
    lng: 100,
    majorCities: [
      { name: '东京', lat: 35.6762, lng: 139.6503, population: 37400000 },
      { name: '上海', lat: 31.2304, lng: 121.4737, population: 24100000 },
      { name: '北京', lat: 39.9042, lng: 116.4074, population: 21500000 },
      { name: '孟买', lat: 19.0760, lng: 72.8777, population: 20200000 },
      { name: '德里', lat: 28.7041, lng: 77.1025, population: 32100000 }
    ],
    countryList: ['中国', '印度', '日本', '韩国', '印度尼西亚', '巴基斯坦', '孟加拉国', '越南', '菲律宾', '泰国']
  },
  {
    id: 'africa',
    name: '非洲',
    icon: '🌍',
    color: '#f59e0b',
    population: 1400000000,
    area: 30370000,
    density: 46,
    countries: 54,
    percentage: 17.7,
    lat: 5,
    lng: 20,
    majorCities: [
      { name: '开罗', lat: 30.0444, lng: 31.2357, population: 21300000 },
      { name: '拉各斯', lat: 6.5244, lng: 3.3792, population: 15400000 },
      { name: '金沙萨', lat: -4.4419, lng: 15.2663, population: 14300000 },
      { name: '约翰内斯堡', lat: -26.2041, lng: 28.0473, population: 10100000 },
      { name: '内罗毕', lat: -1.2921, lng: 36.8219, population: 4400000 }
    ],
    countryList: ['尼日利亚', '埃塞俄比亚', '埃及', '南非', '坦桑尼亚', '肯尼亚', '阿尔及利亚', '摩洛哥', '加纳', '科特迪瓦']
  },
  {
    id: 'europe',
    name: '欧洲',
    icon: '🌍',
    color: '#3b82f6',
    population: 740000000,
    area: 10180000,
    density: 73,
    countries: 44,
    percentage: 9.4,
    lat: 50,
    lng: 10,
    majorCities: [
      { name: '莫斯科', lat: 55.7558, lng: 37.6173, population: 12500000 },
      { name: '伦敦', lat: 51.5074, lng: -0.1278, population: 9000000 },
      { name: '巴黎', lat: 48.8566, lng: 2.3522, population: 11000000 },
      { name: '伊斯坦布尔', lat: 41.0082, lng: 28.9784, population: 15500000 },
      { name: '柏林', lat: 52.5200, lng: 13.4050, population: 3700000 }
    ],
    countryList: ['俄罗斯', '德国', '英国', '法国', '意大利', '西班牙', '乌克兰', '波兰', '罗马尼亚', '荷兰']
  },
  {
    id: 'north-america',
    name: '北美洲',
    icon: '🌎',
    color: '#8b5cf6',
    population: 590000000,
    area: 24709000,
    density: 24,
    countries: 23,
    percentage: 7.5,
    lat: 40,
    lng: -100,
    majorCities: [
      { name: '纽约', lat: 40.7128, lng: -74.0060, population: 8800000 },
      { name: '洛杉矶', lat: 34.0522, lng: -118.2437, population: 4000000 },
      { name: '墨西哥城', lat: 19.4326, lng: -99.1332, population: 22100000 },
      { name: '芝加哥', lat: 41.8781, lng: -87.6298, population: 2700000 },
      { name: '多伦多', lat: 43.6532, lng: -79.3832, population: 6300000 }
    ],
    countryList: ['美国', '墨西哥', '加拿大', '危地马拉', '古巴', '多米尼加', '海地', '洪都拉斯', '萨尔瓦多', '哥斯达黎加']
  },
  {
    id: 'south-america',
    name: '南美洲',
    icon: '🌎',
    color: '#10b981',
    population: 430000000,
    area: 17840000,
    density: 24,
    countries: 12,
    percentage: 5.5,
    lat: -15,
    lng: -60,
    majorCities: [
      { name: '圣保罗', lat: -23.5505, lng: -46.6333, population: 12300000 },
      { name: '里约热内卢', lat: -22.9068, lng: -43.1729, population: 6700000 },
      { name: '布宜诺斯艾利斯', lat: -34.6037, lng: -58.3816, population: 15500000 },
      { name: '利马', lat: -12.0464, lng: -77.0428, population: 10700000 },
      { name: '波哥大', lat: 4.7110, lng: -74.0721, population: 8200000 }
    ],
    countryList: ['巴西', '哥伦比亚', '阿根廷', '秘鲁', '委内瑞拉', '智利', '厄瓜多尔', '玻利维亚', '巴拉圭', '乌拉圭']
  },
  {
    id: 'oceania',
    name: '大洋洲',
    icon: '🌏',
    color: '#06b6d4',
    population: 45000000,
    area: 8525989,
    density: 5,
    countries: 14,
    percentage: 0.5,
    lat: -25,
    lng: 135,
    majorCities: [
      { name: '悉尼', lat: -33.8688, lng: 151.2093, population: 5300000 },
      { name: '墨尔本', lat: -37.8136, lng: 144.9631, population: 5000000 },
      { name: '奥克兰', lat: -36.8485, lng: 174.7633, population: 1600000 },
      { name: '布里斯班', lat: -27.4698, lng: 153.0251, population: 2500000 },
      { name: '珀斯', lat: -31.9505, lng: 115.8605, population: 2100000 }
    ],
    countryList: ['澳大利亚', '巴布亚新几内亚', '新西兰', '斐济', '所罗门群岛', '瓦努阿图', '萨摩亚', '汤加', '密克罗尼西亚', '基里巴斯']
  }
]

class EarthScene {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.earth = null
    this.clouds = null
    this.stars = null
    this.controls = null
    this.raycaster = null
    this.mouse = null
    this.isDragging = false
    this.autoRotate = true
    this.rotationSpeed = 0.001
    this.markers = []
    this.activeContinent = null
    this.markerGroup = null
    this.panelExpanded = false
    this.currentHoveredMarker = null
    this.floatingLabel = null
    
    this.init()
  }

  init() {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createLights()
    this.createStars()
    this.createEarth()
    this.createControls()
    this.createRaycaster()
    this.createPopulationMarkers()
    this.renderContinentList()
    this.addEventListeners()
    this.setupPanelToggle()
    this.animate()
  }

  createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)
  }

  createCamera() {
    const container = document.getElementById('canvas-container')
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 5)
  }

  createRenderer() {
    const container = document.getElementById('canvas-container')
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(this.renderer.domElement)
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x333333)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    this.scene.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight(0x4444ff, 0.3)
    directionalLight2.position.set(-5, -3, -5)
    this.scene.add(directionalLight2)
  }

  createStars() {
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 5000
    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 100 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)

      const brightness = 0.5 + Math.random() * 0.5
      colors[i] = brightness
      colors[i + 1] = brightness
      colors[i + 2] = brightness + Math.random() * 0.2
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })

    this.stars = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(this.stars)
  }

  createEarth() {
    const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64)
    
    const textureLoader = new THREE.TextureLoader()
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
      bumpMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      bumpScale: 0.05,
      specularMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
      specular: new THREE.Color(0x333333),
      shininess: 5
    })

    this.earth = new THREE.Mesh(earthGeometry, earthMaterial)
    this.scene.add(this.earth)

    const cloudsGeometry = new THREE.SphereGeometry(1.52, 64, 64)
    
    const createProceduralClouds = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 512
      const ctx = canvas.getContext('2d')
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0)'
      ctx.fillRect(0, 0, 1024, 512)
      
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024
        const y = Math.random() * 512
        const radius = 20 + Math.random() * 80
        const opacity = 0.1 + Math.random() * 0.3
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      return texture
    }
    
    const tryLoadTexture = (url) => {
      return new Promise((resolve) => {
        textureLoader.load(
          url,
          (texture) => resolve(texture),
          undefined,
          () => resolve(null)
        )
      })
    }
    
    const loadClouds = async () => {
      let cloudsTexture = null
      
      const urls = [
        'https://cdn.jsdelivr.net/npm/three-globe@2.24.13/example/img/earth-clouds.png',
        'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-clouds.png',
        'https://unpkg.com/three-globe@2.24.13/example/img/earth-clouds.png'
      ]
      
      for (const url of urls) {
        const texture = await tryLoadTexture(url)
        if (texture) {
          cloudsTexture = texture
          console.log('Cloud texture loaded from:', url)
          break
        }
      }
      
      if (!cloudsTexture) {
        console.log('Using procedural clouds texture')
        cloudsTexture = createProceduralClouds()
      }
      
      const cloudsMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
      })
      
      if (this.clouds) {
        this.clouds.material = cloudsMaterial
      }
    }
    
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: createProceduralClouds(),
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    })
    
    this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
    this.scene.add(this.clouds)
    
    loadClouds()

    const atmosphereGeometry = new THREE.SphereGeometry(1.6, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    })

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    this.scene.add(atmosphere)
  }

  createPopulationMarkers() {
    this.markerGroup = new THREE.Group()
    this.scene.add(this.markerGroup)

    const maxPopulation = Math.max(...continentData.map(c => c.population))

    continentData.forEach(continent => {
      const mainMarker = this.createMarker(
        continent.lat,
        continent.lng,
        continent.color,
        continent.population / maxPopulation * 0.15 + 0.05,
        continent
      )
      this.markerGroup.add(mainMarker)
      this.markers.push({ mesh: mainMarker, data: continent, type: 'continent' })

      continent.majorCities.forEach(city => {
        const cityMarker = this.createMarker(
          city.lat,
          city.lng,
          continent.color,
          city.population / maxPopulation * 0.08 + 0.02,
          { ...city, continent: continent, isCity: true }
        )
        this.markerGroup.add(cityMarker)
        this.markers.push({ mesh: cityMarker, data: { ...city, continent: continent, isCity: true }, type: 'city' })
      })
    })
  }

  createMarker(lat, lng, color, size, data) {
    const geometry = new THREE.SphereGeometry(size, 16, 16)
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    })
    const sphere = new THREE.Mesh(geometry, material)

    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    const radius = 1.55

    sphere.position.x = -radius * Math.sin(phi) * Math.cos(theta)
    sphere.position.y = radius * Math.cos(phi)
    sphere.position.z = radius * Math.sin(phi) * Math.sin(theta)

    sphere.userData = { markerData: data, originalColor: color }

    const glowGeometry = new THREE.SphereGeometry(size * 1.8, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    sphere.add(glow)

    return sphere
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2.5
    this.controls.maxDistance = 10
    this.controls.enablePan = false
    this.controls.autoRotate = false
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  }

  setupPanelToggle() {
    const toggleBtn = document.getElementById('panel-toggle')
    const panel = document.getElementById('population-panel')
    const toggleIcon = document.getElementById('toggle-icon')
    
    toggleBtn.addEventListener('click', () => {
      this.panelExpanded = !this.panelExpanded
      
      if (this.panelExpanded) {
        panel.classList.remove('collapsed')
        panel.classList.add('expanded')
        toggleBtn.classList.remove('collapsed')
        toggleBtn.classList.add('expanded')
        toggleIcon.textContent = '◀'
      } else {
        panel.classList.add('collapsed')
        panel.classList.remove('expanded')
        toggleBtn.classList.add('collapsed')
        toggleBtn.classList.remove('expanded')
        toggleIcon.textContent = '▶'
      }
    })
  }

  addEventListeners() {
    const container = document.getElementById('canvas-container')

    container.addEventListener('mousemove', (event) => this.onMouseMove(event))
    container.addEventListener('mousedown', () => {
      this.isDragging = true
      this.autoRotate = false
    })
    container.addEventListener('mouseup', (event) => {
      this.isDragging = false
      this.onMouseClick(event)
      setTimeout(() => {
        this.autoRotate = true
      }, 1000)
    })
    container.addEventListener('mouseleave', () => {
      this.isDragging = false
      this.hideFloatingLabel()
      setTimeout(() => {
        this.autoRotate = true
      }, 1000)
    })

    window.addEventListener('resize', () => this.onWindowResize())

    document.getElementById('close-detail').addEventListener('click', () => {
      this.hideDetailPopup()
    })
  }

  onMouseMove(event) {
    const container = document.getElementById('canvas-container')
    const rect = container.getBoundingClientRect()

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    let intersects = this.raycaster.intersectObjects(this.markers.map(m => m.mesh))
    
    if (intersects.length > 0) {
      const markerInfo = this.markers.find(m => m.mesh === intersects[0].object)
      if (markerInfo) {
        this.highlightMarker(intersects[0].object)
        this.showFloatingLabel(markerInfo, intersects[0].object)
        document.body.style.cursor = 'pointer'
      }
    } else {
      this.hideFloatingLabel()
      this.resetMarkerHighlight()
      const earthIntersects = this.raycaster.intersectObject(this.earth)
      if (earthIntersects.length > 0) {
        const point = earthIntersects[0].point
        const latLng = this.getLatLng(point)
        this.updateLatLngDisplay(latLng)
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.cursor = 'grab'
      }
    }
  }

  showFloatingLabel(markerInfo, mesh) {
    const labelsContainer = document.getElementById('floating-labels')
    
    if (!this.floatingLabel) {
      this.floatingLabel = document.createElement('div')
      this.floatingLabel.className = 'floating-label'
      labelsContainer.appendChild(this.floatingLabel)
    }
    
    if (this.currentHoveredMarker === mesh) return
    
    this.currentHoveredMarker = mesh
    
    const data = markerInfo.data
    let html = ''
    
    if (markerInfo.type === 'continent') {
      html = `
        <span class="continent-name" style="color: ${data.color};">${data.icon} ${data.name}</span>
        <span class="population">人口: ${this.formatPopulation(data.population)}</span>
      `
    } else {
      html = `
        <span class="continent-name" style="color: ${data.continent.color};">🏙️ ${data.name}</span>
        <span class="population">人口: ${this.formatPopulation(data.population)}</span>
      `
    }
    
    this.floatingLabel.innerHTML = html
    
    this.updateFloatingLabelPosition(mesh)
  }

  hideFloatingLabel() {
    if (this.floatingLabel && this.floatingLabel.parentNode) {
      this.floatingLabel.parentNode.removeChild(this.floatingLabel)
    }
    this.floatingLabel = null
    this.currentHoveredMarker = null
  }

  updateFloatingLabelPosition(mesh) {
    if (!this.floatingLabel) return
    
    const vector = new THREE.Vector3()
    vector.copy(mesh.position)
    
    const offsetVector = mesh.position.clone().normalize().multiplyScalar(0.3)
    vector.add(offsetVector)
    
    vector.project(this.camera)
    
    const container = document.getElementById('canvas-container')
    const x = (vector.x * 0.5 + 0.5) * container.clientWidth
    const y = (-vector.y * 0.5 + 0.5) * container.clientHeight
    
    const direction = vector.z
    if (direction > 1) {
      this.floatingLabel.style.display = 'none'
    } else {
      this.floatingLabel.style.display = 'block'
      this.floatingLabel.style.left = x + 'px'
      this.floatingLabel.style.top = (y - 50) + 'px'
    }
  }

  onMouseClick(event) {
    const container = document.getElementById('canvas-container')
    const rect = container.getBoundingClientRect()

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    let intersects = this.raycaster.intersectObjects(this.markers.map(m => m.mesh))
    
    if (intersects.length > 0) {
      const markerInfo = this.markers.find(m => m.mesh === intersects[0].object)
      if (markerInfo) {
        if (markerInfo.type === 'continent') {
          this.showContinentDetail(markerInfo.data)
          this.focusOnContinent(markerInfo.data)
        } else {
          this.showCityDetail(markerInfo.data)
        }
      }
    }
  }

  highlightMarker(mesh) {
    this.resetMarkerHighlight()
    if (mesh.userData.originalColor) {
      mesh.material.color.setHex(0xffffff)
      mesh.material.opacity = 1
      mesh.scale.set(1.5, 1.5, 1.5)
    }
  }

  resetMarkerHighlight() {
    this.markers.forEach(marker => {
      marker.mesh.material.color.set(marker.mesh.userData.originalColor)
      marker.mesh.material.opacity = 0.8
      marker.mesh.scale.set(1, 1, 1)
    })
  }

  getLatLng(point) {
    const normal = point.clone().normalize()
    
    const lat = 90 - Math.acos(normal.y) * (180 / Math.PI)
    let lng = Math.atan2(normal.z, normal.x) * (180 / Math.PI)
    
    if (lng < 0) {
      lng += 360
    }
    
    return { lat, lng }
  }

  updateLatLngDisplay(latLng) {
    const display = document.getElementById('coord-display')
    const latDir = latLng.lat >= 0 ? 'N' : 'S'
    const lngDir = latLng.lng >= 180 ? 'W' : 'E'
    const lngDisplay = latLng.lng > 180 ? 360 - latLng.lng : latLng.lng
    
    display.innerHTML = `经度: ${lngDisplay.toFixed(2)}°${lngDir} | 纬度: ${Math.abs(latLng.lat).toFixed(2)}°${latDir}`
  }

  formatPopulation(population) {
    if (population >= 1000000000) {
      return (population / 1000000000).toFixed(1) + ' 亿'
    } else if (population >= 10000000) {
      return (population / 10000000).toFixed(1) + ' 千万'
    } else if (population >= 10000) {
      return (population / 10000).toFixed(1) + ' 万'
    }
    return population.toLocaleString()
  }

  renderContinentList() {
    const listContainer = document.getElementById('continent-list')
    const sortedContinents = [...continentData].sort((a, b) => b.population - a.population)
    const maxPopulation = sortedContinents[0].population
    
    const totalPopulation = continentData.reduce((sum, c) => sum + c.population, 0)
    document.getElementById('total-population').textContent = this.formatPopulation(totalPopulation) + ' 人'

    listContainer.innerHTML = sortedContinents.map((continent, index) => {
      const percentage = (continent.population / maxPopulation * 100).toFixed(0)
      return `
        <div class="continent-item" data-continent="${continent.id}">
          <div class="continent-header">
            <span class="continent-name">
              <span style="margin-right: 8px;">${continent.icon}</span>
              ${index + 1}. ${continent.name}
            </span>
            <span class="continent-population">${this.formatPopulation(continent.population)}</span>
          </div>
          <div class="continent-bar-container">
            <div class="continent-bar" style="width: ${percentage}%; background-color: ${continent.color};"></div>
          </div>
          <div class="continent-info">
            <span>占全球 ${continent.percentage}%</span>
            <span>${continent.countries} 个国家</span>
          </div>
        </div>
      `
    }).join('')

    listContainer.querySelectorAll('.continent-item').forEach(item => {
      item.addEventListener('click', () => {
        const continentId = item.dataset.continent
        const continent = continentData.find(c => c.id === continentId)
        if (continent) {
          this.showContinentDetail(continent)
          this.focusOnContinent(continent)
        }
      })
    })
  }

  showContinentDetail(continent) {
    const popup = document.getElementById('continent-detail')
    const content = document.getElementById('detail-content')

    content.innerHTML = `
      <div class="detail-header">
        <span class="detail-icon">${continent.icon}</span>
        <span class="detail-name">${continent.name}</span>
      </div>
      <div class="detail-stats">
        <div class="stat-item">
          <div class="stat-label">总人口</div>
          <div class="stat-value population">${this.formatPopulation(continent.population)} 人</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">全球占比</div>
          <div class="stat-value percentage">${continent.percentage}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">人口密度</div>
          <div class="stat-value density">${continent.density} 人/km²</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">国家数量</div>
          <div class="stat-value countries">${continent.countries} 个</div>
        </div>
      </div>
      <div class="detail-countries">
        <h4>🏙️ 主要城市（人口）</h4>
        <div class="country-list">
          ${continent.majorCities.map(city => `
            <span class="country-tag">${city.name} (${this.formatPopulation(city.population)})</span>
          `).join('')}
        </div>
      </div>
      <div class="detail-countries" style="margin-top: 16px;">
        <h4>🌐 主要国家</h4>
        <div class="country-list">
          ${continent.countryList.map(country => `
            <span class="country-tag">${country}</span>
          `).join('')}
        </div>
      </div>
    `

    popup.classList.remove('hidden')

    this.activeContinent = continent
    this.updateActiveContinentUI()
  }

  showCityDetail(cityData) {
    const popup = document.getElementById('continent-detail')
    const content = document.getElementById('detail-content')

    content.innerHTML = `
      <div class="detail-header">
        <span class="detail-icon">🏙️</span>
        <span class="detail-name">${cityData.name}</span>
      </div>
      <div class="detail-stats">
        <div class="stat-item">
          <div class="stat-label">城市人口</div>
          <div class="stat-value population">${this.formatPopulation(cityData.population)} 人</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">所属大洲</div>
          <div class="stat-value countries">${cityData.continent.name}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">纬度</div>
          <div class="stat-value density">${cityData.lat.toFixed(2)}°</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">经度</div>
          <div class="stat-value percentage">${cityData.lng.toFixed(2)}°</div>
        </div>
      </div>
    `

    popup.classList.remove('hidden')
  }

  hideDetailPopup() {
    const popup = document.getElementById('continent-detail')
    popup.classList.add('hidden')
    this.activeContinent = null
    this.updateActiveContinentUI()
  }

  focusOnContinent(continent) {
    this.autoRotate = false
    
    const targetPhi = (90 - continent.lat) * (Math.PI / 180)
    const targetTheta = (continent.lng + 180) * (Math.PI / 180)
    
    const startPhi = this.earth.rotation.y
    const targetRotation = -targetTheta + Math.PI
    
    const animateRotation = () => {
      const diff = targetRotation - this.earth.rotation.y
      if (Math.abs(diff) > 0.01) {
        this.earth.rotation.y += diff * 0.05
        this.markerGroup.rotation.y = this.earth.rotation.y
        requestAnimationFrame(animateRotation)
      }
    }
    
    animateRotation()
    
    setTimeout(() => {
      this.autoRotate = true
    }, 2000)
  }

  updateActiveContinentUI() {
    document.querySelectorAll('.continent-item').forEach(item => {
      item.classList.remove('active')
      if (this.activeContinent && item.dataset.continent === this.activeContinent.id) {
        item.classList.add('active')
      }
    })
  }

  onWindowResize() {
    const container = document.getElementById('canvas-container')
    this.camera.aspect = container.clientWidth / container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(container.clientWidth, container.clientHeight)
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    if (this.autoRotate && !this.isDragging) {
      if (this.earth) {
        this.earth.rotation.y += this.rotationSpeed
      }
      if (this.clouds) {
        this.clouds.rotation.y += this.rotationSpeed * 1.1
      }
      if (this.markerGroup) {
        this.markerGroup.rotation.y = this.earth.rotation.y
      }
    }

    if (this.stars) {
      this.stars.rotation.y += this.rotationSpeed * 0.1
    }

    if (this.currentHoveredMarker && this.floatingLabel) {
      this.updateFloatingLabelPosition(this.currentHoveredMarker)
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

new EarthScene()
