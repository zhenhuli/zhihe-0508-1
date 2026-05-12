export const weightUnits = {
  kilogram: { name: '千克', symbol: 'kg', toBase: 1 },
  gram: { name: '克', symbol: 'g', toBase: 0.001 },
  milligram: { name: '毫克', symbol: 'mg', toBase: 0.000001 },
  microgram: { name: '微克', symbol: 'μg', toBase: 0.000000001 },
  tonne: { name: '吨', symbol: 't', toBase: 1000 },
  pound: { name: '磅', symbol: 'lb', toBase: 0.45359237 },
  ounce: { name: '盎司', symbol: 'oz', toBase: 0.028349523125 },
  stone: { name: '英石', symbol: 'st', toBase: 6.35029318 },
  jin: { name: '斤', symbol: '斤', toBase: 0.5 },
  liang: { name: '两', symbol: '两', toBase: 0.05 },
  qian: { name: '钱', symbol: '钱', toBase: 0.005 }
};

export const convertWeight = (value, fromUnit, toUnit) => {
  const baseValue = value * weightUnits[fromUnit].toBase;
  return baseValue / weightUnits[toUnit].toBase;
};
