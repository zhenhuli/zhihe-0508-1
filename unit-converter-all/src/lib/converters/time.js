export const timeUnits = {
  second: { name: '秒', symbol: 's', toBase: 1 },
  millisecond: { name: '毫秒', symbol: 'ms', toBase: 0.001 },
  microsecond: { name: '微秒', symbol: 'μs', toBase: 0.000001 },
  nanosecond: { name: '纳秒', symbol: 'ns', toBase: 0.000000001 },
  minute: { name: '分钟', symbol: 'min', toBase: 60 },
  hour: { name: '小时', symbol: 'h', toBase: 3600 },
  day: { name: '天', symbol: 'd', toBase: 86400 },
  week: { name: '周', symbol: 'wk', toBase: 604800 },
  month: { name: '月(30天)', symbol: 'mo', toBase: 2592000 },
  year: { name: '年(365天)', symbol: 'yr', toBase: 31536000 },
  decade: { name: '十年', symbol: 'dec', toBase: 315360000 },
  century: { name: '世纪', symbol: 'c', toBase: 3153600000 }
};

export const convertTime = (value, fromUnit, toUnit) => {
  const baseValue = value * timeUnits[fromUnit].toBase;
  return baseValue / timeUnits[toUnit].toBase;
};
