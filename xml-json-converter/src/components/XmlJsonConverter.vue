<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import converter from '../modules/xmlJsonConverter.js';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);

import 'highlight.js/styles/atom-one-dark.css';

const inputText = ref('');
const outputText = ref('');
const errorMessage = ref('');
const conversionDirection = ref('auto');
const copySuccess = ref(false);
const isConverting = ref(false);

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;

const sampleJson = `{
  "note": {
    "to": "Tove",
    "from": "Jani",
    "heading": "Reminder",
    "body": "Don't forget me this weekend!"
  }
}`;

const hasError = computed(() => errorMessage.value !== '');
const hasOutput = computed(() => outputText.value !== '');

const detectedFormat = computed(() => {
  if (!inputText.value.trim()) return 'unknown';
  return converter.detectFormat(inputText.value);
});

const outputFormat = computed(() => {
  if (!outputText.value.trim()) return 'unknown';
  return converter.detectFormat(outputText.value);
});

const highlightedInput = computed(() => {
  if (!inputText.value.trim()) return '';
  const format = detectedFormat.value;
  if (format === 'json' || format === 'xml') {
    const result = converter.highlightCode(inputText.value, format);
    if (result.success) {
      return result.highlighted;
    }
  }
  return escapeHtml(inputText.value);
});

const highlightedOutput = computed(() => {
  if (!outputText.value.trim()) return '';
  const format = outputFormat.value;
  if (format === 'json' || format === 'xml') {
    const result = converter.highlightCode(outputText.value, format);
    if (result.success) {
      return result.highlighted;
    }
  }
  return escapeHtml(outputText.value);
});

const inputLanguageClass = computed(() => {
  return `language-${detectedFormat.value}`;
});

const outputLanguageClass = computed(() => {
  return `language-${outputFormat.value}`;
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const convert = () => {
  if (!inputText.value.trim()) {
    errorMessage.value = '请输入要转换的内容';
    return;
  }

  errorMessage.value = '';
  isConverting.value = true;

  try {
    const format = conversionDirection.value === 'auto' 
      ? detectedFormat.value 
      : conversionDirection.value;

    if (format === 'xml') {
      const result = converter.xmlToJson(inputText.value);
      if (result.success) {
        outputText.value = result.formatted;
        errorMessage.value = '';
      } else {
        outputText.value = '';
        errorMessage.value = result.error;
      }
    } else if (format === 'json') {
      const result = converter.jsonToXml(inputText.value);
      if (result.success) {
        outputText.value = result.formatted;
        errorMessage.value = '';
      } else {
        outputText.value = '';
        errorMessage.value = result.error;
      }
    } else {
      errorMessage.value = '无法识别输入格式，请检查输入内容';
    }
  } catch (error) {
    errorMessage.value = '转换过程中发生错误: ' + error.message;
  } finally {
    isConverting.value = false;
  }
};

const loadSample = (type) => {
  if (type === 'xml') {
    inputText.value = sampleXml;
  } else if (type === 'json') {
    inputText.value = sampleJson;
  }
  outputText.value = '';
  errorMessage.value = '';
};

const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
  errorMessage.value = '';
};

const swapContent = () => {
  if (outputText.value) {
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;
    errorMessage.value = '';
  }
};

const copyToClipboard = async () => {
  if (!outputText.value) return;
  
  try {
    await navigator.clipboard.writeText(outputText.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    errorMessage.value = '复制失败: ' + error.message;
  }
};

const beautifyInput = () => {
  if (!inputText.value.trim()) {
    errorMessage.value = '请输入要格式化的内容';
    return;
  }

  const format = detectedFormat.value;
  
  if (format === 'json') {
    const result = converter.parseJson(inputText.value);
    if (result.success) {
      inputText.value = converter.formatJson(result.result);
      errorMessage.value = '';
    } else {
      errorMessage.value = result.error;
    }
  } else if (format === 'xml') {
    inputText.value = converter.formatXml(inputText.value);
    errorMessage.value = '';
  } else {
    errorMessage.value = '无法识别输入格式，无法进行格式化';
  }
};

const minifyInput = () => {
  if (!inputText.value.trim()) {
    errorMessage.value = '请输入要压缩的内容';
    return;
  }

  const format = detectedFormat.value;
  
  if (format === 'json') {
    const result = converter.minifyJson(inputText.value);
    if (typeof result === 'string') {
      inputText.value = result;
      errorMessage.value = '';
    } else {
      errorMessage.value = result.error;
    }
  } else {
    errorMessage.value = '目前仅支持 JSON 压缩';
  }
};

const syncScroll = (event) => {
  const source = event.target;
  const targetId = source.id === 'input-textarea' ? 'input-highlight' : 
                   source.id === 'output-textarea' ? 'output-highlight' : null;
  
  if (targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
    }
  }
};

const initHighlight = () => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
};

onMounted(() => {
  initHighlight();
});

watch([highlightedInput, highlightedOutput], () => {
  setTimeout(initHighlight, 0);
});
</script>

<template>
  <div class="converter-container">
    <header class="app-header">
      <h1>XML 与 JSON 互转工具</h1>
      <p class="subtitle">简单高效的数据格式转换工具，支持代码高亮</p>
    </header>

    <div class="toolbar">
      <div class="direction-selector">
        <label for="direction">转换方向:</label>
        <select id="direction" v-model="conversionDirection">
          <option value="auto">自动检测</option>
          <option value="xml">XML → JSON</option>
          <option value="json">JSON → XML</option>
        </select>
      </div>

      <div class="action-buttons">
        <button @click="convert" class="primary-btn" :disabled="isConverting">
          {{ isConverting ? '转换中...' : '一键转换' }}
        </button>
        <button @click="swapContent" class="secondary-btn" :disabled="!hasOutput">
          交换内容
        </button>
        <button @click="clearAll" class="secondary-btn">
          清空
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">
          <h3>输入区</h3>
          <div class="panel-actions">
            <span class="format-indicator" :class="detectedFormat">
              {{ detectedFormat === 'xml' ? 'XML' : detectedFormat === 'json' ? 'JSON' : '未知' }}
            </span>
            <button @click="loadSample('xml')" class="small-btn">加载 XML 示例</button>
            <button @click="loadSample('json')" class="small-btn">加载 JSON 示例</button>
            <button @click="beautifyInput" class="small-btn">美化</button>
            <button @click="minifyInput" class="small-btn">压缩</button>
          </div>
        </div>
        <div class="code-editor-wrapper">
          <pre 
            id="input-highlight"
            class="code-highlight"
            :class="inputLanguageClass"
          ><code v-html="highlightedInput"></code></pre>
          <textarea
            id="input-textarea"
            v-model="inputText"
            class="editor-textarea"
            placeholder="请输入或粘贴要转换的 XML 或 JSON 内容..."
            spellcheck="false"
            @scroll="syncScroll"
          ></textarea>
        </div>
      </div>

      <div class="editor-panel">
        <div class="panel-header">
          <h3>输出区</h3>
          <div class="panel-actions">
            <span class="format-indicator" :class="outputFormat">
              {{ outputFormat === 'xml' ? 'XML' : outputFormat === 'json' ? 'JSON' : '' }}
            </span>
            <button 
              @click="copyToClipboard" 
              class="small-btn copy-btn"
              :class="{ 'success': copySuccess }"
              :disabled="!hasOutput"
            >
              {{ copySuccess ? '已复制!' : '复制结果' }}
            </button>
          </div>
        </div>
        <div class="code-editor-wrapper">
          <pre 
            id="output-highlight"
            class="code-highlight"
            :class="outputLanguageClass"
          ><code v-html="highlightedOutput"></code></pre>
          <textarea
            id="output-textarea"
            v-model="outputText"
            class="editor-textarea"
            placeholder="转换结果将显示在这里..."
            readonly
            spellcheck="false"
            @scroll="syncScroll"
          ></textarea>
        </div>
      </div>
    </div>

    <div v-if="hasError" class="error-message">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ errorMessage }}</span>
    </div>

    <footer class="app-footer">
      <p>支持 XML 和 JSON 格式互相转换，自动检测格式，代码高亮，美化输出，错误提示</p>
    </footer>
  </div>
</template>

<style scoped>
.converter-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.direction-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.direction-selector label {
  font-weight: 500;
  color: #333;
}

.direction-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 150px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background: #0056b3;
}

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.secondary-btn {
  background: #e9ecef;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover:not(:disabled) {
  background: #dee2e6;
}

.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1;
}

.editor-panel {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 10px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.panel-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.format-indicator {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.format-indicator.xml {
  background: #e3f2fd;
  color: #1976d2;
}

.format-indicator.json {
  background: #f3e5f5;
  color: #7b1fa2;
}

.small-btn {
  background: white;
  color: #555;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.small-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #ccc;
}

.small-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.copy-btn:hover:not(:disabled) {
  background: #218838;
  border-color: #1e7e34;
}

.copy-btn.success {
  background: #20c997;
  border-color: #20c997;
}

.code-editor-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.code-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 15px;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 0;
  white-space: pre;
  word-wrap: normal;
  pointer-events: none;
  z-index: 1;
}

.code-highlight code {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: 0;
  background: transparent;
}

.editor-textarea {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding: 15px;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  color: transparent;
  caret-color: #333;
  box-sizing: border-box;
  outline: none;
  z-index: 2;
  overflow: auto;
}

.editor-textarea:focus {
  background: transparent;
}

.editor-textarea::placeholder {
  color: #999;
}

.editor-textarea:not(:read-only)::placeholder {
  color: #999;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.error-icon {
  font-size: 20px;
}

.error-text {
  font-size: 14px;
}

.app-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .code-editor-wrapper {
    height: 300px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style>
