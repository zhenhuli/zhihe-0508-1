<script>
  import { onMount, onDestroy } from 'svelte';
  import { exchangeRates, convert, currencies } from './exchangeRates.js';
  import CurrencySelect from './CurrencySelect.svelte';
  import AmountInput from './AmountInput.svelte';
  import DecimalSettings from './DecimalSettings.svelte';
  import RateDisplay from './RateDisplay.svelte';

  let fromAmount = 100;
  let toAmount = 0;
  let fromCurrency = 'CNY';
  let toCurrency = 'USD';
  let decimalPlaces = 2;
  let lastChanged = 'from';

  $: if (lastChanged === 'from') {
    toAmount = convert(fromAmount, fromCurrency, toCurrency, $exchangeRates);
  } else {
    fromAmount = convert(toAmount, toCurrency, fromCurrency, $exchangeRates);
  }

  function handleFromInput() {
    lastChanged = 'from';
  }

  function handleToInput() {
    lastChanged = 'to';
  }

  function swapCurrencies() {
    const temp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = temp;
  }

  function getCurrencySymbol(code) {
    return currencies.find(c => c.code === code)?.symbol || '';
  }

  onMount(() => {
    exchangeRates.startSimulation();
  });

  onDestroy(() => {
    exchangeRates.stopSimulation();
  });
</script>

<div class="converter">
  <h1>💱 外币兑换计算器</h1>

  <RateDisplay {fromCurrency} {toCurrency} />

  <div class="conversion-section">
    <div class="currency-row">
      <AmountInput
        bind:value={fromAmount}
        label="源货币金额"
        placeholder="请输入金额"
        on:input={handleFromInput}
      />
      <CurrencySelect bind:value={fromCurrency} label="源货币" />
    </div>

    <button class="swap-btn" on:click={swapCurrencies} title="交换货币">
      ⇅
    </button>

    <div class="currency-row">
      <AmountInput
        bind:value={toAmount}
        label="目标货币金额"
        placeholder="兑换结果"
        disabled={false}
        on:input={handleToInput}
      />
      <CurrencySelect bind:value={toCurrency} label="目标货币" />
    </div>
  </div>

  <div class="result-display">
    <span class="result-text">
      {getCurrencySymbol(fromCurrency)} {fromAmount.toFixed(decimalPlaces)} {fromCurrency}
      =
      {getCurrencySymbol(toCurrency)} {toAmount.toFixed(decimalPlaces)} {toCurrency}
    </span>
  </div>

  <DecimalSettings bind:decimalPlaces />
</div>

<style>
  .converter {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .conversion-section {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .currency-row {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
  }

  .currency-row > :first-child {
    flex: 1.5;
  }

  .currency-row > :last-child {
    flex: 1;
  }

  .swap-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 10;
  }

  .swap-btn:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  .result-display {
    padding: 1.25rem;
    background: #f0f9ff;
    border-radius: 12px;
    border: 2px solid #bae6fd;
  }

  .result-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0369a1;
    word-break: break-all;
  }

  @media (prefers-color-scheme: dark) {
    .result-display {
      background: #1e3a5f;
      border-color: #3b82f6;
    }

    .result-text {
      color: #93c5fd;
    }
  }

  @media (max-width: 480px) {
    .currency-row {
      flex-direction: column;
    }

    .swap-btn {
      top: calc(50% - 1rem);
    }

    .currency-row > :first-child,
    .currency-row > :last-child {
      flex: 1;
      width: 100%;
    }
  }
</style>
