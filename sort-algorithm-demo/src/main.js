class SortVisualizer {
  constructor() {
    this.canvas = document.getElementById('sortCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 1000;
    this.canvas.height = 500;
    
    this.data = [];
    this.dataSize = 30;
    this.speed = 50;
    this.isRunning = false;
    this.isPaused = false;
    this.isStepMode = false;
    this.stepResolve = null;
    
    this.compareCount = 0;
    this.swapCount = 0;
    
    this.currentIndices = [];
    this.sortedIndices = [];
    
    this.initElements();
    this.generateData();
    this.bindEvents();
    this.updateAlgorithmInfo('bubble');
  }
  
  initElements() {
    this.algorithmSelect = document.getElementById('algorithm');
    this.dataSizeInput = document.getElementById('dataSize');
    this.dataSizeValue = document.getElementById('dataSizeValue');
    this.speedInput = document.getElementById('speed');
    this.speedValue = document.getElementById('speedValue');
    this.generateBtn = document.getElementById('generateBtn');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.stepBtn = document.getElementById('stepBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.compareCountEl = document.getElementById('compareCount');
    this.swapCountEl = document.getElementById('swapCount');
    this.statusEl = document.getElementById('status');
    this.algorithmTitle = document.getElementById('algorithmTitle');
    this.algorithmDesc = document.getElementById('algorithmDesc');
    
    this.algorithms = {
      bubble: {
        title: '冒泡排序',
        desc: '冒泡排序通过重复遍历待排序序列，比较相邻元素并交换位置，使较大元素逐渐"浮"到序列末端。每趟遍历后，最大元素已归位，下趟遍历长度减一。',
        time: 'O(n²)',
        space: 'O(1)',
        stable: '稳定'
      },
      selection: {
        title: '选择排序',
        desc: '选择排序每趟从待排序数据中选出最小（或最大）元素，存放到已排序序列的起始位置，直到全部数据排序完成。数据移动次数少，但比较次数固定。',
        time: 'O(n²)',
        space: 'O(1)',
        stable: '不稳定'
      },
      insertion: {
        title: '插入排序',
        desc: '插入排序通过构建有序序列，对未排序数据在已排序序列中从后向前扫描，找到合适位置并插入。对小规模或基本有序数据效率较高。',
        time: 'O(n²)',
        space: 'O(1)',
        stable: '稳定'
      },
      shell: {
        title: '希尔排序',
        desc: '希尔排序是插入排序的改进版，通过将数据分组进行插入排序，逐步缩小间隔直到为1，使数据"基本有序"，最后进行一次插入排序。',
        time: 'O(n log n)',
        space: 'O(1)',
        stable: '不稳定'
      },
      merge: {
        title: '归并排序',
        desc: '归并排序采用分治策略，将序列分成两半分别排序，然后将两个有序子序列合并成一个完整有序序列。是稳定的排序算法。',
        time: 'O(n log n)',
        space: 'O(n)',
        stable: '稳定'
      },
      quick: {
        title: '快速排序',
        desc: '快速排序选择一个基准元素，将序列分为两部分，小于基准的放左边，大于的放右边，然后递归对两部分排序，是实践中最快的排序算法之一。',
        time: 'O(n log n)',
        space: 'O(log n)',
        stable: '不稳定'
      },
      heap: {
        title: '堆排序',
        desc: '堆排序利用堆这种数据结构，将序列构建成最大堆，每次取出堆顶元素（最大值）并调整堆，直到所有元素有序。是一种高效的选择排序。',
        time: 'O(n log n)',
        space: 'O(1)',
        stable: '不稳定'
      },
      counting: {
        title: '计数排序',
        desc: '计数排序是一种非比较排序，统计每个元素出现的次数，然后按顺序输出。适用于数据范围较小的整数排序，速度快于任何比较排序算法。',
        time: 'O(n + k)',
        space: 'O(k)',
        stable: '稳定'
      },
      bucket: {
        title: '桶排序',
        desc: '桶排序将数据分到有限数量的桶里，每个桶分别排序（可使用其他排序算法或递归桶排序），最后按顺序合并各个桶的数据。',
        time: 'O(n + k)',
        space: 'O(n + k)',
        stable: '稳定'
      },
      radix: {
        title: '基数排序',
        desc: '基数排序按低位到高位依次排序，利用计数排序或桶排序作为子过程，是一种非比较型整数排序算法，也可用于字符串。',
        time: 'O(n * k)',
        space: 'O(n + k)',
        stable: '稳定'
      }
    };
  }
  
  bindEvents() {
    this.algorithmSelect.addEventListener('change', (e) => {
      this.updateAlgorithmInfo(e.target.value);
    });
    
    this.dataSizeInput.addEventListener('input', (e) => {
      this.dataSize = parseInt(e.target.value);
      this.dataSizeValue.textContent = this.dataSize;
      if (!this.isRunning) {
        this.generateData();
      }
    });
    
    this.speedInput.addEventListener('input', (e) => {
      this.speed = parseInt(e.target.value);
      this.speedValue.textContent = this.speed;
    });
    
    this.generateBtn.addEventListener('click', () => {
      if (!this.isRunning) {
        this.generateData();
      }
    });
    
    this.startBtn.addEventListener('click', () => {
      if (!this.isRunning) {
        this.startSort();
      } else if (this.isPaused) {
        this.resumeSort();
      }
    });
    
    this.pauseBtn.addEventListener('click', () => {
      if (this.isRunning && !this.isPaused) {
        this.pauseSort();
      }
    });
    
    this.stepBtn.addEventListener('click', () => {
      if (!this.isRunning) {
        this.isStepMode = true;
        this.startSort(true);
      } else if (this.isStepMode && this.stepResolve) {
        this.stepResolve();
        this.stepResolve = null;
      }
    });
    
    this.resetBtn.addEventListener('click', () => {
      this.resetSort();
    });
  }
  
  generateData() {
    this.data = [];
    for (let i = 0; i < this.dataSize; i++) {
      this.data.push(Math.floor(Math.random() * 450) + 30);
    }
    this.sortedIndices = [];
    this.currentIndices = [];
    this.compareCount = 0;
    this.swapCount = 0;
    this.updateStats();
    this.draw();
    this.setStatus('就绪');
  }
  
  draw() {
    const ctx = this.ctx;
    const barWidth = (this.canvas.width - 40) / this.data.length;
    const maxValue = Math.max(...this.data);
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (this.canvas.height - 60);
      const x = 20 + index * barWidth;
      const y = this.canvas.height - barHeight - 30;
      
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - 2, barHeight, 3);
      
      if (this.sortedIndices.includes(index)) {
        ctx.fillStyle = '#28a745';
      } else if (this.currentIndices.includes(index)) {
        ctx.fillStyle = '#dc3545';
      } else {
        ctx.fillStyle = '#667eea';
      }
      
      ctx.fill();
      
      if (this.data.length <= 50) {
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2 - 1, y - 5);
      }
    });
  }
  
  updateAlgorithmInfo(algorithm) {
    const info = this.algorithms[algorithm];
    this.algorithmTitle.textContent = info.title;
    this.algorithmDesc.textContent = info.desc;
    
    const complexityDiv = this.algorithmDesc.nextElementSibling;
    complexityDiv.innerHTML = `
      <span><strong>时间复杂度:</strong> ${info.time}</span>
      <span><strong>空间复杂度:</strong> ${info.space}</span>
      <span><strong>稳定性:</strong> ${info.stable}</span>
    `;
  }
  
  async delay() {
    if (this.isStepMode) {
      this.setStatus('等待下一步...');
      await new Promise(resolve => {
        this.stepResolve = resolve;
      });
    } else {
      await new Promise(resolve => setTimeout(resolve, this.speed));
    }
    
    while (this.isPaused) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  swap(i, j) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    this.swapCount++;
    this.updateStats();
  }
  
  compare() {
    this.compareCount++;
    this.updateStats();
  }
  
  updateStats() {
    this.compareCountEl.textContent = this.compareCount;
    this.swapCountEl.textContent = this.swapCount;
  }
  
  setStatus(status) {
    this.statusEl.textContent = status;
  }
  
  async startSort(stepMode = false) {
    this.isRunning = true;
    this.isStepMode = stepMode;
    this.compareCount = 0;
    this.swapCount = 0;
    this.sortedIndices = [];
    this.updateStats();
    
    this.updateButtons();
    
    const algorithm = this.algorithmSelect.value;
    this.setStatus(`正在${stepMode ? '分步' : ''}排序...`);
    
    try {
      switch (algorithm) {
        case 'bubble':
          await this.bubbleSort();
          break;
        case 'selection':
          await this.selectionSort();
          break;
        case 'insertion':
          await this.insertionSort();
          break;
        case 'shell':
          await this.shellSort();
          break;
        case 'merge':
          await this.mergeSort();
          break;
        case 'quick':
          await this.quickSort();
          break;
        case 'heap':
          await this.heapSort();
          break;
        case 'counting':
          await this.countingSort();
          break;
        case 'bucket':
          await this.bucketSort();
          break;
        case 'radix':
          await this.radixSort();
          break;
      }
      
      this.currentIndices = [];
      this.sortedIndices = this.data.map((_, i) => i);
      this.draw();
      this.setStatus('排序完成！');
    } catch (e) {
      if (e.message !== 'reset') {
        console.error(e);
      }
    }
    
    this.isRunning = false;
    this.isStepMode = false;
    this.stepResolve = null;
    this.updateButtons();
  }
  
  pauseSort() {
    this.isPaused = true;
    this.setStatus('已暂停');
    this.updateButtons();
  }
  
  resumeSort() {
    this.isPaused = false;
    this.setStatus('正在排序...');
    this.updateButtons();
  }
  
  resetSort() {
    if (this.stepResolve) {
      this.stepResolve();
    }
    this.isRunning = false;
    this.isPaused = false;
    this.isStepMode = false;
    this.stepResolve = null;
    this.generateData();
    this.updateButtons();
  }
  
  updateButtons() {
    this.generateBtn.disabled = this.isRunning;
    this.startBtn.disabled = this.isRunning && !this.isPaused;
    this.pauseBtn.disabled = !this.isRunning || this.isPaused || this.isStepMode;
    this.stepBtn.disabled = this.isRunning && !this.isStepMode;
    this.resetBtn.disabled = false;
    this.algorithmSelect.disabled = this.isRunning;
    this.dataSizeInput.disabled = this.isRunning;
  }
  
  async bubbleSort() {
    const n = this.data.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!this.isRunning) throw new Error('reset');
        
        this.currentIndices = [j, j + 1];
        this.draw();
        this.compare();
        await this.delay();
        
        if (this.data[j] > this.data[j + 1]) {
          this.swap(j, j + 1);
          this.draw();
          await this.delay();
        }
      }
      this.sortedIndices.push(n - i - 1);
      this.draw();
    }
    this.sortedIndices.push(0);
  }
  
  async selectionSort() {
    const n = this.data.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        if (!this.isRunning) throw new Error('reset');
        
        this.currentIndices = [minIdx, j];
        this.draw();
        this.compare();
        await this.delay();
        
        if (this.data[j] < this.data[minIdx]) {
          minIdx = j;
          this.currentIndices = [minIdx, j];
          this.draw();
          await this.delay();
        }
      }
      
      if (minIdx !== i) {
        this.currentIndices = [i, minIdx];
        this.swap(i, minIdx);
        this.draw();
        await this.delay();
      }
      
      this.sortedIndices.push(i);
      this.draw();
    }
    this.sortedIndices.push(n - 1);
  }
  
  async insertionSort() {
    const n = this.data.length;
    
    for (let i = 1; i < n; i++) {
      let key = this.data[i];
      let j = i - 1;
      
      this.currentIndices = [i];
      this.draw();
      await this.delay();
      
      while (j >= 0 && this.data[j] > key) {
        if (!this.isRunning) throw new Error('reset');
        
        this.currentIndices = [j, j + 1];
        this.draw();
        this.compare();
        await this.delay();
        
        this.data[j + 1] = this.data[j];
        this.swapCount++;
        this.updateStats();
        j--;
        
        this.draw();
        await this.delay();
      }
      
      this.data[j + 1] = key;
      this.sortedIndices.push(i - 1);
      this.draw();
      await this.delay();
    }
    this.sortedIndices.push(n - 1);
  }
  
  async shellSort() {
    const n = this.data.length;
    let gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    
    for (let gap of gaps) {
      if (gap >= n) continue;
      
      for (let i = gap; i < n; i++) {
        if (!this.isRunning) throw new Error('reset');
        
        let temp = this.data[i];
        let j = i;
        
        this.currentIndices = [i];
        this.draw();
        await this.delay();
        
        while (j >= gap && this.data[j - gap] > temp) {
          if (!this.isRunning) throw new Error('reset');
          
          this.currentIndices = [j, j - gap];
          this.draw();
          this.compare();
          await this.delay();
          
          this.data[j] = this.data[j - gap];
          this.swapCount++;
          this.updateStats();
          j -= gap;
          
          this.draw();
          await this.delay();
        }
        
        this.data[j] = temp;
      }
    }
  }
  
  async mergeSort() {
    await this.mergeSortHelper(0, this.data.length - 1);
  }
  
  async mergeSortHelper(left, right) {
    if (!this.isRunning) throw new Error('reset');
    
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await this.mergeSortHelper(left, mid);
      await this.mergeSortHelper(mid + 1, right);
      await this.merge(left, mid, right);
    }
  }
  
  async merge(left, mid, right) {
    const leftArr = this.data.slice(left, mid + 1);
    const rightArr = this.data.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (!this.isRunning) throw new Error('reset');
      
      this.currentIndices = [left + i, mid + 1 + j];
      this.draw();
      this.compare();
      await this.delay();
      
      if (leftArr[i] <= rightArr[j]) {
        this.data[k] = leftArr[i];
        i++;
      } else {
        this.data[k] = rightArr[j];
        j++;
      }
      this.swapCount++;
      this.updateStats();
      k++;
      
      this.draw();
      await this.delay();
    }
    
    while (i < leftArr.length) {
      if (!this.isRunning) throw new Error('reset');
      
      this.data[k] = leftArr[i];
      this.currentIndices = [k];
      this.draw();
      this.swapCount++;
      this.updateStats();
      i++;
      k++;
      await this.delay();
    }
    
    while (j < rightArr.length) {
      if (!this.isRunning) throw new Error('reset');
      
      this.data[k] = rightArr[j];
      this.currentIndices = [k];
      this.draw();
      this.swapCount++;
      this.updateStats();
      j++;
      k++;
      await this.delay();
    }
  }
  
  async quickSort() {
    await this.quickSortHelper(0, this.data.length - 1);
  }
  
  async quickSortHelper(low, high) {
    if (!this.isRunning) throw new Error('reset');
    
    if (low < high) {
      const pivotIndex = await this.partition(low, high);
      this.sortedIndices.push(pivotIndex);
      this.draw();
      await this.delay();
      
      await this.quickSortHelper(low, pivotIndex - 1);
      await this.quickSortHelper(pivotIndex + 1, high);
    }
  }
  
  async partition(low, high) {
    const pivot = this.data[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (!this.isRunning) throw new Error('reset');
      
      this.currentIndices = [j, high];
      this.draw();
      this.compare();
      await this.delay();
      
      if (this.data[j] < pivot) {
        i++;
        if (i !== j) {
          this.swap(i, j);
          this.draw();
          await this.delay();
        }
      }
    }
    
    this.swap(i + 1, high);
    this.draw();
    await this.delay();
    
    return i + 1;
  }
  
  async heapSort() {
    const n = this.data.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
      if (!this.isRunning) throw new Error('reset');
      
      this.swap(0, i);
      this.sortedIndices.push(i);
      this.draw();
      await this.delay();
      
      await this.heapify(i, 0);
    }
  }
  
  async heapify(n, i) {
    if (!this.isRunning) throw new Error('reset');
    
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    this.currentIndices = [i];
    if (left < n) this.currentIndices.push(left);
    if (right < n) this.currentIndices.push(right);
    this.draw();
    this.compare();
    await this.delay();
    
    if (left < n && this.data[left] > this.data[largest]) {
      largest = left;
    }
    
    if (right < n && this.data[right] > this.data[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      this.swap(i, largest);
      this.draw();
      await this.delay();
      
      await this.heapify(n, largest);
    }
  }
  
  async countingSort() {
    const max = Math.max(...this.data);
    const min = Math.min(...this.data);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(this.data.length);
    
    for (let i = 0; i < this.data.length; i++) {
      if (!this.isRunning) throw new Error('reset');
      
      this.currentIndices = [i];
      this.draw();
      count[this.data[i] - min]++;
      this.compareCount++;
      this.updateStats();
      await this.delay();
    }
    
    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];
    }
    
    for (let i = this.data.length - 1; i >= 0; i--) {
      if (!this.isRunning) throw new Error('reset');
      
      output[count[this.data[i] - min] - 1] = this.data[i];
      count[this.data[i] - min]--;
      this.swapCount++;
      this.updateStats();
    }
    
    for (let i = 0; i < this.data.length; i++) {
      if (!this.isRunning) throw new Error('reset');
      
      this.data[i] = output[i];
      this.currentIndices = [i];
      this.sortedIndices.push(i);
      this.draw();
      await this.delay();
    }
  }
  
  async bucketSort() {
    const n = this.data.length;
    const max = Math.max(...this.data);
    const min = Math.min(...this.data);
    const bucketCount = Math.min(n, 10);
    const buckets = Array.from({ length: bucketCount }, () => []);
    
    const range = (max - min + 1) / bucketCount;
    
    for (let i = 0; i < n; i++) {
      if (!this.isRunning) throw new Error('reset');
      
      const bucketIndex = Math.min(Math.floor((this.data[i] - min) / range), bucketCount - 1);
      buckets[bucketIndex].push(this.data[i]);
      
      this.currentIndices = [i];
      this.draw();
      this.compareCount++;
      this.updateStats();
      await this.delay();
    }
    
    let index = 0;
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].sort((a, b) => a - b);
      
      for (let j = 0; j < buckets[i].length; j++) {
        if (!this.isRunning) throw new Error('reset');
        
        this.data[index] = buckets[i][j];
        this.currentIndices = [index];
        this.sortedIndices.push(index);
        this.draw();
        this.swapCount++;
        this.updateStats();
        index++;
        await this.delay();
      }
    }
  }
  
  async radixSort() {
    const max = Math.max(...this.data);
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      await this.countingSortByDigit(exp);
    }
  }
  
  async countingSortByDigit(exp) {
    const n = this.data.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < n; i++) {
      if (!this.isRunning) throw new Error('reset');
      
      const digit = Math.floor(this.data[i] / exp) % 10;
      count[digit]++;
      
      this.currentIndices = [i];
      this.draw();
      this.compareCount++;
      this.updateStats();
      await this.delay();
    }
    
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    for (let i = n - 1; i >= 0; i--) {
      if (!this.isRunning) throw new Error('reset');
      
      const digit = Math.floor(this.data[i] / exp) % 10;
      output[count[digit] - 1] = this.data[i];
      count[digit]--;
    }
    
    for (let i = 0; i < n; i++) {
      if (!this.isRunning) throw new Error('reset');
      
      this.data[i] = output[i];
      this.currentIndices = [i];
      this.draw();
      this.swapCount++;
      this.updateStats();
      await this.delay();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SortVisualizer();
});
