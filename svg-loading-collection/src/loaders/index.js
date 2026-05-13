export const loaders = {
  circular: [
    {
      id: 'spinner-circle',
      name: '圆形旋转',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="spinner-circle" cx="50" cy="50" r="40" stroke="#667eea" stroke-width="6" fill="none" stroke-linecap="round"/>
      </svg>`,
      cssClass: 'spinner-circle'
    },
    {
      id: 'dashed-ring',
      name: '虚线环形',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="dashed-ring" cx="50" cy="50" r="40" stroke="#764ba2" stroke-width="6" fill="none" stroke-dasharray="10 5" stroke-linecap="round"/>
      </svg>`,
      cssClass: 'dashed-ring'
    },
    {
      id: 'dual-ring',
      name: '双环旋转',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="dual-ring" cx="50" cy="50" r="35" stroke="#667eea" stroke-width="5" fill="none"/>
        <circle class="dual-ring" cx="50" cy="50" r="45" stroke="#764ba2" stroke-width="5" fill="none" stroke-dasharray="15 10"/>
      </svg>`,
      cssClass: 'dual-ring'
    },
    {
      id: 'three-ring',
      name: '三环交错',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="three-ring" cx="50" cy="50" r="30" stroke="#667eea" stroke-width="4" fill="none"/>
        <circle class="three-ring" cx="50" cy="50" r="38" stroke="#764ba2" stroke-width="4" fill="none" style="animation-direction: reverse; animation-duration: 1.5s"/>
        <circle class="three-ring" cx="50" cy="50" r="46" stroke="#9f7aea" stroke-width="4" fill="none" style="animation-duration: 2s"/>
      </svg>`,
      cssClass: 'three-ring'
    },
    {
      id: 'pulse-ring',
      name: '脉冲环',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="pulse-ring" cx="50" cy="50" r="40" stroke="#667eea" stroke-width="5" fill="none"/>
      </svg>`,
      cssClass: 'pulse-ring'
    },
    {
      id: 'growing-ring',
      name: '扩散环',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="growing-ring">
        <circle cx="50" cy="50" r="5" stroke="#667eea" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="5" stroke="#764ba2" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="5" stroke="#9f7aea" stroke-width="3" fill="none"/>
      </svg>`,
      cssClass: 'growing-ring'
    }
  ],
  dots: [
    {
      id: 'dots-bounce',
      name: '弹跳点',
      svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="dots-bounce">
        <circle class="dot" cx="25" cy="25" r="10" fill="#667eea"/>
        <circle class="dot" cx="50" cy="25" r="10" fill="#764ba2"/>
        <circle class="dot" cx="75" cy="25" r="10" fill="#9f7aea"/>
      </svg>`,
      cssClass: 'dots-bounce'
    },
    {
      id: 'dots-pulse',
      name: '脉冲点',
      svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="dots-pulse">
        <circle class="dot" cx="15" cy="25" r="8" fill="#667eea"/>
        <circle class="dot" cx="35" cy="25" r="8" fill="#764ba2"/>
        <circle class="dot" cx="55" cy="25" r="8" fill="#667eea"/>
        <circle class="dot" cx="75" cy="25" r="8" fill="#764ba2"/>
        <circle class="dot" cx="95" cy="25" r="8" fill="#9f7aea"/>
      </svg>`,
      cssClass: 'dots-pulse'
    },
    {
      id: 'dots-rotate',
      name: '旋转点',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="dots-rotate">
        <circle cx="50" cy="15" r="8" fill="#667eea"/>
        <circle cx="75" cy="30" r="8" fill="#764ba2"/>
        <circle cx="85" cy="55" r="8" fill="#9f7aea"/>
        <circle cx="75" cy="80" r="8" fill="#667eea"/>
        <circle cx="50" cy="90" r="8" fill="#764ba2"/>
        <circle cx="25" cy="80" r="8" fill="#9f7aea"/>
        <circle cx="15" cy="55" r="8" fill="#667eea"/>
        <circle cx="25" cy="30" r="8" fill="#764ba2"/>
      </svg>`,
      cssClass: 'dots-rotate'
    },
    {
      id: 'dots-wave',
      name: '波浪点',
      svg: `<svg width="100" height="60" viewBox="0 0 100 60" class="dots-wave">
        <circle class="dot" cx="15" cy="30" r="8" fill="#667eea"/>
        <circle class="dot" cx="35" cy="30" r="8" fill="#764ba2"/>
        <circle class="dot" cx="55" cy="30" r="8" fill="#9f7aea"/>
        <circle class="dot" cx="75" cy="30" r="8" fill="#667eea"/>
        <circle class="dot" cx="95" cy="30" r="8" fill="#764ba2"/>
      </svg>`,
      cssClass: 'dots-wave'
    },
    {
      id: 'orbit-dots',
      name: '轨道点',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="orbit-dots">
        <circle cx="50" cy="50" r="35" stroke="#e0e0e0" stroke-width="2" fill="none"/>
        <g class="orbit">
          <circle cx="85" cy="50" r="8" fill="#667eea"/>
          <circle cx="15" cy="50" r="8" fill="#764ba2"/>
        </g>
        <circle cx="50" cy="50" r="10" fill="#9f7aea"/>
      </svg>`,
      cssClass: 'orbit-dots'
    }
  ],
  path: [
    {
      id: 'path-dash',
      name: '描边动画',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="path-dash">
        <path class="path" d="M50,10 L90,50 L50,90 L10,50 Z" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      cssClass: 'path-dash'
    },
    {
      id: 'infinity-path',
      name: '无限符号',
      svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="infinity-path">
        <path class="path" d="M25,25 C25,10 45,10 50,25 C55,40 75,40 75,25 C75,10 55,10 50,25 C45,40 25,40 25,25" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>`,
      cssClass: 'infinity-path'
    },
    {
      id: 'heartbeat',
      name: '心跳线',
      svg: `<svg width="120" height="50" viewBox="0 0 120 50" class="heartbeat">
        <path class="path" d="M10,25 L30,25 L40,10 L50,40 L60,25 L80,25 L90,10 L100,40 L110,25" stroke="#e74c3c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      cssClass: 'heartbeat'
    },
    {
      id: 'spiral-path',
      name: '螺旋路径',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="spiral-path">
        <path class="path" d="M50,50 m0,-40 a40,40 0 1,1 0,80 a40,40 0 1,1 0,-80" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>`,
      cssClass: 'spiral-path'
    }
  ],
  morph: [
    {
      id: 'morph-shape',
      name: '形状变换',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="morph-shape">
        <path d="M50,10 L90,90 L10,90 Z" fill="#667eea"/>
      </svg>`,
      cssClass: 'morph-shape'
    },
    {
      id: 'water-drop',
      name: '水滴变形',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="water-drop">
        <path d="M50,10 C70,30 80,50 80,65 C80,85 65,95 50,95 C35,95 20,85 20,65 C20,50 30,30 50,10 Z" fill="#3498db"/>
      </svg>`,
      cssClass: 'water-drop'
    },
    {
      id: 'star-pulse',
      name: '星形脉冲',
      svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="star-pulse">
        <path d="M50,10 L58,38 L88,38 L64,56 L72,86 L50,68 L28,86 L36,56 L12,38 L42,38 Z" fill="#f1c40f"/>
      </svg>`,
      cssClass: 'star-pulse'
    }
  ]
};

export const categories = [
  { id: 'circular', name: '环形加载' },
  { id: 'dots', name: '点阵加载' },
  { id: 'path', name: '轨迹加载' },
  { id: 'morph', name: '形变加载' }
];
