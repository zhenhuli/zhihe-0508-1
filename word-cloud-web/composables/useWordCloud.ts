import { colorSchemes, type ColorScheme } from '~/data/colorSchemes'
import { shapes, type Shape } from '~/data/shapes'
import { fonts, type Font } from '~/data/fonts'

export interface WordCloudConfig {
  text: string
  colorScheme: ColorScheme
  shape: Shape
  fontFamily: Font
  density: number
  backgroundColor: string
  minFontSize: number
  maxFontSize: number
  rotationRange: [number, number]
  width: number
  height: number
}

const defaultText = `
人工智能 机器学习 深度学习 神经网络 数据科学
大模型 ChatGPT 自然语言处理 计算机视觉 语音识别
云计算 大数据 物联网 区块链 量子计算
前端开发 后端开发 全栈开发 DevOps 微服务
React Vue Angular Node.js Python Java
TypeScript JavaScript CSS HTML5 API
创新 未来 技术 数字化 转型
团队协作 敏捷开发 持续集成 持续部署
数据可视化 用户体验 交互设计 产品思维
`

export function useWordCloud() {
  const config = ref<WordCloudConfig>({
    text: defaultText.trim(),
    colorScheme: colorSchemes[1],
    shape: shapes[0],
    fontFamily: fonts[3],
    density: 0.5,
    backgroundColor: '#ffffff',
    minFontSize: 12,
    maxFontSize: 120,
    rotationRange: [-45, 45],
    width: 800,
    height: 600
  })

  const text = computed(() => config.value.text)
  const colorScheme = computed(() => config.value.colorScheme)
  const shape = computed(() => config.value.shape)
  const fontFamily = computed(() => config.value.fontFamily)
  const density = computed(() => config.value.density)
  const backgroundColor = computed(() => config.value.backgroundColor)

  const wordList = computed(() => {
    const rawText = config.value.text
    const words = rawText
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0)
    
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      const key = word.toLowerCase()
      wordCount[key] = (wordCount[key] || 0) + 1
    })
    
    return Object.entries(wordCount)
      .map(([word, count]) => [word, count * 10] as [string, number])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 200)
  })

  function updateText(newText: string) {
    config.value.text = newText
  }

  function appendText(newText: string) {
    config.value.text += '\n' + newText
  }

  function clearText() {
    config.value.text = ''
  }

  function setColorScheme(scheme: ColorScheme) {
    config.value.colorScheme = scheme
  }

  function setShape(shape: Shape) {
    config.value.shape = shape
  }

  function setFontFamily(font: Font) {
    config.value.fontFamily = font
  }

  function setDensity(value: number) {
    config.value.density = value
  }

  function setBackgroundColor(color: string) {
    config.value.backgroundColor = color
  }

  function setFontSizeRange(min: number, max: number) {
    config.value.minFontSize = min
    config.value.maxFontSize = max
  }

  function setRotationRange(min: number, max: number) {
    config.value.rotationRange = [min, max]
  }

  function setSize(width: number, height: number) {
    config.value.width = width
    config.value.height = height
  }

  return {
    config,
    text,
    colorScheme,
    shape,
    fontFamily,
    density,
    backgroundColor,
    wordList,
    updateText,
    appendText,
    clearText,
    setColorScheme,
    setShape,
    setFontFamily,
    setDensity,
    setBackgroundColor,
    setFontSizeRange,
    setRotationRange,
    setSize
  }
}
