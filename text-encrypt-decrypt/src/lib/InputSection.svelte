<script>
  export let inputText = '';
  export let secretKey = '';
  export let mode = 'encrypt';
  export let algorithm = 'AES';

  const algorithmList = [
    { value: 'AES', label: 'AES', category: '对称加密' },
    { value: 'DES', label: 'DES', category: '对称加密' },
    { value: 'TripleDES', label: '3DES', category: '对称加密' },
    { value: 'Rabbit', label: 'Rabbit', category: '对称加密' },
    { value: 'RC4', label: 'RC4', category: '对称加密' },
    { value: 'Base64', label: 'Base64', category: '编码' },
    { value: 'MD5', label: 'MD5', category: '哈希算法' },
    { value: 'SHA1', label: 'SHA-1', category: '哈希算法' },
    { value: 'SHA256', label: 'SHA-256', category: '哈希算法' },
    { value: 'SHA512', label: 'SHA-512', category: '哈希算法' }
  ];

  const hashAlgorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];
  const noKeyAlgorithms = ['Base64', 'MD5', 'SHA1', 'SHA256', 'SHA512'];

  $: isHashAlgorithm = hashAlgorithms.includes(algorithm);
  $: needsKey = !noKeyAlgorithms.includes(algorithm);
</script>

<div class="input-section">
  <div class="input-group">
    <label for="inputText">输入文本</label>
    <textarea
      id="inputText"
      bind:value={inputText}
      placeholder="请输入要加密或解密的文本..."
      rows="5"
    ></textarea>
  </div>

  <div class="input-group">
    <label for="algorithm">加密算法</label>
    <select id="algorithm" bind:value={algorithm}>
      {#each algorithmList as alg}
        <option value={alg.value}>{alg.label} ({alg.category})</option>
      {/each}
    </select>
  </div>

  {#if needsKey}
    <div class="input-group">
      <label for="secretKey">密钥</label>
      <input
        type="text"
        id="secretKey"
        bind:value={secretKey}
        placeholder="请输入自定义密钥..."
      />
    </div>
  {/if}

  <div class="mode-selector">
    <label>操作模式</label>
    <div class="mode-buttons">
      <button
        class:active={mode === 'encrypt'}
        on:click={() => mode = 'encrypt'}
      >
        {isHashAlgorithm ? '计算哈希' : '加密'}
      </button>
      <button
        class:active={mode === 'decrypt'}
        class:disabled={isHashAlgorithm}
        on:click={() => !isHashAlgorithm && (mode = 'decrypt')}
        disabled={isHashAlgorithm}
      >
        解密
      </button>
    </div>
  </div>
</div>

<style>
  .input-section {
    background: #f8f9fa;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .input-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  textarea,
  input,
  select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s;
    box-sizing: border-box;
    background: white;
  }

  textarea:focus,
  input:focus,
  select:focus {
    outline: none;
    border-color: #4a90d9;
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .mode-selector {
    margin-top: 20px;
  }

  .mode-buttons {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .mode-buttons button {
    flex: 1;
    padding: 12px 24px;
    border: 2px solid #4a90d9;
    background: white;
    color: #4a90d9;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .mode-buttons button:hover {
    background: #e8f4fc;
  }

  .mode-buttons button.active {
    background: #4a90d9;
    color: white;
  }

  .mode-buttons button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
