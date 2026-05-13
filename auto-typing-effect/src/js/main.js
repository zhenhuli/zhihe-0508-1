class TypeWriter {
    constructor() {
        this.typingElement = document.getElementById('typing-text');
        this.cursorElement = document.getElementById('cursor');
        this.textInput = document.getElementById('text-input');
        this.speedRange = document.getElementById('speed-range');
        this.speedValue = document.getElementById('speed-value');
        this.pauseRange = document.getElementById('pause-range');
        this.pauseValue = document.getElementById('pause-value');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.codeSection = document.getElementById('code-section');
        this.codeOutput = document.getElementById('code-output');
        this.cursorBtns = document.querySelectorAll('.cursor-btn');

        this.texts = [];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.typingSpeed = 100;
        this.pauseTime = 2000;
        this.cursorStyle = 'cursor-style-1';
        this.isTyping = false;
        this.isPaused = false;
        this.isDeleting = false;
        this.timer = null;

        this.init();
    }

    init() {
        this.loadTexts();
        this.bindEvents();
        this.start();
    }

    loadTexts() {
        const inputText = this.textInput.value;
        this.texts = inputText.split('\n').filter(text => text.trim() !== '');
    }

    bindEvents() {
        this.speedRange.addEventListener('input', (e) => {
            this.typingSpeed = parseInt(e.target.value);
            this.speedValue.textContent = this.typingSpeed;
        });

        this.pauseRange.addEventListener('input', (e) => {
            this.pauseTime = parseInt(e.target.value);
            this.pauseValue.textContent = this.pauseTime;
        });

        this.textInput.addEventListener('change', () => {
            this.loadTexts();
            this.reset();
        });

        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.exportBtn.addEventListener('click', () => this.exportCode());
        this.copyBtn.addEventListener('click', () => this.copyCode());

        this.cursorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cursorBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const style = e.target.dataset.style;
                this.cursorStyle = style;
                this.cursorElement.className = style;
            });
        });
    }

    exportCode() {
        this.loadTexts();
        const code = this.generateCode();
        this.codeOutput.textContent = code;
        this.codeSection.style.display = 'block';
    }

    generateCode() {
        const textsStr = JSON.stringify(this.texts, null, 8).replace(/\n/g, '\n        ');
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>打字机特效</title>
    <style>
        .typing-container {
            display: inline-block;
            font-size: 2rem;
            font-weight: 500;
            color: #333;
            line-height: 1.5;
        }
        
        #typing-text {
            display: inline;
        }
        
        #cursor {
            display: inline-block;
            font-weight: bold;
            animation: blink 1s infinite;
        }
        
        #cursor::before {
            display: inline-block;
        }
        
        .cursor-style-1::before {
            color: #667eea;
            content: '|';
        }
        
        .cursor-style-2::before {
            color: #764ba2;
            content: '_';
            position: relative;
            top: -5px;
        }
        
        .cursor-style-3::before {
            content: '';
            width: 12px;
            height: 12px;
            background: #667eea;
            border-radius: 50%;
            margin-left: 5px;
            vertical-align: middle;
        }
        
        .cursor-style-4::before {
            color: #667eea;
            content: '▋';
        }
        
        .cursor-style-none {
            display: none !important;
        }
        
        @keyframes blink {
            0%, 50% {
                opacity: 1;
            }
            51%, 100% {
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div class="typing-container">
        <span id="typing-text"></span>
        <span id="cursor" class="${this.cursorStyle}"></span>
    </div>

    <script>
        class TypeWriter {
            constructor(options) {
                this.typingElement = document.getElementById('typing-text');
                this.cursorElement = document.getElementById('cursor');
                this.texts = options.texts || [];
                this.typingSpeed = options.typingSpeed || 100;
                this.pauseTime = options.pauseTime || 2000;
                this.currentTextIndex = 0;
                this.currentCharIndex = 0;
                this.isDeleting = false;
                this.timer = null;
                
                this.type();
            }

            type() {
                const currentText = this.texts[this.currentTextIndex];
                
                if (!this.isDeleting) {
                    if (this.currentCharIndex < currentText.length) {
                        this.typingElement.textContent += currentText.charAt(this.currentCharIndex);
                        this.currentCharIndex++;
                        this.timer = setTimeout(() => this.type(), this.typingSpeed);
                    } else {
                        this.isDeleting = true;
                        this.timer = setTimeout(() => this.type(), this.pauseTime);
                    }
                } else {
                    if (this.currentCharIndex > 0) {
                        this.typingElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
                        this.currentCharIndex--;
                        this.timer = setTimeout(() => this.type(), this.typingSpeed / 2);
                    } else {
                        this.isDeleting = false;
                        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                        this.timer = setTimeout(() => this.type(), 500);
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new TypeWriter({
                texts: ${textsStr},
                typingSpeed: ${this.typingSpeed},
                pauseTime: ${this.pauseTime}
            });
        });
    </script>
</body>
</html>`;
    }

    async copyCode() {
        try {
            await navigator.clipboard.writeText(this.codeOutput.textContent);
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '已复制!';
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            alert('复制失败，请手动复制');
        }
    }

    type() {
        if (this.isPaused) return;

        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting) {
            if (this.currentCharIndex < currentText.length) {
                this.typingElement.textContent += currentText.charAt(this.currentCharIndex);
                this.currentCharIndex++;
                this.timer = setTimeout(() => this.type(), this.typingSpeed);
            } else {
                this.isDeleting = true;
                this.timer = setTimeout(() => this.type(), this.pauseTime);
            }
        } else {
            if (this.currentCharIndex > 0) {
                this.typingElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                this.timer = setTimeout(() => this.type(), this.typingSpeed / 2);
            } else {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.timer = setTimeout(() => this.type(), 500);
            }
        }
    }

    start() {
        if (this.isTyping && !this.isPaused) return;
        if (this.texts.length === 0) {
            this.loadTexts();
            if (this.texts.length === 0) return;
        }
        
        this.isTyping = true;
        this.isPaused = false;
        this.startBtn.textContent = '播放中';
        this.pauseBtn.textContent = '暂停';
        this.type();
    }

    togglePause() {
        if (!this.isTyping) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseBtn.textContent = '继续';
            clearTimeout(this.timer);
        } else {
            this.pauseBtn.textContent = '暂停';
            this.type();
        }
    }

    reset() {
        clearTimeout(this.timer);
        this.typingElement.textContent = '';
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isTyping = false;
        this.isPaused = false;
        this.isDeleting = false;
        this.startBtn.textContent = '开始';
        this.pauseBtn.textContent = '暂停';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TypeWriter();
});
