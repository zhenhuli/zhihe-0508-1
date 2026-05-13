import { loaders, categories } from './loaders/index.js';
import mainStyles from './styles/main.module.css';

let currentLoader = null;

const animationStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulseRing {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.5); opacity: 0.5; }
  }
  
  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes dash {
    0% { stroke-dashoffset: 100; }
    50% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -100; }
  }
  
  @keyframes infinityDash {
    0% { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: -200; }
  }
  
  @keyframes heartbeatDash {
    0%, 100% { stroke-dashoffset: 300; }
    50% { stroke-dashoffset: 0; }
  }
  
  @keyframes spiralDash {
    0% { stroke-dashoffset: 150; }
    100% { stroke-dashoffset: -150; }
  }
  
  @keyframes morph {
    0%, 100% { d: path("M50,10 L90,90 L10,90 Z"); }
    33% { d: path("M50,10 L90,50 L50,90 L10,50 Z"); }
    66% { d: path("M50,10 C90,10 90,90 50,90 C10,90 10,10 50,10 Z"); }
  }
  
  @keyframes dropMorph {
    0%, 100% { 
      d: path("M50,10 C70,30 80,50 80,65 C80,85 65,95 50,95 C35,95 20,85 20,65 C20,50 30,30 50,10 Z");
    }
    50% { 
      d: path("M50,20 C65,35 75,55 75,70 C75,85 65,90 50,90 C35,90 25,85 25,70 C25,55 35,35 50,20 Z");
    }
  }
  
  @keyframes starPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(0.9) rotate(15deg); }
    50% { transform: scale(1.1) rotate(0deg); }
    75% { transform: scale(0.9) rotate(-15deg); }
  }
  
  @keyframes growRing {
    0% { r: 5; opacity: 1; }
    100% { r: 45; opacity: 0; }
  }
  
  .spinner-circle { animation: spin 1s linear infinite; }
  .dashed-ring { animation: spin 1.5s linear infinite; }
  .dual-ring { animation: spin 2s linear infinite; }
  .three-ring { animation: spin 1.2s linear infinite; }
  .pulse-ring { animation: pulseRing 1.5s ease-in-out infinite; }
  .dots-bounce .dot { animation: bounce 1.4s ease-in-out infinite both; }
  .dots-bounce .dot:nth-child(1) { animation-delay: -0.32s; }
  .dots-bounce .dot:nth-child(2) { animation-delay: -0.16s; }
  .dots-bounce .dot:nth-child(3) { animation-delay: 0s; }
  .dots-pulse .dot { animation: pulse 1s ease-in-out infinite; }
  .dots-pulse .dot:nth-child(1) { animation-delay: 0s; }
  .dots-pulse .dot:nth-child(2) { animation-delay: 0.1s; }
  .dots-pulse .dot:nth-child(3) { animation-delay: 0.2s; }
  .dots-pulse .dot:nth-child(4) { animation-delay: 0.3s; }
  .dots-pulse .dot:nth-child(5) { animation-delay: 0.4s; }
  .dots-rotate { animation: spin 2s linear infinite; }
  .dots-wave .dot { animation: wave 1.2s ease-in-out infinite; }
  .dots-wave .dot:nth-child(1) { animation-delay: 0s; }
  .dots-wave .dot:nth-child(2) { animation-delay: 0.1s; }
  .dots-wave .dot:nth-child(3) { animation-delay: 0.2s; }
  .dots-wave .dot:nth-child(4) { animation-delay: 0.3s; }
  .dots-wave .dot:nth-child(5) { animation-delay: 0.4s; }
  .path-dash .path { stroke-dasharray: 100; animation: dash 2s ease-in-out infinite; }
  .infinity-path .path { stroke-dasharray: 200; animation: infinityDash 2s linear infinite; }
  .heartbeat .path { stroke-dasharray: 300; animation: heartbeatDash 1.5s ease-in-out infinite; }
  .spiral-path .path { stroke-dasharray: 150; animation: spiralDash 3s linear infinite; }
  .morph-shape path { animation: morph 3s ease-in-out infinite; }
  .water-drop path { animation: dropMorph 2s ease-in-out infinite; }
  .star-pulse path { transform-origin: center; animation: starPulse 2s ease-in-out infinite; }
  .orbit-dots { animation: spin 3s linear infinite; }
  .orbit-dots .orbit { animation: spin 1.5s linear infinite reverse; }
  .growing-ring circle { transform-origin: center; animation: growRing 1.5s ease-in-out infinite; }
  .growing-ring circle:nth-child(1) { animation-delay: 0s; }
  .growing-ring circle:nth-child(2) { animation-delay: 0.5s; }
  .growing-ring circle:nth-child(3) { animation-delay: 1s; }
`;

function init() {
  const styleEl = document.createElement('style');
  styleEl.textContent = animationStyles;
  document.head.appendChild(styleEl);

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="${mainStyles.container}">
      <header class="${mainStyles.header}">
        <h1>SVG 加载动画合集</h1>
        <p>点击左侧列表切换动画，点击复制按钮获取代码</p>
      </header>
      <div class="${mainStyles.mainContent}">
        <div class="${mainStyles.loaderList}">
          <h2>动画列表</h2>
          <div id="loader-list"></div>
        </div>
        <div class="${mainStyles.loaderPreview}">
          <div class="${mainStyles.previewHeader}">
            <h2 id="loader-name">选择一个动画</h2>
            <button id="copy-btn" class="${mainStyles.copyButton}" disabled>
              <span>📋</span> 复制代码
            </button>
          </div>
          <div class="${mainStyles.previewArea}" id="preview-area">
            <div style="color: #999; font-size: 1.2rem;">请从左侧选择一个加载动画</div>
          </div>
          <div class="${mainStyles.codeSection}" id="code-section" style="display: none;">
            <h3>SVG 代码</h3>
            <div class="${mainStyles.codeBlock}">
              <pre id="code-content"></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLoaderList();
  setupCopyButton();
}

function renderLoaderList() {
  const listContainer = document.getElementById('loader-list');
  
  categories.forEach(category => {
    const categoryTitle = document.createElement('div');
    categoryTitle.className = mainStyles.categoryTitle;
    categoryTitle.textContent = category.name;
    listContainer.appendChild(categoryTitle);

    loaders[category.id].forEach(loader => {
      const item = document.createElement('div');
      item.className = mainStyles.loaderItem;
      item.dataset.loaderId = loader.id;
      item.dataset.category = category.id;
      
      const preview = document.createElement('div');
      preview.className = mainStyles.loaderItemPreview;
      preview.innerHTML = `<div style="transform: scale(0.5); transform-origin: center;">${loader.svg}</div>`;
      
      const name = document.createElement('span');
      name.className = mainStyles.loaderItemName;
      name.textContent = loader.name;
      
      item.appendChild(preview);
      item.appendChild(name);
      
      item.addEventListener('click', () => selectLoader(loader, category.id));
      listContainer.appendChild(item);
    });
  });
}

function selectLoader(loader, category) {
  document.querySelectorAll(`.${mainStyles.loaderItem}`).forEach(item => {
    item.classList.remove(mainStyles.active);
  });
  
  const activeItem = document.querySelector(`[data-loader-id="${loader.id}"]`);
  if (activeItem) {
    activeItem.classList.add(mainStyles.active);
  }
  
  currentLoader = loader;
  
  document.getElementById('loader-name').textContent = loader.name;
  
  const previewArea = document.getElementById('preview-area');
  previewArea.innerHTML = `<div class="${loader.cssClass}">${loader.svg}</div>`;
  
  const codeSection = document.getElementById('code-section');
  codeSection.style.display = 'block';
  
  const codeContent = document.getElementById('code-content');
  codeContent.textContent = formatCode(loader);
  
  document.getElementById('copy-btn').disabled = false;
}

function formatCode(loader) {
  return loader.svg
    .replace(/></g, '>\n<')
    .replace(/^\s+|\s+$/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
}

function setupCopyButton() {
  const copyBtn = document.getElementById('copy-btn');
  
  copyBtn.addEventListener('click', async () => {
    if (!currentLoader) return;
    
    try {
      const codeToCopy = formatCode(currentLoader);
      await navigator.clipboard.writeText(codeToCopy);
      
      copyBtn.classList.add(mainStyles.copySuccess);
      copyBtn.innerHTML = '<span>✓</span> 已复制!';
      
      setTimeout(() => {
        copyBtn.classList.remove(mainStyles.copySuccess);
        copyBtn.innerHTML = '<span>📋</span> 复制代码';
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
      copyBtn.innerHTML = '<span>✗</span> 复制失败';
      
      setTimeout(() => {
        copyBtn.innerHTML = '<span>📋</span> 复制代码';
      }, 2000);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
