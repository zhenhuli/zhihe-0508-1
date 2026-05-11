export const materialOptions = [
  { id: 'meshStandard', name: '标准材质', color: '#6366f1' },
  { id: 'meshPhong', name: 'Phong材质', color: '#8b5cf6' },
  { id: 'meshBasic', name: '基础材质', color: '#06b6d4' },
  { id: 'meshNormal', name: '法线材质', color: '#ffffff' },
  { id: 'meshPhysical', name: '物理材质', color: '#ec4899' },
  { id: 'wireframe', name: '线框材质', color: '#22d3ee' }
]

export const cubeColors = [
  { id: 'indigo', name: '靛蓝', hex: '#6366f1' },
  { id: 'purple', name: '紫色', hex: '#8b5cf6' },
  { id: 'cyan', name: '青色', hex: '#06b6d4' },
  { id: 'pink', name: '粉色', hex: '#ec4899' },
  { id: 'amber', name: '琥珀', hex: '#f59e0b' },
  { id: 'emerald', name: '翡翠', hex: '#10b981' },
  { id: 'red', name: '红色', hex: '#ef4444' },
  { id: 'white', name: '白色', hex: '#ffffff' }
]

export const presetViews = [
  { id: 'front', name: '正面' },
  { id: 'back', name: '背面' },
  { id: 'left', name: '左侧' },
  { id: 'right', name: '右侧' },
  { id: 'top', name: '顶部' },
  { id: 'bottom', name: '底部' },
  { id: 'isometric', name: '等轴测' },
  { id: 'perspective', name: '透视' }
]

export const defaultSettings = {
  rotationSpeed: 1,
  lightIntensity: 1,
  currentMaterial: 'meshStandard',
  currentColor: '#6366f1',
  isRotating: true
}

export const config = {
  minRotationSpeed: 0,
  maxRotationSpeed: 5,
  minLightIntensity: 0.1,
  maxLightIntensity: 2,
  defaultCameraPosition: { x: 3, y: 3, z: 3 }
}
