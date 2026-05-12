export const dataUnits = {
  byte: { name: '字节', symbol: 'B', toBase: 1 },
  kilobyte: { name: '千字节', symbol: 'KB', toBase: 1024 },
  megabyte: { name: '兆字节', symbol: 'MB', toBase: 1048576 },
  gigabyte: { name: '吉字节', symbol: 'GB', toBase: 1073741824 },
  terabyte: { name: '太字节', symbol: 'TB', toBase: 1099511627776 },
  petabyte: { name: '拍字节', symbol: 'PB', toBase: 1125899906842624 },
  exabyte: { name: '艾字节', symbol: 'EB', toBase: 1152921504606846976 },
  bit: { name: '比特', symbol: 'bit', toBase: 0.125 },
  kilobit: { name: '千比特', symbol: 'Kbit', toBase: 128 },
  megabit: { name: '兆比特', symbol: 'Mbit', toBase: 131072 },
  gigabit: { name: '吉比特', symbol: 'Gbit', toBase: 134217728 },
  terabit: { name: '太比特', symbol: 'Tbit', toBase: 137438953472 }
};

export const convertData = (value, fromUnit, toUnit) => {
  const baseValue = value * dataUnits[fromUnit].toBase;
  return baseValue / dataUnits[toUnit].toBase;
};
