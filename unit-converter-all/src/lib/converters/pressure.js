export const pressureUnits = {
  pascal: { name: '帕斯卡', symbol: 'Pa', toBase: 1 },
  kilopascal: { name: '千帕', symbol: 'kPa', toBase: 1000 },
  megapascal: { name: '兆帕', symbol: 'MPa', toBase: 1000000 },
  bar: { name: '巴', symbol: 'bar', toBase: 100000 },
  millibar: { name: '毫巴', symbol: 'mbar', toBase: 100 },
  atmosphere: { name: '标准大气压', symbol: 'atm', toBase: 101325 },
  torr: { name: '托', symbol: 'Torr', toBase: 133.322368421 },
  millimeterOfMercury: { name: '毫米汞柱', symbol: 'mmHg', toBase: 133.322387415 },
  poundPerSquareInch: { name: '磅/平方英寸', symbol: 'psi', toBase: 6894.757293178 },
  kilogramPerSquareCentimeter: { name: '千克/平方厘米', symbol: 'kg/cm²', toBase: 98066.5 }
};

export const convertPressure = (value, fromUnit, toUnit) => {
  const baseValue = value * pressureUnits[fromUnit].toBase;
  return baseValue / pressureUnits[toUnit].toBase;
};
