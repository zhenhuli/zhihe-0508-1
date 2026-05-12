<script>
  import InputSection from './lib/InputSection.svelte';
  import CryptoProcessor from './lib/CryptoProcessor.svelte';
  import ResultDisplay from './lib/ResultDisplay.svelte';

  let inputText = '';
  let secretKey = '';
  let mode = 'encrypt';
  let algorithm = 'AES';
  let result = '';
  let error = '';
</script>

<div class="app-container">
  <header class="app-header">
    <h1>🔐 文本加密解密工具</h1>
    <p>支持多种常见加密算法的文本处理工具</p>
  </header>

  <main class="app-main">
    <InputSection
      bind:inputText
      bind:secretKey
      bind:mode
      bind:algorithm
    />

    <CryptoProcessor
      bind:inputText
      bind:secretKey
      bind:mode
      bind:algorithm
      bind:result
      bind:error
    />

    <ResultDisplay
      bind:result
      bind:mode
      bind:algorithm
    />
  </main>

  <footer class="app-footer">
    <p>基于 Svelte + Vite + CryptoJS 构建</p>
  </footer>
</div>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .app-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .app-header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
  }

  .app-header h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .app-header p {
    font-size: 16px;
    opacity: 0.9;
  }

  .app-main {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .app-footer {
    text-align: center;
    color: white;
    margin-top: 32px;
    font-size: 14px;
    opacity: 0.8;
  }
</style>
