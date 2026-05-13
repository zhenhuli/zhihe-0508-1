<template>
  <div class="coffee-card" @click="handleClick">
    <div class="coffee-image">
      <img :src="coffee.image" :alt="coffee.name" />
      <div class="difficulty-badge" :class="getDifficultyClass(coffee.difficulty)">
        {{ coffee.difficulty }}
      </div>
    </div>
    <div class="coffee-content">
      <h3 class="coffee-name">{{ coffee.name }}</h3>
      <p class="coffee-english">{{ coffee.englishName }}</p>
      <p class="coffee-description">{{ coffee.description }}</p>
      <div class="coffee-meta">
        <span class="meta-item">⏱️ {{ coffee.time }}</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="view-details">点击查看详情 →</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  coffee: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.coffee);
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
.coffee-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.coffee-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.coffee-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.coffee-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.coffee-card:hover .coffee-image img {
  transform: scale(1.05);
}

.difficulty-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.difficulty-badge.easy {
  background: linear-gradient(135deg, #4ade80, #22c55e);
}

.difficulty-badge.medium {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.difficulty-badge.hard {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.coffee-content {
  padding: 20px;
  flex: 1;
}

.coffee-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.coffee-english {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  font-style: italic;
}

.coffee-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.coffee-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 8px;
}

.card-footer {
  padding: 12px 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  text-align: center;
}

.view-details {
  font-size: 13px;
  font-weight: 600;
  color: #78350f;
  transition: all 0.3s ease;
}

.coffee-card:hover .view-details {
  color: #92400e;
  letter-spacing: 1px;
}
</style>
