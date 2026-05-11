export interface Font {
  id: string
  name: string
  fontFamily: string
  importUrl?: string
}

export const fonts: Font[] = [
  {
    id: 'default',
    name: '系统默认',
    fontFamily: 'Arial, Helvetica, sans-serif'
  },
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: 'Inter, sans-serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    fontFamily: 'Roboto, sans-serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
  },
  {
    id: 'noto-sans-cn',
    name: '思源黑体',
    fontFamily: '"Noto Sans SC", sans-serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
  },
  {
    id: 'noto-serif-cn',
    name: '思源宋体',
    fontFamily: '"Noto Serif SC", serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap'
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    fontFamily: '"Open Sans", sans-serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    fontFamily: 'Poppins, sans-serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    fontFamily: '"Playfair Display", serif',
    importUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap'
  },
  {
    id: 'lobster',
    name: 'Lobster',
    fontFamily: 'Lobster, cursive',
    importUrl: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap'
  },
  {
    id: 'permanent-marker',
    name: 'Permanent Marker',
    fontFamily: '"Permanent Marker", cursive',
    importUrl: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'
  }
]
