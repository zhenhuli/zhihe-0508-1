<script>
  export let decimalPlaces = 2;
</script>

<div class="decimal-settings">
  <label>小数位数</label>
  <div class="options">
    {#each [0, 1, 2, 3, 4] as places}
      <button
        class={decimalPlaces === places ? 'active' : ''}
        on:click={() => decimalPlaces = places}
      >
        {places}
      </button>
    {/each}
  </div>
</div>

<style>
  .decimal-settings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
  }

  .options {
    display: flex;
    gap: 0.5rem;
  }

  button {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:hover {
    border-color: #646cff;
  }

  button.active {
    background: #646cff;
    border-color: #646cff;
    color: white;
  }

  @media (prefers-color-scheme: dark) {
    label {
      color: #aaa;
    }

    button {
      background: #1a1a1a;
      border-color: #333;
      color: white;
    }
  }
</style>
