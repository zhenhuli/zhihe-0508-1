export interface ColorScheme {
  id: string
  name: string
  colors: string[]
  darkMode?: boolean
}

export const colorSchemes: ColorScheme[] = [
  {
    id: 'default',
    name: '默认配色',
    colors: ['#333333', '#555555', '#777777', '#999999', '#222222']
  },
  {
    id: 'rainbow',
    name: '彩虹',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  },
  {
    id: 'ocean',
    name: '海洋',
    colors: ['#006994', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB', '#00BFFF', '#00CED1']
  },
  {
    id: 'forest',
    name: '森林',
    colors: ['#228B22', '#2E8B57', '#3CB371', '#90EE90', '#98FB98', '#006400', '#32CD32']
  },
  {
    id: 'sunset',
    name: '日落',
    colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFD700', '#FF8C00', '#FF69B4']
  },
  {
    id: 'violet',
    name: '紫罗兰',
    colors: ['#8B008B', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6', '#EE82EE', '#DDA0DD']
  },
  {
    id: 'warm',
    name: '温暖',
    colors: ['#B22222', '#DC143C', '#FF6347', '#FF8C00', '#FFA500', '#FFD700', '#FFFFE0']
  },
  {
    id: 'cool',
    name: '冷色',
    colors: ['#000080', '#0000CD', '#0000FF', '#4169E1', '#6495ED', '#87CEFA', '#B0E0E6']
  },
  {
    id: 'mono-blue',
    name: '蓝色单色系',
    colors: ['#001F3F', '#003366', '#004080', '#005599', '#0066CC', '#0080FF', '#3399FF']
  },
  {
    id: 'pastel',
    name: '柔和',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8BAFF', '#BAB0FF']
  }
]
