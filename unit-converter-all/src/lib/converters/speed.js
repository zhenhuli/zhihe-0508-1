export const speedUnits = {
  meterPerSecond: { name: '米/秒', symbol: 'm/s', toBase: 1 },
  kilometerPerHour: { name: '千米/时', symbol: 'km/h', toBase: 0.277777777778 },
  milePerHour: { name: '英里/时', symbol: 'mph', toBase: 0.44704 },
  knot: { name: '节', symbol: 'kn', toBase: 0.514444444444 },
  footPerSecond: { name: '英尺/秒', symbol: 'ft/s', toBase: 0.3048 },
  mach: { name: '马赫', symbol: 'Ma', toBase: 340.29 },
  speedOfLight: { name: '光速', symbol: 'c', toBase: 299792458 },
  kilometerPerSecond: { name: '千米/秒', symbol: 'km/s', toBase: 1000 }
};

export const convertSpeed = (value, fromUnit, toUnit) => {
  const baseValue = value * speedUnits[fromUnit].toBase;
  return baseValue / speedUnits[toUnit].toBase;
};
