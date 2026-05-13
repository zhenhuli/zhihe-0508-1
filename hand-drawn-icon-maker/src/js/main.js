class IconMaker {
  constructor() {
    this.canvas = document.getElementById('drawingCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentShape = 'none';
    this.startX = 0;
    this.startY = 0;
    this.history = [];
    this.lineWidth = 3;
    this.strokeColor = '#2c3e50';
    this.bgColor = 'transparent';
    this.isTransparent = true;
    this.historyCanvas = document.createElement('canvas');
    this.historyCtx = this.historyCanvas.getContext('2d');
    
    this.init();
  }

  init() {
    this.historyCanvas.width = this.canvas.width;
    this.historyCanvas.height = this.canvas.height;
    this.saveState();
    this.bindEvents();
    this.setupCanvas();
  }

  setupCanvas() {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeColor;
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

    this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, 'start'));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, 'move'));
    this.canvas.addEventListener('touchend', (e) => this.handleTouch(e, 'end'));

    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectShape(e.target));
    });

    document.getElementById('lineWidth').addEventListener('input', (e) => {
      this.lineWidth = parseInt(e.target.value);
      document.getElementById('lineWidthValue').textContent = this.lineWidth;
      this.ctx.lineWidth = this.lineWidth;
    });

    document.getElementById('strokeColor').addEventListener('input', (e) => {
      this.strokeColor = e.target.value;
      this.ctx.strokeStyle = this.strokeColor;
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setBackgroundColor(e.target.dataset.color, e.target));
    });

    document.getElementById('applyBgColor').addEventListener('click', () => {
      const customColor = document.getElementById('bgColor').value;
      this.setBackgroundColor(customColor);
    });

    document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
    document.getElementById('undoBtn').addEventListener('click', () => this.undo());
    document.getElementById('exportBtn').addEventListener('click', () => this.export());
    document.getElementById('resizeBtn').addEventListener('click', () => this.resizeCanvas());
  }

  setBackgroundColor(color, btn = null) {
    if (btn) {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0);

    this.bgColor = color;
    this.isTransparent = color === 'transparent';

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.isTransparent) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.drawImage(tempCanvas, 0, 0);

    this.history = [];
    this.saveToHistory();
  }

  handleTouch(e, type) {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = this.canvas.getBoundingClientRect();
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };

    if (type === 'start') this.startDrawing(mouseEvent);
    else if (type === 'move') this.draw(mouseEvent);
    else if (type === 'end') this.stopDrawing();
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDrawing(e) {
    const coords = this.getCanvasCoords(e);
    this.isDrawing = true;
    this.startX = coords.x;
    this.startY = coords.y;

    if (this.currentShape === 'none') {
      this.ctx.beginPath();
      this.ctx.moveTo(coords.x, coords.y);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const coords = this.getCanvasCoords(e);

    if (this.currentShape === 'none') {
      this.ctx.lineTo(coords.x, coords.y);
      this.ctx.stroke();
    } else {
      this.redrawWithPreview(coords.x, coords.y);
    }
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    
    if (this.currentShape !== 'none') {
      this.saveToHistory();
    } else {
      this.saveToHistory();
    }
  }

  redrawWithPreview(endX, endY) {
    this.restoreFromHistory();
    
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeColor;

    if (this.currentShape === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2));
      this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
    } else if (this.currentShape === 'square') {
      const width = endX - this.startX;
      const height = endY - this.startY;
      this.ctx.rect(this.startX, this.startY, width, height);
    } else if (this.currentShape === 'line') {
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(endX, endY);
    }

    this.ctx.stroke();
  }

  selectShape(btn) {
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.currentShape = btn.dataset.shape;
  }

  saveToHistory() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0);
    this.history.push(tempCanvas);
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  restoreFromHistory() {
    if (this.history.length > 0) {
      const lastState = this.history[this.history.length - 1];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(lastState, 0, 0);
    }
  }

  saveState() {
    this.saveToHistory();
  }

  restoreToLastState() {
    this.restoreFromHistory();
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const lastState = this.history[this.history.length - 1];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(lastState, 0, 0);
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.isTransparent) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.history = [];
    this.saveToHistory();
  }

  resizeCanvas() {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0);

    this.canvas.width = width;
    this.canvas.height = height;
    this.setupCanvas();
    
    if (!this.isTransparent) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.drawImage(tempCanvas, 0, 0);
    
    this.history = [];
    this.saveToHistory();
  }

  export() {
    const link = document.createElement('a');
    link.download = `icon-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new IconMaker();
});
