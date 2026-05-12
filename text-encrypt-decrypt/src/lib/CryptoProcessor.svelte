<script>
  import CryptoJS from 'crypto-js';

  export let inputText = '';
  export let secretKey = '';
  export let mode = 'encrypt';
  export let algorithm = 'AES';
  export let result = '';
  export let error = '';

  const algorithms = {
    AES: {
      encrypt: (text, key) => CryptoJS.AES.encrypt(text, key).toString(),
      decrypt: (text, key) => CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    },
    DES: {
      encrypt: (text, key) => CryptoJS.DES.encrypt(text, key).toString(),
      decrypt: (text, key) => CryptoJS.DES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    },
    TripleDES: {
      encrypt: (text, key) => CryptoJS.TripleDES.encrypt(text, key).toString(),
      decrypt: (text, key) => CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    },
    Rabbit: {
      encrypt: (text, key) => CryptoJS.Rabbit.encrypt(text, key).toString(),
      decrypt: (text, key) => CryptoJS.Rabbit.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    },
    RC4: {
      encrypt: (text, key) => CryptoJS.RC4.encrypt(text, key).toString(),
      decrypt: (text, key) => CryptoJS.RC4.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    },
    Base64: {
      encrypt: (text) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)),
      decrypt: (text) => CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8),
      noKey: true
    },
    MD5: {
      encrypt: (text) => CryptoJS.MD5(text).toString(),
      decrypt: null,
      noKey: true,
      hashOnly: true
    },
    SHA1: {
      encrypt: (text) => CryptoJS.SHA1(text).toString(),
      decrypt: null,
      noKey: true,
      hashOnly: true
    },
    SHA256: {
      encrypt: (text) => CryptoJS.SHA256(text).toString(),
      decrypt: null,
      noKey: true,
      hashOnly: true
    },
    SHA512: {
      encrypt: (text) => CryptoJS.SHA512(text).toString(),
      decrypt: null,
      noKey: true,
      hashOnly: true
    }
  };

  $: currentAlgorithm = algorithms[algorithm];
  $: isHashOnly = currentAlgorithm?.hashOnly;
  $: needsKey = !currentAlgorithm?.noKey;

  function process() {
    error = '';
    result = '';

    if (!inputText.trim()) {
      error = '请输入要处理的文本';
      return;
    }

    if (needsKey && !secretKey.trim()) {
      error = '请输入密钥';
      return;
    }

    if (isHashOnly && mode === 'decrypt') {
      error = '哈希算法不支持解密';
      return;
    }

    try {
      if (mode === 'encrypt') {
        result = currentAlgorithm.encrypt(inputText, secretKey);
      } else {
        if (!currentAlgorithm.decrypt) {
          throw new Error('该算法不支持解密');
        }
        const decrypted = currentAlgorithm.decrypt(inputText, secretKey);
        if (!decrypted) {
          throw new Error('解密失败');
        }
        result = decrypted;
      }
    } catch (e) {
      error = mode === 'encrypt' ? '加密失败' : '解密失败，请检查密钥或密文是否正确';
    }
  }

  function reset() {
    inputText = '';
    secretKey = '';
    result = '';
    error = '';
  }
</script>

<div class="processor-section">
  <div class="action-buttons">
    <button class="primary" on:click={process}>
      {mode === 'encrypt' ? '开始加密' : '开始解密'}
    </button>
    <button class="secondary" on:click={reset}>
      重置
    </button>
  </div>

  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
</div>

<style>
  .processor-section {
    background: #fff3e0;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }

  button {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary {
    background: #4a90d9;
    color: white;
  }

  .primary:hover {
    background: #3a7bc8;
    transform: translateY(-1px);
  }

  .secondary {
    background: white;
    color: #666;
    border: 2px solid #e0e0e0;
  }

  .secondary:hover {
    background: #f5f5f5;
  }

  .error-message {
    margin-top: 16px;
    padding: 12px 16px;
    background: #ffebee;
    color: #c62828;
    border-radius: 8px;
    font-size: 14px;
  }
</style>
