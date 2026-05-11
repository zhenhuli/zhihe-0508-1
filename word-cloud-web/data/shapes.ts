export interface Shape {
  id: string
  name: string
  type: 'circle' | 'cardioid' | 'diamond' | 'square' | 'triangle-forward' | 'triangle' | 'pentagon' | 'star'
  description: string
}

export const shapes: Shape[] = [
  {
    id: 'circle',
    name: '圆形',
    type: 'circle',
    description: '经典的圆形词云'
  },
  {
    id: 'cardioid',
    name: '心形',
    type: 'cardioid',
    description: '浪漫的心形词云'
  },
  {
    id: 'diamond',
    name: '菱形',
    type: 'diamond',
    description: '优雅的菱形词云'
  },
  {
    id: 'square',
    name: '方形',
    type: 'square',
    description: '规整的方形词云'
  },
  {
    id: 'triangle-forward',
    name: '正三角',
    type: 'triangle-forward',
    description: '正三角形词云'
  },
  {
    id: 'triangle',
    name: '倒三角',
    type: 'triangle',
    description: '倒三角形词云'
  },
  {
    id: 'pentagon',
    name: '五边形',
    type: 'pentagon',
    description: '五边形词云'
  },
  {
    id: 'star',
    name: '星形',
    type: 'star',
    description: '闪亮的星形词云'
  }
]
