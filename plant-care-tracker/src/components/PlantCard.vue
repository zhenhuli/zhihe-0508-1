<template>
  <div class="card" :class="{ 'reminder-warning': needsAttention }">
    <div class="card-image">
      <figure class="image is-4by3">
        <img
          :src="plant.image || defaultPlantImage"
          :alt="plant.name"
          class="has-background-light"
          style="object-fit: cover;"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-5 is-6-mobile">{{ plant.name }}</p>
          <p class="subtitle is-7 has-text-grey">
            {{ plant.species || '未知品种' }}
          </p>
        </div>
        <div class="media-right">
          <button
            class="delete is-medium"
            @click="confirmDelete"
          ></button>
        </div>
      </div>

      <div class="content">
        <div class="columns is-multiline is-mobile is-gapless">
          <div class="column is-6 pr-1">
            <div class="notification is-info is-light p-2">
              <div class="icon-text">
                <span class="icon is-small has-text-info">
                  <i class="fas fa-tint"></i>
                </span>
                <span class="is-size-7">
                  <strong>浇水</strong>
                </span>
              </div>
              <p class="mt-1 mb-0 is-size-7">
                {{ daysUntilWater === 0
                  ? '今天需要浇水！'
                  : `${daysUntilWater} 天后`
                }}
              </p>
              <p class="is-size-7 has-text-grey">
                间隔: {{ plant.wateringInterval }} 天
              </p>
            </div>
          </div>
          <div class="column is-6 pl-1">
            <div class="notification is-warning is-light p-2">
              <div class="icon-text">
                <span class="icon is-small has-text-warning">
                  <i class="fas fa-seedling"></i>
                </span>
                <span class="is-size-7">
                  <strong>施肥</strong>
                </span>
              </div>
              <p class="mt-1 mb-0 is-size-7">
                {{ daysUntilFertilizer === 0
                  ? '今天需要施肥！'
                  : `${daysUntilFertilizer} 天后`
                }}
              </p>
              <p class="is-size-7 has-text-grey">
                间隔: {{ plant.fertilizingInterval }} 天
              </p>
            </div>
          </div>
        </div>

        <div v-if="plant.notes" class="mb-3">
          <p class="is-size-7 has-text-grey">
            <span class="icon has-text-grey is-small">
              <i class="fas fa-sticky-note"></i>
            </span>
            {{ plant.notes }}
          </p>
        </div>

        <div class="buttons is-centered are-small mb-3">
          <button
            class="button is-info"
            @click="recordWatering"
          >
            <span class="icon is-small">
              <i class="fas fa-tint"></i>
            </span>
            <span>浇水</span>
          </button>
          <button
            class="button is-warning"
            @click="recordFertilizing"
          >
            <span class="icon is-small">
              <i class="fas fa-seedling"></i>
            </span>
            <span>施肥</span>
          </button>
        </div>

        <div class="tabs is-toggle is-fullwidth is-small">
          <ul>
            <li :class="{ 'is-active': activeTab === 'watering' }">
              <a @click="activeTab = 'watering'">
                <span class="icon is-small"><i class="fas fa-tint"></i></span>
                <span>浇水 ({{ plant.wateringHistory.length }})</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'fertilizing' }">
              <a @click="activeTab = 'fertilizing'">
                <span class="icon is-small"><i class="fas fa-seedling"></i></span>
                <span>施肥 ({{ plant.fertilizingHistory.length }})</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="content is-small">
          <div v-if="activeTab === 'watering'">
            <div v-if="plant.wateringHistory.length === 0" class="has-text-grey has-text-centered py-3 is-size-7">
              暂无浇水记录
            </div>
            <ul v-else class="is-size-7">
              <li v-for="(record, index) in recentWatering" :key="index">
                {{ formatDate(record.date) }}
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'fertilizing'">
            <div v-if="plant.fertilizingHistory.length === 0" class="has-text-grey has-text-centered py-3 is-size-7">
              暂无施肥记录
            </div>
            <ul v-else class="is-size-7">
              <li v-for="(record, index) in recentFertilizing" :key="index">
                {{ formatDate(record.date) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlantStore } from '../stores/plantStore'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
})

const { recordWatering, recordFertilizing, deletePlant, getDaysUntilNextWatering, getDaysUntilNextFertilizing } = usePlantStore()

const activeTab = ref('watering')

const defaultPlantImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM0OGM3NzQiPjxwYXRoIGQ9Ik0xMiAyTDIgMTJIMTVWMjJIMTlWMTJIMjJMMTIgMloiLz48L3N2Zz4='

const daysUntilWater = computed(() => getDaysUntilNextWatering(props.plant))
const daysUntilFertilizer = computed(() => getDaysUntilNextFertilizing(props.plant))

const needsAttention = computed(() => {
  return daysUntilWater.value === 0 || daysUntilFertilizer.value === 0
})

const recentWatering = computed(() => {
  return [...props.plant.wateringHistory].reverse().slice(0, 5)
})

const recentFertilizing = computed(() => {
  return [...props.plant.fertilizingHistory].reverse().slice(0, 5)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const confirmDelete = () => {
  if (confirm(`确定要删除植物 "${props.plant.name}" 吗？`)) {
    deletePlant(props.plant.id)
  }
}
</script>

<style scoped>
.title.is-6-mobile {
  font-size: 1.1rem;
}

@media screen and (max-width: 768px) {
  .title.is-6-mobile {
    font-size: 1rem;
  }

  .buttons.are-small .button {
    padding-left: 0.8em;
    padding-right: 0.8em;
  }

  .columns.is-gapless .pr-1 {
    padding-right: 0.25rem;
  }

  .columns.is-gapless .pl-1 {
    padding-left: 0.25rem;
  }
}

@media screen and (max-width: 480px) {
  .title.is-6-mobile {
    font-size: 0.95rem;
  }

  .media {
    align-items: center;
  }

  .media-right {
    margin-left: 0.5rem;
  }

  .buttons.are-small .button {
    flex: 1;
    padding-left: 0.5em;
    padding-right: 0.5em;
    font-size: 0.8rem;
  }

  .buttons.are-small .button span:not(.icon) {
    display: none;
  }

  .buttons.are-small .button .icon {
    margin-right: 0;
  }

  .tabs.is-small a {
    padding: 0.3em 0.5em;
    font-size: 0.75rem;
  }

  .tabs.is-small a span:not(.icon) {
    display: none;
  }

  .tabs.is-small a .icon {
    margin-right: 0;
  }
}
</style>
