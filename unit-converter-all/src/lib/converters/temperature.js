export const temperatureUnits = {
  celsius: { name: '摄氏度', symbol: '°C' },
  fahrenheit: { name: '华氏度', symbol: '°F' },
  kelvin: { name: '开尔文', symbol: 'K' },
  rankine: { name: '兰氏度', symbol: '°R' },
  reaumur: { name: '列氏度', symbol: '°Ré' }
};

export const convertTemperature = (value, fromUnit, toUnit) => {
  let celsius;
  
  switch (fromUnit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    case 'rankine':
      celsius = (value - 491.67) * 5 / 9;
      break;
    case 'reaumur':
      celsius = value * 1.25;
      break;
    default:
      celsius = value;
  }

  switch (toUnit) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return celsius * 9 / 5 + 32;
    case 'kelvin':
      return celsius + 273.15;
    case 'rankine':
      return (celsius + 273.15) * 9 / 5;
    case 'reaumur':
      return celsius * 0.8;
    default:
      return celsius;
  }
};
