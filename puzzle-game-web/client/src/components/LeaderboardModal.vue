<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>🏆 排行榜</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="filters">
        <select v-model="filterDifficulty" @change="loadLeaderboard" class="filter-select">
          <option value="">全部难度</option>
          <option v-for="diff in difficulties" :key="diff.id" :value="diff.id">
            {{ diff.name }}
          </option>
        </select>
        <select v-model="filterImageId" @change="loadLeaderboard" class="filter-select">
          <option value="">全部图片</option>
          <option v-for="img in images" :key="img.id" :value="img.id">
            {{ img.name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="leaderboard.length === 0" class="empty">
        <p>暂无记录</p>
        <p class="hint">完成游戏后可以提交成绩</p>
      </div>

      <div v-else class="leaderboard-list">
        <div
          v-for="(record, index) in leaderboard"
          :key="record.id"
          :class="['record-item', getRowClass(index)]"
        >
          <div class="rank">
            <span v-if="index === 0" class="medal">🥇</span>
            <span v-else-if="index === 1" class="medal">🥈</span>
            <span v-else-if="index === 2" class="medal">🥉</span>
            <span v-else class="rank-num">{{ index + 1 }}</span>
          </div>
          <div class="info">
            <div class="name">{{ record.name }}</div>
            <div class="meta">
              <span :class="['diff-tag', record.difficulty]">{{ getDifficultyName(record.difficulty) }}</span>
              <span class="image-tag">{{ record.imageName || record.imageId }}</span>
            </div>
          </div>
          <div class="stats">
            <div class="steps">{{ record.steps }} 步</div>
            <div class="time">{{ formatTime(record.time) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { images, difficulties } from '../data/images.js'
import { getLeaderboard } from '../services/api.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const leaderboard = ref([])
const loading = ref(false)
const filterDifficulty = ref('')
const filterImageId = ref('')

function getDifficultyName(diffId) {
  const diff = difficulties.find(d => d.id === diffId)
  return diff ? diff.name : diffId
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getRowClass(index) {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

async function loadLeaderboard() {
  loading.value = true
  try {
    const data = await getLeaderboard(
      filterDifficulty.value || null,
      filterImageId.value || null
    )
    leaderboard.value = data
  } catch (error) {
    console.error('加载排行榜失败:', error)
    leaderboard.value = []
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('close')
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadLeaderboard()
  }
})

onMounted(() => {
  if (props.visible) {
    loadLeaderboard()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #eee;
  color: #666;
}

.filters {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.filter-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  background: #fafafa;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

.loading, .empty {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.empty .hint {
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;
}

.leaderboard-list {
  overflow-y: auto;
  flex: 1;
  padding: 8px 0;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item.gold {
  background: linear-gradient(90deg, #fff9e6 0%, transparent 100%);
}

.record-item.silver {
  background: linear-gradient(90deg, #f5f5f5 0%, transparent 100%);
}

.record-item.bronze {
  background: linear-gradient(90deg, #faf0e6 0%, transparent 100%);
}

.rank {
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.medal {
  font-size: 22px;
}

.rank-num {
  font-size: 16px;
  font-weight: 600;
  color: #999;
}

.info {
  flex: 1;
  min-width: 0;
  margin: 0 12px;
}

.name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.diff-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.diff-tag.easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.diff-tag.medium {
  background: #fff3e0;
  color: #e65100;
}

.diff-tag.hard {
  background: #ffebee;
  color: #c62828;
}

.image-tag {
  font-size: 11px;
  color: #999;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 10px;
}

.stats {
  text-align: right;
  flex-shrink: 0;
}

.steps {
  font-size: 15px;
  font-weight: 600;
  color: #07c160;
}

.time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
</style>
