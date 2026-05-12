<script>
  import { exchangeRates, currencies } from './exchangeRates.js';

  export let fromCurrency;
  export let toCurrency;

  $: fromRate = $exchangeRates[fromCurrency];
  $: toRate = $exchangeRates[toCurrency];
  $: rate = fromRate && toRate ? (toRate / fromRate).toFixed(4) : 0;

  function getCurrencyName(code) {
    return currencies.find(c => c.code === code)?.name || code;
  }
</script>

<div class="rate-display">
  <div class="rate-info">
    <span class="label">当前汇率</span>
    <span class="rate">1 {fromCurrency} = {rate} {toCurrency}</span>
  </div>
  <div class="live-indicator">
    <span class="dot"></span>
    <span class="text">实时更新</span>
  </div>
</div>

<style>
  .rate-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
  }

  .rate-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .rate {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
