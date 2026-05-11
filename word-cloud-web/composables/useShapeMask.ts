import type { Shape } from '~/data/shapes'

export interface ShapeOptimization {
  maskCanvas: HTMLCanvasElement
  shrinkToFit: boolean
  rotateRatio: number
  rotationRange: [number, number]
  gridSizeMultiplier: number
  maxWords: number
}

export function useShapeMask() {
  function createShapeMask(
    shape: Shape,
    width: number,
    height: number,
    padding: number = 60
  ): HTMLCanvasElement {
    const mask = document.createElement('canvas')
    mask.width = width
    mask.height = height
    
    const ctx = mask.getContext('2d')
    if (!ctx) return mask
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = '#000000'
    
    const centerX = width / 2
    const centerY = height / 2
    const radiusW = (width - padding * 2) / 2
    const radiusH = (height - padding * 2) / 2
    
    switch (shape.type) {
      case 'circle':
        drawCircle(ctx, centerX, centerY, Math.min(radiusW, radiusH))
        break
      case 'cardioid':
        drawCardioid(ctx, centerX, centerY, Math.min(radiusW, radiusH) * 0.95)
        break
      case 'diamond':
        drawDiamond(ctx, centerX, centerY, radiusW, radiusH)
        break
      case 'square':
        drawSquare(ctx, centerX, centerY, Math.min(radiusW, radiusH))
        break
      case 'triangle-forward':
        drawTriangle(ctx, centerX, centerY, radiusW * 2, radiusH * 2, false)
        break
      case 'triangle':
        drawTriangle(ctx, centerX, centerY, radiusW * 2, radiusH * 2, true)
        break
      case 'pentagon':
        drawPentagon(ctx, centerX, centerY, Math.min(radiusW, radiusH))
        break
      case 'star':
        drawStar(ctx, centerX, centerY, Math.min(radiusW, radiusH) * 0.95)
        break
      default:
        drawCircle(ctx, centerX, centerY, Math.min(radiusW, radiusH))
    }
    
    return mask
  }

  function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawCardioid(ctx: CanvasRenderingContext2D, cx: number, cy: number, a: number) {
    const points: [number, number][] = []
    const steps = 180
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2
      const r = a * (1 + Math.sin(t - Math.PI / 2))
      const x = cx + r * Math.cos(t)
      const y = cy + r * Math.sin(t)
      points.push([x, y])
    }
    
    drawPath(ctx, points)
  }

  function drawDiamond(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number
  ) {
    const points: [number, number][] = [
      [cx, cy - ry],
      [cx + rx, cy],
      [cx, cy + ry],
      [cx - rx, cy]
    ]
    drawPath(ctx, points)
  }

  function drawSquare(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    const side = r * Math.SQRT2
    const halfSide = side / 2
    
    const points: [number, number][] = [
      [cx - halfSide, cy - halfSide],
      [cx + halfSide, cy - halfSide],
      [cx + halfSide, cy + halfSide],
      [cx - halfSide, cy + halfSide]
    ]
    drawPath(ctx, points)
  }

  function drawTriangle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number,
    inverted: boolean
  ) {
    const halfWidth = width / 2
    const halfHeight = height / 2
    
    let points: [number, number][]
    if (inverted) {
      points = [
        [cx - halfWidth, cy - halfHeight],
        [cx + halfWidth, cy - halfHeight],
        [cx, cy + halfHeight]
      ]
    } else {
      points = [
        [cx, cy - halfHeight],
        [cx + halfWidth, cy + halfHeight],
        [cx - halfWidth, cy + halfHeight]
      ]
    }
    drawPath(ctx, points)
  }

  function drawPentagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    const points: [number, number][] = []
    const sides = 5
    const angleOffset = -Math.PI / 2
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides + angleOffset
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push([x, y])
    }
    
    drawPath(ctx, points)
  }

  function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number) {
    const innerR = outerR * 0.4
    const points: [number, number][] = []
    const spikes = 5
    const angleOffset = -Math.PI / 2
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR
      const angle = (i * Math.PI) / spikes + angleOffset
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      points.push([x, y])
    }
    
    drawPath(ctx, points)
  }

  function drawPath(ctx: CanvasRenderingContext2D, points: [number, number][]) {
    if (points.length < 3) return
    
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }
    
    ctx.closePath()
    ctx.fill()
  }

  function getShapeOptimization(shape: Shape): Partial<ShapeOptimization> {
    const optimizations: Record<string, Partial<ShapeOptimization>> = {
      circle: {
        shrinkToFit: true,
        rotateRatio: 0.25,
        rotationRange: [-30, 30],
        gridSizeMultiplier: 1.0,
        maxWords: 200
      },
      cardioid: {
        shrinkToFit: true,
        rotateRatio: 0.15,
        rotationRange: [-20, 20],
        gridSizeMultiplier: 0.9,
        maxWords: 150
      },
      diamond: {
        shrinkToFit: true,
        rotateRatio: 0.2,
        rotationRange: [-45, 45],
        gridSizeMultiplier: 0.85,
        maxWords: 180
      },
      square: {
        shrinkToFit: true,
        rotateRatio: 0.3,
        rotationRange: [-45, 45],
        gridSizeMultiplier: 1.1,
        maxWords: 250
      },
      'triangle-forward': {
        shrinkToFit: true,
        rotateRatio: 0.15,
        rotationRange: [-15, 15],
        gridSizeMultiplier: 0.85,
        maxWords: 120
      },
      triangle: {
        shrinkToFit: true,
        rotateRatio: 0.15,
        rotationRange: [-15, 15],
        gridSizeMultiplier: 0.85,
        maxWords: 120
      },
      pentagon: {
        shrinkToFit: true,
        rotateRatio: 0.2,
        rotationRange: [-30, 30],
        gridSizeMultiplier: 0.95,
        maxWords: 160
      },
      star: {
        shrinkToFit: true,
        rotateRatio: 0.1,
        rotationRange: [-10, 10],
        gridSizeMultiplier: 0.75,
        maxWords: 100
      }
    }
    
    return optimizations[shape.type] || optimizations.circle
  }

  function optimizeWordListForShape(
    wordList: [string, number][],
    shape: Shape
  ): [string, number][] {
    const optimization = getShapeOptimization(shape)
    const maxWords = optimization.maxWords || 200
    
    let optimized = [...wordList]
    
    if (optimized.length > maxWords) {
      optimized = optimized.slice(0, maxWords)
    }
    
    if (shape.type === 'star' || shape.type === 'cardioid') {
      const topWords = optimized.slice(0, Math.ceil(optimized.length * 0.3))
      const restWords = optimized.slice(Math.ceil(optimized.length * 0.3))
      
      restWords.sort((a, b) => {
        const aLen = a[0].length
        const bLen = b[0].length
        return aLen - bLen
      })
      
      optimized = [...topWords, ...restWords]
    }
    
    return optimized
  }

  return {
    createShapeMask,
    getShapeOptimization,
    optimizeWordListForShape
  }
}
