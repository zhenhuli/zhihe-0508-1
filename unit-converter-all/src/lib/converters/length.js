export const lengthUnits = {
  meter: { name: '米', symbol: 'm', toBase: 1 },
  kilometer: { name: '千米', symbol: 'km', toBase: 1000 },
  centimeter: { name: '厘米', symbol: 'cm', toBase: 0.01 },
  millimeter: { name: '毫米', symbol: 'mm', toBase: 0.001 },
  micrometer: { name: '微米', symbol: 'μm', toBase: 0.000001 },
  nanometer: { name: '纳米', symbol: 'nm', toBase: 0.000000001 },
  mile: { name: '英里', symbol: 'mi', toBase: 1609.344 },
  yard: { name: '码', symbol: 'yd', toBase: 0.9144 },
  foot: { name: '英尺', symbol: 'ft', toBase: 0.3048 },
  inch: { name: '英寸', symbol: 'in', toBase: 0.0254 },
  nauticalMile: { name: '海里', symbol: 'nmi', toBase: 1852 },
  li: { name: '里', symbol: '里', toBase: 500 },
  zhang: { name: '丈', symbol: '丈', toBase: 3.33333 },
  chi: { name: '尺', symbol: '尺', toBase: 0.33333 },
  cun: { name: '寸', symbol: '寸', toBase: 0.03333 }
};

export const convertLength = (value, fromUnit, toUnit) => {
  const baseValue = value * lengthUnits[fromUnit].toBase;
  return baseValue / lengthUnits[toUnit].toBase;
};
