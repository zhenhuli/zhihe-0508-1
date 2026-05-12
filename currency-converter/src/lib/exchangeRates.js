import { writable } from 'svelte/store';

export const currencies = [
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'GBP', name: '英镑', symbol: '£' },
  { code: 'JPY', name: '日元', symbol: '¥' },
  { code: 'KRW', name: '韩元', symbol: '₩' },
  { code: 'HKD', name: '港币', symbol: 'HK$' },
  { code: 'AUD', name: '澳元', symbol: 'A$' },
  { code: 'CAD', name: '加元', symbol: 'C$' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$' },
  { code: 'CHF', name: '瑞士法郎', symbol: 'Fr' },
  { code: 'THB', name: '泰铢', symbol: '฿' }
];

const baseRates = {
  CNY: 1,
  USD: 0.14,
  EUR: 0.13,
  GBP: 0.11,
  JPY: 21.0,
  KRW: 185.0,
  HKD: 1.09,
  AUD: 0.21,
  CAD: 0.19,
  SGD: 0.19,
  CHF: 0.12,
  THB: 4.9
};

function createExchangeRates() {
  const { subscribe, set, update } = writable({ ...baseRates });

  let intervalId = null;

  function startSimulation() {
    if (intervalId) return;
    
    intervalId = setInterval(() => {
      update(rates => {
        const newRates = { ...rates };
        Object.keys(newRates).forEach(currency => {
          const change = (Math.random() - 0.5) * 0.02 * newRates[currency];
          newRates[currency] = Math.max(0.0001, newRates[currency] + change);
        });
        return newRates;
      });
    }, 3000);
  }

  function stopSimulation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    set({ ...baseRates });
  }

  return {
    subscribe,
    startSimulation,
    stopSimulation,
    reset
  };
}

export const exchangeRates = createExchangeRates();

export function convert(amount, fromCurrency, toCurrency, rates) {
  if (!amount || !rates[fromCurrency] || !rates[toCurrency]) {
    return 0;
  }
  const amountInCNY = amount / rates[fromCurrency];
  return amountInCNY * rates[toCurrency];
}
