<template>
  <div class="task-category">
    <div class="category-header" :style="{ borderLeftColor: category.color }">
      <span class="category-icon">{{ category.icon }}</span>
      <h3 class="category-name">{{ category.name }}</h3>
      <span class="progress-text">{{ completedCount }}/{{ category.tasks.length }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ 
          width: progressPercentage + '%',
          backgroundColor: category.color 
        }"
      ></div>
    </div>
    <div class="tasks-list">
      <TaskItem 
        v-for="task in category.tasks" 
        :key="task.id" 
        :task="task" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const completedCount = computed(() => {
  return props.category.tasks.filter(task => task.completed).length
})

const progressPercentage = computed(() => {
  if (props.category.tasks.length === 0) return 0
  return (completedCount.value / props.category.tasks.length) * 100
})
</script>

<style scoped>
.task-category {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.task-category:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid;
}

.category-icon {
  font-size: 28px;
  margin-right: 12px;
}

.category-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.tasks-list {
  max-height: 400px;
  overflow-y: auto;
}

.tasks-list::-webkit-scrollbar {
  width: 6px;
}

.tasks-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tasks-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tasks-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
