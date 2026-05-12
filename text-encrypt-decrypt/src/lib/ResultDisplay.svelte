<script>
  export let result = '';
  export let mode = 'encrypt';
  export let algorithm = 'AES';

  const hashAlgorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];
  $: isHashAlgorithm = hashAlgorithms.includes(algorithm);

  let copied = false;

  async function copyToClipboard() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (e) {
      console.error('复制失败:', e);
    }
  }
</script>

<div class="result-section">
  <div class="result-header">
    <h3>
      {#if isHashAlgorithm}
        {algorithm} 哈希结果
      {:else}
        {algorithm} {mode === 'encrypt' ? '加密' : '解密'}结果
      {/if}
    </h3>
    {#if result}
      <button class="copy-btn" on:click={copyToClipboard}>
        {copied ? '✓ 已复制' : '复制结果'}
      </button>
    {/if}
  </div>

  <div class="result-content">
    {#if result}
      <textarea readonly rows="5" value={result}></textarea>
    {:else}
      <div class="placeholder">
        处理后的结果将显示在这里
      </div>
    {/if}
  </div>
</div>

<style>
  .result-section {
    background: #e8f5e9;
    padding: 24px;
    border-radius: 12px;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .result-header h3 {
    margin: 0;
    color: #2e7d32;
    font-size: 18px;
    font-weight: 600;
  }

  .copy-btn {
    padding: 8px 16px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover {
    background: #43a047;
  }

  .result-content {
    min-height: 120px;
  }

  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #a5d6a7;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Monaco', 'Consolas', monospace;
    background: white;
    resize: vertical;
    min-height: 120px;
    box-sizing: border-box;
  }

  textarea:focus {
    outline: none;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    background: rgba(255, 255, 255, 0.5);
    border: 2px dashed #a5d6a7;
    border-radius: 8px;
    color: #66bb6a;
    font-size: 14px;
  }
</style>
