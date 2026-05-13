<template>
  <div class="filter-container">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        v-model="searchText"
        placeholder="搜索咖啡名称..."
        class="search-input"
        @input="handleSearch"
      />
      <button v-if="searchText" class="clear-button" @click="clearSearch">×</button>
    </div>
    
    <div class="category-filter">
      <button 
        v-for="category in categories" 
        :key="category.value"
        class="category-button"
        :class="{ active: selectedCategory === category.value }"
        @click="selectCategory(category.value)"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-label">{{ category.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['update:modelValue', 'update:category']);

const searchText = ref(props.modelValue);
const selectedCategory = ref(props.category);

const categories = [
  { value: 'all', label: '全部', icon: '☕' },
  { value: '简单', label: '简单', icon: '🟢' },
  { value: '中等', label: '中等', icon: '🟡' },
  { value: '较难', label: '较难', icon: '🔴' }
];

const handleSearch = () => {
  emit('update:modelValue', searchText.value);
};

const clearSearch = () => {
  searchText.value = '';
  emit('update:modelValue', '');
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  emit('update:category', category);
};
</script>

<style scoped>
.filter-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #92400e;
  box-shadow: 0 0 0 3px rgba(146, 64, 14, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-button {
  position: absolute;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #d1d5db;
  color: #374151;
}

.category-filter {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.category-button.active {
  background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
  border-color: #92400e;
  color: white;
  box-shadow: 0 4px 12px rgba(146, 64, 14, 0.3);
}

.category-icon {
  font-size: 16px;
}

.category-label {
  font-weight: 600;
}

@media (max-width: 600px) {
  .filter-container {
    padding: 16px;
  }
  
  .category-filter {
    gap: 8px;
  }
  
  .category-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
