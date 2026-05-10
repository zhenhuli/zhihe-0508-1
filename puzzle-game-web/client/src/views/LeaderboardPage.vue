<template>
  <div class="leaderboard-page">
    <div class="leaderboard-container">
      <h2>🏆 排行榜</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label>难度筛选</label>
          <select v-model="filterDifficulty" @change="loadLeaderboard">
            <option value="">全部难度</option>
            <option v-for="diff in difficulties" :key="diff.id" :value="diff.id">
              {{ diff.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>图片筛选</label>
          <select v-model="filterImageId" @change="loadLeaderboard">
            <option value="">全部图片</option>
            <option v-for="img in images" :key="img.id" :value="img.id">
              {{ img.name }}
            </option>
          </select>
        </div>
        
        <button class="refresh-btn" @click="loadLeaderboard">🔄 刷新</button>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="leaderboard.length === 0" class="empty">
        <p>暂无记录</p>
        <p>完成游戏后可以提交成绩到排行榜</p>
      </div>

      <div v-else class="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>玩家</th>
              <th>步数</th>
              <th>用时</th>
              <th>难度</th>
              <th>图片</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in leaderboard" :key="record.id" :class="getRowClass(index)">
              <td class="rank">
                <span v-if="index === 0" class="medal gold">🥇</span>
                <span v-else-if="index === 1" class="medal silver">🥈</span>
                <span v-else-if="index === 2" class="medal bronze">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </td>
              <td class="name">{{ record.name }}</td>
              <td class="steps">{{ record.steps }}</td>
              <td class="time">{{ formatTime(record.time) }}</td>
              <td class="difficulty">
                <span :class="['diff-badge', record.difficulty]">
                  {{ getDifficultyName(record.difficulty) }}
                </span>
              </td>
              <td class="image">{{ record.imageName || record.imageId }}</td>
              <td class="created">{{ formatDate(record.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { images, difficulties } from '../data/images.js'
import { getLeaderboard } from '../services/api.js'

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

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

function getRowClass(index) {
  if (index === 0) return 'gold-row'
  if (index === 1) return 'silver-row'
  if (index === 2) return 'bronze-row'
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

onMounted(() => {
  loadLeaderboard()
})
</script>

<style scoped>
.leaderboard-page {
  max-width: 1000px;
  margin: 0 auto;
}

.leaderboard-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.leaderboard-container h2 {
  margin-top: 0;
  color: #667eea;
  text-align: center;
  font-size: 1.8rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 120px;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.empty p {
  margin: 0.5rem 0;
}

.leaderboard-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  color: #555;
  font-weight: 600;
}

.gold-row {
  background: #fff9e6;
}

.silver-row {
  background: #f5f5f5;
}

.bronze-row {
  background: #faf0e6;
}

.rank {
  font-weight: bold;
}

.medal {
  font-size: 1.2rem;
}

.name {
  font-weight: 500;
  color: #333;
}

.steps, .time {
  font-weight: 600;
  color: #667eea;
}

.diff-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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

.image {
  color: #666;
  font-size: 0.9rem;
}

.created {
  color: #999;
  font-size: 0.85rem;
}
</style>
