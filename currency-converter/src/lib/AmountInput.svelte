<script>
  export let value;
  export let label;
  export let placeholder = '请输入金额';
  export let disabled = false;
</script>

<div class="amount-input">
  <label>{label}</label>
  <input
    type="number"
    bind:value
    {placeholder}
    {disabled}
    min="0"
    step="0.01"
  />
</div>

<style>
  .amount-input {
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

  input {
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #646cff;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    label {
      color: #aaa;
    }

    input {
      background: #1a1a1a;
      border-color: #333;
      color: white;
    }

    input:disabled {
      background: #2a2a2a;
    }
  }
</style>
