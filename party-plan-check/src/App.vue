<template>
  <div class="app">
    <header class="header">
      <h1 class="title">🎉 派对筹备清单</h1>
      <p class="subtitle">让你的派对完美无缺</p>
      <div class="overall-progress">
        <div class="progress-info">
          <span class="progress-label">总体进度</span>
          <span class="progress-value">{{ overallPercentage }}%</span>
        </div>
        <div class="progress-bar-large">
          <div 
            class="progress-fill-large" 
            :style="{ width: overallPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-stats">
          <span>已完成: {{ totalCompleted }} / {{ totalTasks }} 项</span>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <div class="categories-grid">
        <TaskCategory 
          v-for="category in categories" 
          :key="category.id" 
          :category="category" 
        />
      </div>
    </main>
    
    <footer class="footer">
      <p v-if="overallPercentage === 100" class="congrats">
        🎊 太棒了！所有准备工作都完成了，祝你派对愉快！🎊
      </p>
      <p v-else class="encouragement">
        继续加油，还有 {{ totalTasks - totalCompleted }} 项任务待完成 💪
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TaskCategory from './components/TaskCategory.vue'
import { partyTasks } from './data/partyTasks.js'

const STORAGE_KEY = 'party-plan-check-data'

const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return partyTasks
    }
  }
  return partyTasks
}

const categories = ref(loadData())

const totalTasks = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.tasks.length, 0)
})

const totalCompleted = computed(() => {
  return categories.value.reduce((sum, cat) => {
    return sum + cat.tasks.filter(task => task.completed).length
  }, 0)
})

const overallPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((totalCompleted.value / totalTasks.value) * 100)
})

watch(categories, (newValue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
}, { deep: true })
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.overall-progress {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px 32px;
  max-width: 600px;
  margin: 0 auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 16px;
  font-weight: 500;
}

.progress-value {
  font-size: 24px;
  font-weight: 700;
}

.progress-bar-large {
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 8px;
  transition: width 0.5s ease;
}

.progress-stats {
  font-size: 14px;
  opacity: 0.9;
}

.main-content {
  padding: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.footer {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.congrats {
  font-size: 20px;
  font-weight: 600;
  animation: bounce 1s ease infinite;
}

.encouragement {
  font-size: 16px;
  opacity: 0.9;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
