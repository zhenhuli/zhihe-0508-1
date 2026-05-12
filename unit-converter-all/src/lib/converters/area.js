export const areaUnits = {
  squareMeter: { name: '平方米', symbol: 'm²', toBase: 1 },
  squareKilometer: { name: '平方千米', symbol: 'km²', toBase: 1000000 },
  squareCentimeter: { name: '平方厘米', symbol: 'cm²', toBase: 0.0001 },
  squareMillimeter: { name: '平方毫米', symbol: 'mm²', toBase: 0.000001 },
  hectare: { name: '公顷', symbol: 'ha', toBase: 10000 },
  are: { name: '公亩', symbol: 'a', toBase: 100 },
  acre: { name: '英亩', symbol: 'ac', toBase: 4046.8564224 },
  squareMile: { name: '平方英里', symbol: 'mi²', toBase: 2589988.110336 },
  squareYard: { name: '平方码', symbol: 'yd²', toBase: 0.83612736 },
  squareFoot: { name: '平方英尺', symbol: 'ft²', toBase: 0.09290304 },
  squareInch: { name: '平方英寸', symbol: 'in²', toBase: 0.00064516 },
  mu: { name: '亩', symbol: '亩', toBase: 666.6667 },
  squareZhang: { name: '平方丈', symbol: '平方丈', toBase: 11.1111 }
};

export const convertArea = (value, fromUnit, toUnit) => {
  const baseValue = value * areaUnits[fromUnit].toBase;
  return baseValue / areaUnits[toUnit].toBase;
};
