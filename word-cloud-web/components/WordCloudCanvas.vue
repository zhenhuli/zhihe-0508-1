<template>
  <div class="relative">
    <div 
      class="word-cloud-container rounded-xl overflow-hidden shadow-lg border border-gray-200"
      :style="{ backgroundColor: backgroundColor }"
    >
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
        class="max-w-full h-auto"
      ></canvas>
    </div>
    
    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>画布尺寸: {{ width }} × {{ height }}</span>
      <span v-if="loadedWords > 0">已渲染 {{ loadedWords }} 个词 (尝试 {{ renderAttempts }} 次)</span>
      <span v-else class="text-amber-500">请输入文本</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColorScheme } from '~/data/colorSchemes'
import type { Shape } from '~/data/shapes'
import type { Font } from '~/data/fonts'

const props = defineProps<{
  wordList: [string, number][]
  width: number
  height: number
  colorScheme: ColorScheme
  shape: Shape
  fontFamily: Font
  backgroundColor: string
  density: number
  minFontSize: number
  maxFontSize: number
  rotationRange: [number, number]
}>()

const emit = defineEmits<{
  (e: 'ready'): void
}>()

const { createShapeMask, getShapeOptimization, optimizeWordListForShape } = useShapeMask()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loadedWords = ref(0)
const renderAttempts = ref(0)

let wordCloudModule: any = null
let renderTimeout: ReturnType<typeof setTimeout> | null = null

function debounce(func: () => void, wait: number) {
  return function() {
    if (renderTimeout) {
      clearTimeout(renderTimeout)
    }
    renderTimeout = setTimeout(func, wait)
  }
}

const debouncedRender = debounce(() => {
  renderAttempts.value = 0
  renderWordCloudWithRetries()
}, 300)

watch(
  () => [
    props.wordList,
    props.width,
    props.height,
    props.colorScheme.id,
    props.shape.id,
    props.fontFamily.id,
    props.backgroundColor,
    props.density,
    props.minFontSize,
    props.maxFontSize,
    props.rotationRange
  ],
  () => {
    debouncedRender()
  },
  { deep: true }
)

onMounted(async () => {
  wordCloudModule = await import('wordcloud')
  loadGoogleFont()
  nextTick(() => {
    renderWordCloudWithRetries()
  })
})

onBeforeUnmount(() => {
  if (renderTimeout) {
    clearTimeout(renderTimeout)
  }
})

watch(
  () => props.fontFamily,
  (newFont) => {
    loadGoogleFont(newFont)
  },
  { immediate: false }
)

function loadGoogleFont(font?: Font) {
  const targetFont = font || props.fontFamily
  if (targetFont.importUrl) {
    const existingLink = document.querySelector(`link[data-font="${targetFont.id}"]`)
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = targetFont.importUrl
      link.setAttribute('data-font', targetFont.id)
      document.head.appendChild(link)
    }
  }
}

function getColorFunc(seed: number = 0) {
  const colors = props.colorScheme.colors
  return function(word: string, weight: number, fontSize: number, distance: number, theta: number) {
    const normalizedDistance = distance / Math.max(props.width, props.height) * 2
    
    let colorIndex = Math.floor(seed + normalizedDistance * colors.length + Math.random() * 0.5)
    colorIndex = ((colorIndex % colors.length) + colors.length) % colors.length
    
    return colors[Math.floor(colorIndex)]
  }
}

function calculateWeightFactor(
  weight: number,
  maxCount: number,
  min: number,
  max: number,
  shape: Shape
): number {
  const normalized = weight / 10
  const ratio = normalized / maxCount
  
  let adjustedRatio = ratio
  
  if (shape.type === 'star' || shape.type === 'cardioid') {
    adjustedRatio = Math.pow(ratio, 0.85)
  } else if (shape.type === 'triangle-forward' || shape.type === 'triangle') {
    adjustedRatio = Math.pow(ratio, 0.95)
  }
  
  return Math.round(min + (max - min) * adjustedRatio)
}

function renderWordCloudWithRetries() {
  const maxAttempts = 3
  renderWordCloud(1)
  
  setTimeout(() => {
    checkAndRetry(1, maxAttempts)
  }, 200)
}

function checkAndRetry(attempt: number, maxAttempts: number) {
  if (attempt >= maxAttempts) {
    return
  }
  
  if (!canvasRef.value) return
  
  const coverage = calculateCoverage(canvasRef.value)
  const shapeOptimization = getShapeOptimization(props.shape)
  const targetCoverage = 0.4 + props.density * 0.3
  
  if (coverage < targetCoverage * 0.5 && attempt < maxAttempts) {
    renderAttempts.value = attempt + 1
    renderWordCloud(attempt + 1)
    
    setTimeout(() => {
      checkAndRetry(attempt + 1, maxAttempts)
    }, 200)
  }
}

function calculateCoverage(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  let coloredPixels = 0
  let totalPixels = 0
  
  const bgR = parseInt(props.backgroundColor.slice(1, 3), 16)
  const bgG = parseInt(props.backgroundColor.slice(3, 5), 16)
  const bgB = parseInt(props.backgroundColor.slice(5, 7), 16)
  
  for (let i = 0; i < data.length; i += 16) {
    totalPixels++
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB)
    if (diff > 30) {
      coloredPixels++
    }
  }
  
  return totalPixels > 0 ? coloredPixels / totalPixels : 0
}

function renderWordCloud(attempt: number = 1) {
  if (!canvasRef.value || !wordCloudModule) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  if (!props.wordList || props.wordList.length === 0) {
    ctx.fillStyle = '#9ca3af'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('请输入文本内容', canvas.width / 2, canvas.height / 2)
    loadedWords.value = 0
    renderAttempts.value = 1
    return
  }
  
  const WordCloud = wordCloudModule.default || wordCloudModule
  const shapeOptimization = getShapeOptimization(props.shape)
  
  const maskCanvas = createShapeMask(
    props.shape,
    props.width,
    props.height,
    60
  )
  
  const optimizedWordList = optimizeWordListForShape(props.wordList, props.shape)
  
  const baseGridSize = Math.max(4, Math.round(20 * (1 - props.density)))
  const gridSizeMultiplier = shapeOptimization.gridSizeMultiplier || 1.0
  
  const attemptAdjustment = 1 - (attempt - 1) * 0.15
  const gridSize = Math.max(4, Math.round(baseGridSize * gridSizeMultiplier * attemptAdjustment))
  
  const maxCount = optimizedWordList[0][1] / 10
  
  const shrinkToFit = shapeOptimization.shrinkToFit !== false
  const rotateRatio = (shapeOptimization.rotateRatio || 0.25) * (1 - (attempt - 1) * 0.1)
  
  const optRotationRange = shapeOptimization.rotationRange || [-30, 30]
  const userRotationRange = props.rotationRange
  const finalRotationRange: [number, number] = [
    Math.max(optRotationRange[0], userRotationRange[0]),
    Math.min(optRotationRange[1], userRotationRange[1])
  ]
  
  let placedCount = 0
  
  try {
    WordCloud(canvas, {
      list: optimizedWordList,
      gridSize: gridSize,
      weightFactor: (size: number) => {
        return calculateWeightFactor(
          size,
          maxCount,
          props.minFontSize,
          props.maxFontSize,
          props.shape
        )
      },
      fontFamily: props.fontFamily.fontFamily,
      color: getColorFunc(attempt),
      rotateRatio: rotateRatio,
      rotationSteps: 4,
      minRotation: (finalRotationRange[0] * Math.PI) / 180,
      maxRotation: (finalRotationRange[1] * Math.PI) / 180,
      backgroundColor: props.backgroundColor,
      maskCanvas: maskCanvas,
      drawOutOfBound: false,
      shrinkToFit: shrinkToFit,
      origin: null,
      wait: 0,
      abortThreshold: 500
    })
    
    placedCount = optimizedWordList.length
    loadedWords.value = placedCount
    renderAttempts.value = attempt
    emit('ready')
  } catch (error) {
    console.error('WordCloud render error:', error)
  }
}

function exportCanvas(scale: number): HTMLCanvasElement {
  if (!canvasRef.value) return canvasRef.value!
  
  const sourceCanvas = canvasRef.value
  const resultCanvas = document.createElement('canvas')
  resultCanvas.width = sourceCanvas.width * scale
  resultCanvas.height = sourceCanvas.height * scale
  
  const ctx = resultCanvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = props.backgroundColor
    ctx.fillRect(0, 0, resultCanvas.width, resultCanvas.height)
    ctx.scale(scale, scale)
    ctx.drawImage(sourceCanvas, 0, 0)
  }
  
  return resultCanvas
}

function downloadImage(format: 'png' | 'jpeg', quality: number, scale: number) {
  const outputCanvas = exportCanvas(scale)
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
  const dataUrl = outputCanvas.toDataURL(mimeType, quality)
  
  const link = document.createElement('a')
  link.download = `word-cloud-${Date.now()}.${format}`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

defineExpose({
  downloadImage
})
</script>

<style scoped>
.word-cloud-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
