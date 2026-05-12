export const angleUnits = {
  degree: { name: '度', symbol: '°', toBase: 1 },
  radian: { name: '弧度', symbol: 'rad', toBase: 57.2957795131 },
  gradian: { name: '百分度', symbol: 'gon', toBase: 0.9 },
  minute: { name: '分', symbol: "'", toBase: 0.0166666666667 },
  second: { name: '秒', symbol: '"', toBase: 0.000277777777778 },
  turn: { name: '圈', symbol: 'turn', toBase: 360 },
  octant: { name: '八分圆', symbol: 'octant', toBase: 45 },
  sextant: { name: '六分圆', symbol: 'sextant', toBase: 60 },
  quadrant: { name: '象限', symbol: 'quadrant', toBase: 90 }
};

export const convertAngle = (value, fromUnit, toUnit) => {
  const baseValue = value * angleUnits[fromUnit].toBase;
  return baseValue / angleUnits[toUnit].toBase;
};
