<script setup>
import { ref, computed } from 'vue';
import { coffeeRecipes } from './data/coffeeRecipes.js';
import CoffeeCard from './components/CoffeeCard.vue';
import CoffeeModal from './components/CoffeeModal.vue';
import CoffeeFilter from './components/CoffeeFilter.vue';

const showModal = ref(false);
const selectedCoffee = ref(null);
const searchText = ref('');
const selectedCategory = ref('all');

const filteredCoffees = computed(() => {
  let result = coffeeRecipes;
  
  // 按搜索文本过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(coffee => 
      coffee.name.toLowerCase().includes(searchLower) ||
      coffee.englishName.toLowerCase().includes(searchLower) ||
      coffee.description.toLowerCase().includes(searchLower)
    );
  }
  
  // 按难度分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(coffee => coffee.difficulty === selectedCategory.value);
  }
  
  return result;
});

const handleCardClick = (coffee) => {
  selectedCoffee.value = coffee;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1 class="title">☕ 咖啡配方手册</h1>
        <p class="subtitle">探索各种咖啡的完美比例和制作方法</p>
      </div>
    </header>
    
    <main class="main-content">
      <CoffeeFilter 
        v-model="searchText"
        v-model:category="selectedCategory"
      />
      
      <div v-if="filteredCoffees.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">没有找到匹配的咖啡</h3>
        <p class="empty-desc">试试其他搜索关键词或切换分类</p>
      </div>
      
      <div v-else class="results-info">
        共找到 <span class="results-count">{{ filteredCoffees.length }}</span> 款咖啡
      </div>
      
      <div class="coffee-grid">
        <CoffeeCard 
          v-for="coffee in filteredCoffees" 
          :key="coffee.id" 
          :coffee="coffee"
          @click="handleCardClick"
        />
      </div>
    </main>
    
    <footer class="footer">
      <p>© 2024 咖啡配方手册 | 用心制作每一杯咖啡</p>
    </footer>
    
    <CoffeeModal 
      v-if="showModal && selectedCoffee"
      :show="showModal"
      :coffee="selectedCoffee"
      @close="closeModal"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.3);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  font-weight: 300;
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.results-info {
  text-align: center;
  margin-bottom: 24px;
  font-size: 15px;
  color: #78350f;
}

.results-count {
  font-weight: 700;
  font-size: 18px;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 15px;
  color: #6b7280;
}

.coffee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.footer {
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  color: white;
  text-align: center;
  padding: 24px;
  font-size: 14px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .coffee-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    padding: 40px 20px;
  }
  
  .empty-state {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 26px;
  }
  
  .main-content {
    padding: 20px 16px;
  }
}
</style>
