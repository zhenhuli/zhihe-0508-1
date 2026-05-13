<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-button" @click="close">×</button>
        
        <div class="modal-header">
          <div class="coffee-image">
            <img :src="coffee.image" :alt="coffee.name" />
            <div class="difficulty-badge" :class="getDifficultyClass(coffee.difficulty)">
              {{ coffee.difficulty }}
            </div>
          </div>
          <div class="coffee-info">
            <h2 class="coffee-name">{{ coffee.name }}</h2>
            <p class="coffee-english">{{ coffee.englishName }}</p>
            <p class="coffee-description">{{ coffee.description }}</p>
            <div class="coffee-meta">
              <span class="meta-item">⏱️ {{ coffee.time }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="section">
            <h4>📊 配方比例</h4>
            <div class="ratio-container">
              <div v-for="(value, key) in coffee.ratio" :key="key" class="ratio-item">
                <span class="ratio-label">{{ getRatioLabel(key) }}</span>
                <span class="ratio-value">{{ value }}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h4>🥛 配料</h4>
            <ul class="ingredients-list">
              <li v-for="ingredient in coffee.ingredients" :key="ingredient.name">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-amount">{{ ingredient.amount }}</span>
              </li>
            </ul>
          </div>
          
          <div class="section">
            <h4>📝 制作步骤</h4>
            <ol class="steps-list">
              <li v-for="(step, index) in coffee.steps" :key="index">{{ step }}</li>
            </ol>
          </div>
          
          <div class="section">
            <h4>🛠️ 推荐器具</h4>
            <div class="tools-container">
              <span v-for="tool in coffee.tools" :key="tool" class="tool-tag">{{ tool }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  coffee: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const getRatioLabel = (key) => {
  const labels = {
    espresso: '浓缩咖啡',
    milk: '牛奶',
    foam: '奶泡',
    hotWater: '热水',
    chocolate: '巧克力'
  };
  return labels[key] || key;
};

const getDifficultyClass = (difficulty) => {
  const classes = {
    '简单': 'easy',
    '中等': 'medium',
    '较难': 'hard'
  };
  return classes[difficulty] || 'medium';
};
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-button:hover {
  background: white;
  color: #1f2937;
  transform: scale(1.1);
}

.modal-header {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.modal-header .coffee-image {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.modal-header .coffee-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-header .difficulty-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.modal-header .difficulty-badge.easy {
  background: linear-gradient(135deg, #4ade80, #22c55e);
}

.modal-header .difficulty-badge.medium {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.modal-header .difficulty-badge.hard {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.modal-header .coffee-info {
  flex: 1;
}

.modal-header .coffee-name {
  font-size: 28px;
  font-weight: 700;
  color: #78350f;
  margin: 0 0 4px 0;
}

.modal-header .coffee-english {
  font-size: 14px;
  color: #92400e;
  margin: 0 0 12px 0;
  font-style: italic;
}

.modal-header .coffee-description {
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.modal-header .coffee-meta {
  display: flex;
  gap: 16px;
}

.modal-header .meta-item {
  font-size: 13px;
  color: #78350f;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 8px;
}

.modal-body {
  padding: 24px;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.ratio-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ratio-item {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ratio-label {
  font-size: 12px;
  color: #92400e;
}

.ratio-value {
  font-size: 14px;
  font-weight: 600;
  color: #78350f;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.ingredients-list li:last-child {
  border-bottom: none;
}

.ingredient-name {
  color: #4b5563;
}

.ingredient-amount {
  font-weight: 600;
  color: #92400e;
}

.steps-list {
  padding-left: 20px;
  margin: 0;
}

.steps-list li {
  padding: 8px 0;
  color: #4b5563;
  line-height: 1.6;
}

.tools-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-tag {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .modal-header .coffee-image {
    width: 100%;
    height: 140px;
  }
  
  .modal-header .coffee-name {
    font-size: 24px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>
