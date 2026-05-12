import { lengthUnits, convertLength } from './length.js';
import { weightUnits, convertWeight } from './weight.js';
import { temperatureUnits, convertTemperature } from './temperature.js';
import { areaUnits, convertArea } from './area.js';
import { volumeUnits, convertVolume } from './volume.js';
import { timeUnits, convertTime } from './time.js';
import { speedUnits, convertSpeed } from './speed.js';
import { dataUnits, convertData } from './data.js';
import { energyUnits, convertEnergy } from './energy.js';
import { pressureUnits, convertPressure } from './pressure.js';
import { angleUnits, convertAngle } from './angle.js';

export const categories = {
  length: { name: '长度', icon: '📏', units: lengthUnits, convert: convertLength },
  weight: { name: '重量', icon: '⚖️', units: weightUnits, convert: convertWeight },
  temperature: { name: '温度', icon: '🌡️', units: temperatureUnits, convert: convertTemperature },
  area: { name: '面积', icon: '📐', units: areaUnits, convert: convertArea },
  volume: { name: '体积', icon: '🧊', units: volumeUnits, convert: convertVolume },
  time: { name: '时间', icon: '⏱️', units: timeUnits, convert: convertTime },
  speed: { name: '速度', icon: '🚀', units: speedUnits, convert: convertSpeed },
  data: { name: '数据', icon: '💾', units: dataUnits, convert: convertData },
  energy: { name: '能量', icon: '⚡', units: energyUnits, convert: convertEnergy },
  pressure: { name: '压力', icon: '🌡️', units: pressureUnits, convert: convertPressure },
  angle: { name: '角度', icon: '🔄', units: angleUnits, convert: convertAngle }
};

export const getUnits = (category) => {
  return categories[category]?.units || {};
};

export const convert = (value, category, fromUnit, toUnit) => {
  const categoryData = categories[category];
  if (!categoryData) return 0;
  return categoryData.convert(value, fromUnit, toUnit);
};
