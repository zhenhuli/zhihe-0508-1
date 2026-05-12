export const volumeUnits = {
  cubicMeter: { name: '立方米', symbol: 'm³', toBase: 1 },
  cubicKilometer: { name: '立方千米', symbol: 'km³', toBase: 1000000000 },
  cubicCentimeter: { name: '立方厘米', symbol: 'cm³', toBase: 0.000001 },
  cubicMillimeter: { name: '立方毫米', symbol: 'mm³', toBase: 0.000000001 },
  liter: { name: '升', symbol: 'L', toBase: 0.001 },
  milliliter: { name: '毫升', symbol: 'mL', toBase: 0.000001 },
  cubicFoot: { name: '立方英尺', symbol: 'ft³', toBase: 0.028316846592 },
  cubicInch: { name: '立方英寸', symbol: 'in³', toBase: 0.000016387064 },
  cubicYard: { name: '立方码', symbol: 'yd³', toBase: 0.764554857984 },
  gallonUS: { name: '美制加仑', symbol: 'gal (US)', toBase: 0.003785411784 },
  gallonUK: { name: '英制加仑', symbol: 'gal (UK)', toBase: 0.00454609 },
  quartUS: { name: '美制夸脱', symbol: 'qt (US)', toBase: 0.000946352946 },
  pintUS: { name: '美制品脱', symbol: 'pt (US)', toBase: 0.000473176473 },
  fluidOunceUS: { name: '美制液盎司', symbol: 'fl oz (US)', toBase: 0.0000295735295625 },
  cup: { name: '杯', symbol: 'cup', toBase: 0.00024 },
  tablespoon: { name: '汤匙', symbol: 'tbsp', toBase: 0.000015 },
  teaspoon: { name: '茶匙', symbol: 'tsp', toBase: 0.000005 }
};

export const convertVolume = (value, fromUnit, toUnit) => {
  const baseValue = value * volumeUnits[fromUnit].toBase;
  return baseValue / volumeUnits[toUnit].toBase;
};
