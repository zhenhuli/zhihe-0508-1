export const energyUnits = {
  joule: { name: '焦耳', symbol: 'J', toBase: 1 },
  kilojoule: { name: '千焦', symbol: 'kJ', toBase: 1000 },
  megajoule: { name: '兆焦', symbol: 'MJ', toBase: 1000000 },
  calorie: { name: '卡路里', symbol: 'cal', toBase: 4.184 },
  kilocalorie: { name: '千卡', symbol: 'kcal', toBase: 4184 },
  wattHour: { name: '瓦时', symbol: 'Wh', toBase: 3600 },
  kilowattHour: { name: '千瓦时', symbol: 'kWh', toBase: 3600000 },
  megawattHour: { name: '兆瓦时', symbol: 'MWh', toBase: 3600000000 },
  electronvolt: { name: '电子伏特', symbol: 'eV', toBase: 1.602176634e-19 },
  britishThermalUnit: { name: '英热单位', symbol: 'BTU', toBase: 1055.05585262 },
  footPound: { name: '英尺磅', symbol: 'ft-lb', toBase: 1.35581794833 }
};

export const convertEnergy = (value, fromUnit, toUnit) => {
  const baseValue = value * energyUnits[fromUnit].toBase;
  return baseValue / energyUnits[toUnit].toBase;
};
