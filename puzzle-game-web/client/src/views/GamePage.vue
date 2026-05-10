<template>
  <div class="game-page">
    <div v-if="step === 1" class="step-container">
      <div class="step-header">
        <div class="step-indicator">
          <div class="step-dot active">1</div>
          <div class="step-line"></div>
          <div class="step-dot">2</div>
          <div class="step-line"></div>
          <div class="step-dot">3</div>
        </div>
        <h2 class="step-title">选择图片</h2>
        <p class="step-desc">请选择一张你喜欢的风景图片</p>
      </div>
      
      <div class="image-grid">
        <div
          v-for="img in images"
          :key="img.id"
          :class="['image-card', { selected: selectedImage.id === img.id }]"
          @click="selectImage(img)"
        >
          <div class="image-wrapper">
            <img :src="img.url" :alt="img.name" />
            <div v-if="selectedImage.id === img.id" class="check-mark">✓</div>
          </div>
          <span class="image-name">{{ img.name }}</span>
        </div>
      </div>
      
      <div class="bottom-actions">
        <button class="next-btn" @click="goToStep(2)" :disabled="!selectedImage">
          下一步
        </button>
      </div>
    </div>

    <div v-if="step === 2" class="step-container">
      <div class="step-header">
        <div class="step-indicator">
          <div class="step-dot active done">1</div>
          <div class="step-line active"></div>
          <div class="step-dot active">2</div>
          <div class="step-line"></div>
          <div class="step-dot">3</div>
        </div>
        <h2 class="step-title">选择难度</h2>
        <p class="step-desc">请选择游戏难度</p>
      </div>

      <div class="selected-preview">
        <img :src="selectedImage.url" class="preview-img" />
        <span class="preview-label">已选：{{ selectedImage.name }}</span>
        <button class="change-btn" @click="goToStep(1)">更换</button>
      </div>
      
      <div class="difficulty-list">
        <div
          v-for="diff in difficulties"
          :key="diff.id"
          :class="['diff-card', { selected: selectedDifficulty.id === diff.id }]"
          @click="selectedDifficulty = diff"
        >
          <div class="diff-icon">
            <span v-if="diff.id === 'easy'">😊</span>
            <span v-else-if="diff.id === 'medium'">🤔</span>
            <span v-else>😈</span>
          </div>
          <div class="diff-info">
            <div class="diff-name">{{ diff.name }}</div>
            <div class="diff-desc">{{ diff.description }}</div>
          </div>
          <div v-if="selectedDifficulty.id === diff.id" class="check-circle">✓</div>
        </div>
      </div>
      
      <div class="bottom-actions">
        <button class="back-btn" @click="goToStep(1)">上一步</button>
        <button class="start-btn" @click="startGame" :disabled="!selectedDifficulty">
          开始游戏
        </button>
      </div>
    </div>

    <div v-if="step === 3" class="game-container">
      <div class="game-header">
        <div class="step-indicator">
          <div class="step-dot active done">1</div>
          <div class="step-line active"></div>
          <div class="step-dot active done">2</div>
          <div class="step-line active"></div>
          <div class="step-dot active">3</div>
        </div>
        
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">图片</span>
            <span class="info-value">{{ selectedImage.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">难度</span>
            <span :class="['info-value', 'diff-badge', selectedDifficulty.id]">
              {{ selectedDifficulty.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-icon">👣</span>
          <div class="stat-content">
            <span class="stat-value">{{ moves }}</span>
            <span class="stat-label">步数</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-icon">⏱️</span>
          <div class="stat-content">
            <span class="stat-value">{{ formattedTime }}</span>
            <span class="stat-label">用时</span>
          </div>
        </div>
      </div>

      <div class="puzzle-wrapper">
        <div class="puzzle-container">
          <div
            class="puzzle-grid"
            :style="gridStyle"
            @dragover.prevent
            @drop="handleDrop(-1)"
          >
            <div
              v-for="(piece, index) in puzzlePieces"
              :key="piece.id"
              :class="['puzzle-piece', { dragging: draggedPiece === piece.id, correct: isPieceCorrect(index) }]"
              :style="getPieceStyle(piece)"
              draggable="true"
              @dragstart="handleDragStart(piece, index)"
              @dragover.prevent
              @drop.stop="handleDrop(index)"
            >
              <div class="piece-content" :style="getPieceBackground(piece)">
                <span class="piece-number" v-if="showNumbers">{{ piece.originalIndex + 1 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-controls">
        <button class="control-btn secondary" @click="showNumbers = !showNumbers">
          {{ showNumbers ? '隐藏数字' : '显示数字' }}
        </button>
      </div>

      <div class="bottom-actions game-actions">
        <button class="action-btn secondary" @click="restartGame">
          <span>🔄</span>
          <span>重玩</span>
        </button>
        <button class="action-btn danger" @click="confirmExit">
          <span>🏠</span>
          <span>退出</span>
        </button>
      </div>
    </div>

    <div v-if="showWinModal" class="modal-overlay" @click.self="showWinModal = false">
      <div class="modal-content win-modal">
        <div class="win-icon">🎉</div>
        <h2 class="win-title">恭喜完成！</h2>
        
        <div class="win-stats">
          <div class="win-stat">
            <span class="win-stat-label">步数</span>
            <span class="win-stat-value">{{ moves }}</span>
          </div>
          <div class="win-stat">
            <span class="win-stat-label">用时</span>
            <span class="win-stat-value">{{ formattedTime }}</span>
          </div>
        </div>

        <div class="name-section">
          <label class="name-label">输入你的名字：</label>
          <input 
            v-model="playerName" 
            type="text" 
            maxlength="20" 
            placeholder="请输入名字"
            class="name-input"
          />
        </div>

        <div class="win-buttons">
          <button class="win-btn submit" @click="submitScore" :disabled="!playerName.trim()">
            提交成绩
          </button>
          <button class="win-btn replay" @click="restartGame">
            再玩一次
          </button>
          <button class="win-btn home" @click="goHome">
            返回首页
          </button>
        </div>
      </div>
    </div>

    <div v-if="showExitConfirm" class="modal-overlay" @click.self="showExitConfirm = false">
      <div class="modal-content confirm-modal">
        <h3 class="confirm-title">确认退出？</h3>
        <p class="confirm-desc">退出后当前游戏进度将丢失</p>
        <div class="confirm-buttons">
          <button class="confirm-btn cancel" @click="showExitConfirm = false">
            继续游戏
          </button>
          <button class="confirm-btn ok" @click="goHome">
            确认退出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { images, difficulties } from '../data/images.js'
import { submitRecord } from '../services/api.js'

const step = ref(1)
const selectedImage = ref(images[0])
const selectedDifficulty = ref(null)
const gameStarted = ref(false)
const puzzlePieces = ref([])
const moves = ref(0)
const elapsedTime = ref(0)
const timerInterval = ref(null)
const draggedPiece = ref(null)
const draggedIndex = ref(-1)
const showNumbers = ref(false)
const showWinModal = ref(false)
const showExitConfirm = ref(false)
const playerName = ref('')

const GRID_TOTAL = 340
const GAP_SIZE = 2

const gridSize = computed(() => selectedDifficulty.value?.grid || 3)
const totalPieces = computed(() => gridSize.value * gridSize.value)

const pieceSize = computed(() => {
  const grid = gridSize.value
  return (GRID_TOTAL - (grid - 1) * GAP_SIZE) / grid
})

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
  gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
  gap: `${GAP_SIZE}px`,
  width: `${GRID_TOTAL}px`,
  height: `${GRID_TOTAL}px`
}))

function goToStep(s) {
  step.value = s
}

function selectImage(img) {
  selectedImage.value = img
}

function startGame() {
  if (!selectedDifficulty.value) return
  
  step.value = 3
  gameStarted.value = true
  moves.value = 0
  elapsedTime.value = 0
  
  const pieces = []
  for (let i = 0; i < totalPieces.value; i++) {
    pieces.push({
      id: i,
      originalIndex: i,
      currentIndex: i
    })
  }
  
  shufflePieces(pieces)
  puzzlePieces.value = pieces
  
  timerInterval.value = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function shufflePieces(pieces) {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = pieces[i].originalIndex
    pieces[i].originalIndex = pieces[j].originalIndex
    pieces[j].originalIndex = temp
    pieces[i].id = pieces[i].originalIndex
    pieces[j].id = pieces[j].originalIndex
  }
  
  if (!isSolvable(pieces)) {
    if (pieces.length >= 2) {
      const temp = pieces[0].originalIndex
      pieces[0].originalIndex = pieces[1].originalIndex
      pieces[1].originalIndex = temp
      pieces[0].id = pieces[0].originalIndex
      pieces[1].id = pieces[1].originalIndex
    }
  }
}

function isSolvable(pieces) {
  let inversions = 0
  const values = pieces.map(p => p.originalIndex)
  
  for (let i = 0; i < values.length - 1; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] > values[j]) {
        inversions++
      }
    }
  }
  
  if (gridSize.value % 2 === 1) {
    return inversions % 2 === 0
  } else {
    const rowFromBottom = gridSize.value - Math.floor(pieces.findIndex(p => p.originalIndex === pieces.length - 1) / gridSize.value)
    return (inversions + rowFromBottom) % 2 === 0
  }
}

function handleDragStart(piece, index) {
  draggedPiece.value = piece.id
  draggedIndex.value = index
}

function handleDrop(index) {
  if (draggedIndex.value === -1 || draggedIndex.value === index) {
    draggedPiece.value = null
    draggedIndex.value = -1
    return
  }
  
  const pieces = [...puzzlePieces.value]
  const fromIdx = draggedIndex.value
  const toIdx = index
  
  const temp = pieces[fromIdx].originalIndex
  pieces[fromIdx].originalIndex = pieces[toIdx].originalIndex
  pieces[toIdx].originalIndex = temp
  
  pieces[fromIdx].id = pieces[fromIdx].originalIndex
  pieces[toIdx].id = pieces[toIdx].originalIndex
  
  pieces[fromIdx].currentIndex = fromIdx
  pieces[toIdx].currentIndex = toIdx
  
  puzzlePieces.value = pieces
  moves.value++
  
  if (checkWin()) {
    endGame()
  }
  
  draggedPiece.value = null
  draggedIndex.value = -1
}

function isPieceCorrect(index) {
  return puzzlePieces.value[index].originalIndex === index
}

function checkWin() {
  return puzzlePieces.value.every((piece, index) => piece.originalIndex === index)
}

function endGame() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  showWinModal.value = true
}

function getPieceStyle(piece) {
  return {
    cursor: 'move'
  }
}

function getPieceBackground(piece) {
  const grid = gridSize.value
  const pSize = pieceSize.value
  const originalRow = Math.floor(piece.originalIndex / grid)
  const originalCol = piece.originalIndex % grid
  
  return {
    backgroundImage: `url(${selectedImage.value.url})`,
    backgroundSize: `${GRID_TOTAL + (grid - 1) * GAP_SIZE}px ${GRID_TOTAL + (grid - 1) * GAP_SIZE}px`,
    backgroundPosition: `-${originalCol * (pSize + GAP_SIZE)}px -${originalRow * (pSize + GAP_SIZE)}px`,
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%'
  }
}

function restartGame() {
  showWinModal.value = false
  showExitConfirm.value = false
  playerName.value = ''
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  gameStarted.value = false
  puzzlePieces.value = []
  moves.value = 0
  elapsedTime.value = 0
  
  startGame()
}

function confirmExit() {
  showExitConfirm.value = true
}

function goHome() {
  showWinModal.value = false
  showExitConfirm.value = false
  playerName.value = ''
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  step.value = 1
  selectedDifficulty.value = null
  gameStarted.value = false
  puzzlePieces.value = []
  moves.value = 0
  elapsedTime.value = 0
}

async function submitScore() {
  if (!playerName.value.trim()) return
  
  try {
    await submitRecord({
      name: playerName.value,
      steps: moves.value,
      time: elapsedTime.value,
      difficulty: selectedDifficulty.value.id,
      imageId: selectedImage.value.id,
      imageName: selectedImage.value.name
    })
    alert('成绩提交成功！')
    showWinModal.value = false
  } catch (error) {
    alert('提交失败，请稍后重试')
  }
}

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped>
.game-page {
  min-height: calc(100vh - 56px);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.step-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.step-header {
  text-align: center;
  margin-bottom: 20px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.step-dot.active {
  background: #07c160;
  color: #fff;
}

.step-dot.done {
  background: #07c160;
  color: #fff;
}

.step-dot.done::after {
  content: '✓';
}

.step-line {
  width: 40px;
  height: 3px;
  background: #e0e0e0;
  margin: 0 8px;
  transition: all 0.3s;
}

.step-line.active {
  background: #07c160;
}

.step-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.step-desc {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}

.image-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.image-card.selected {
  border-color: #07c160;
  background: #f0fff4;
}

.image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.check-mark {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: #07c160;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.image-name {
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.selected-preview {
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
}

.preview-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.preview-label {
  flex: 1;
  margin-left: 12px;
  font-size: 14px;
  color: #666;
}

.change-btn {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #07c160;
  border-radius: 16px;
  color: #07c160;
  font-size: 13px;
  cursor: pointer;
}

.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}

.diff-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.diff-card.selected {
  border-color: #07c160;
  background: #f0fff4;
}

.diff-icon {
  width: 48px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.diff-card.selected .diff-icon {
  background: #e8f5e9;
}

.diff-info {
  flex: 1;
  margin-left: 12px;
}

.diff-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.diff-desc {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

.check-circle {
  width: 24px;
  height: 24px;
  background: #07c160;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.bottom-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.next-btn, .start-btn {
  flex: 1;
  padding: 14px 20px;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn:disabled, .start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-btn {
  padding: 14px 28px;
  background: #f5f5f5;
  border: none;
  border-radius: 24px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.game-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.game-header {
  margin-bottom: 16px;
}

.game-info {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.diff-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.diff-badge.easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.diff-badge.medium {
  background: #fff3e0;
  color: #e65100;
}

.diff-badge.hard {
  background: #ffebee;
  color: #c62828;
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #07c160;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
  margin: 0 30px;
}

.puzzle-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.puzzle-container {
  background: #e0e0e0;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.puzzle-grid {
  background: #333;
  border-radius: 8px;
  overflow: hidden;
}

.puzzle-piece {
  transition: transform 0.2s;
}

.puzzle-piece.dragging {
  opacity: 0.5;
  transform: scale(1.05);
  z-index: 10;
}

.puzzle-piece.correct .piece-content::after {
  content: '✓';
  position: absolute;
  top: 2px;
  right: 4px;
  color: #07c160;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 3px white;
}

.piece-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.piece-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}

.game-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.control-btn {
  padding: 10px 24px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.control-btn.secondary {
  border-color: #07c160;
  color: #07c160;
}

.game-actions {
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  gap: 4px;
}

.action-btn span:first-child {
  font-size: 20px;
}

.action-btn.secondary {
  background: #e8f5e9;
  color: #07c160;
}

.action-btn.danger {
  background: #ffebee;
  color: #e53935;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  overflow: hidden;
}

.win-modal {
  text-align: center;
  padding: 32px 24px;
}

.win-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.win-title {
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.win-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
}

.win-stat {
  display: flex;
  flex-direction: column;
}

.win-stat-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.win-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #07c160;
}

.name-section {
  margin-bottom: 24px;
  text-align: left;
}

.name-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.name-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.name-input:focus {
  border-color: #07c160;
}

.win-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.win-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.win-btn.submit {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
}

.win-btn.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.win-btn.replay {
  background: #e8f5e9;
  color: #07c160;
}

.win-btn.home {
  background: #f5f5f5;
  color: #666;
}

.confirm-modal {
  padding: 24px;
}

.confirm-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.confirm-desc {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #999;
  text-align: center;
}

.confirm-buttons {
  display: flex;
  gap: 12px;
}

.confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn.ok {
  background: #e53935;
  color: #fff;
}
</style>
