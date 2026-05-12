<script>
  import { currencies } from './exchangeRates.js';

  export let value;
  export let label;
</script>

<div class="currency-select">
  <label>{label}</label>
  <select bind:value>
    {#each currencies as currency}
      <option value={currency.code}>
        {currency.symbol} {currency.code} - {currency.name}
      </option>
    {/each}
  </select>
</div>

<style>
  .currency-select {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
  }

  select {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  select:focus {
    outline: none;
    border-color: #646cff;
  }

  @media (prefers-color-scheme: dark) {
    label {
      color: #aaa;
    }

    select {
      background: #1a1a1a;
      border-color: #333;
      color: white;
    }
  }
</style>
