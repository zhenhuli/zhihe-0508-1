<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePlantStore } from './stores/plantStore'
import AddPlantForm from './components/AddPlantForm.vue'
import PlantCard from './components/PlantCard.vue'
import ReminderPanel from './components/ReminderPanel.vue'
import CareTips from './components/CareTips.vue'

const { plants, loadPlants } = usePlantStore()
const showAddForm = ref(false)
const activeSideTab = ref('reminder')

onMounted(() => {
  loadPlants()
})

const plantCount = computed(() => plants.value.length)
const needsAttentionCount = computed(() => {
  return plants.value.filter(plant => {
    const store = usePlantStore()
    const daysUntilWater = store.getDaysUntilNextWatering(plant)
    const daysUntilFertilizer = store.getDaysUntilNextFertilizing(plant)
    return daysUntilWater === 0 || daysUntilFertilizer === 0
  }).length
})

const handlePlantAdded = () => {
  showAddForm.value = false
}
</script>

<template>
  <div class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered is-mobile is-multiline">
          <div class="column is-12-mobile is-8">
            <h1 class="title is-4-mobile">
              <span class="icon is-small">
                <i class="fas fa-leaf"></i>
              </span>
              植物养护记录
            </h1>
            <h2 class="subtitle is-6">
              记录您的每一株植物，让它们健康成长
            </h2>
          </div>
          <div class="column is-12-mobile is-4">
            <div class="columns is-mobile is-gapless">
              <div class="column">
                <div class="notification is-light has-text-centered mx-1">
                  <p class="heading is-size-7">总数</p>
                  <p class="title is-5">{{ plantCount }}</p>
                </div>
              </div>
              <div class="column">
                <div class="notification is-warning is-light has-text-centered mx-1">
                  <p class="heading is-size-7">待养护</p>
                  <p class="title is-5">{{ needsAttentionCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-12-mobile is-4-tablet is-4-desktop">
          <div class="buttons mb-3">
            <button
              class="button is-success is-fullwidth"
              @click="showAddForm = !showAddForm"
            >
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
              <span>{{ showAddForm ? '收起' : '添加植物' }}</span>
            </button>
          </div>

          <div v-if="showAddForm" class="mb-3">
            <AddPlantForm @added="handlePlantAdded" />
          </div>

          <div class="tabs is-toggle is-fullwidth is-small mb-3">
            <ul>
              <li :class="{ 'is-active': activeSideTab === 'reminder' }">
                <a @click="activeSideTab = 'reminder'">
                  <span class="icon is-small"><i class="fas fa-bell"></i></span>
                  <span>提醒</span>
                </a>
              </li>
              <li :class="{ 'is-active': activeSideTab === 'tips' }">
                <a @click="activeSideTab = 'tips'">
                  <span class="icon is-small"><i class="fas fa-lightbulb"></i></span>
                  <span>贴士</span>
                </a>
              </li>
            </ul>
          </div>

          <ReminderPanel v-if="activeSideTab === 'reminder'" />
          <CareTips v-if="activeSideTab === 'tips'" />
        </div>

        <div class="column is-12-mobile is-8-tablet is-8-desktop">
          <div v-if="plants.length === 0" class="notification is-info is-light has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-seedling fa-3x"></i>
            </span>
            <p class="title is-4 mt-4">还没有添加植物</p>
            <p class="subtitle is-6">点击左侧按钮添加您的第一株植物吧！</p>
          </div>

          <div v-else class="columns is-multiline is-mobile">
            <div
              v-for="plant in plants"
              :key="plant.id"
              class="column is-12-mobile is-6-tablet is-6-desktop"
            >
              <PlantCard :plant="plant" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="content has-text-centered">
      <p class="is-size-7">
        <strong>植物养护记录</strong> - 用心呵护每一株植物
      </p>
      <p class="is-size-7 has-text-grey">
        数据存储于浏览器本地，请定期备份重要数据
      </p>
    </div>
  </footer>
</template>

<style scoped>
.title.is-4-mobile {
  font-size: 1.5rem;
}

.subtitle.is-6 {
  font-size: 0.9rem;
}

@media screen and (max-width: 768px) {
  .title.is-4-mobile {
    font-size: 1.25rem;
  }

  .subtitle.is-6 {
    font-size: 0.8rem;
  }

  .notification .heading {
    font-size: 0.7rem;
  }

  .notification .title.is-5 {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 480px) {
  .title.is-4-mobile {
    font-size: 1.1rem;
  }

  .hero-body {
    padding: 0.75rem;
  }
}
</style>
