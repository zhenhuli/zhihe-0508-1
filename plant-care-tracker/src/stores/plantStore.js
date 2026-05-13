import { ref, computed } from 'vue'

const STORAGE_KEY = 'plant-care-data'

const plants = ref([])

export function usePlantStore() {
  const loadPlants = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        plants.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load plants:', e)
      plants.value = []
    }
  }

  const savePlants = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plants.value))
    } catch (e) {
      console.error('Failed to save plants:', e)
    }
  }

  const addPlant = (plantData) => {
    const newPlant = {
      id: Date.now(),
      ...plantData,
      createdAt: new Date().toISOString(),
      wateringHistory: [],
      fertilizingHistory: []
    }
    plants.value.push(newPlant)
    savePlants()
    return newPlant
  }

  const deletePlant = (plantId) => {
    plants.value = plants.value.filter(p => p.id !== plantId)
    savePlants()
  }

  const recordWatering = (plantId) => {
    const plant = plants.value.find(p => p.id === plantId)
    if (plant) {
      plant.wateringHistory.push({
        date: new Date().toISOString(),
        note: '浇水记录'
      })
      savePlants()
    }
  }

  const recordFertilizing = (plantId) => {
    const plant = plants.value.find(p => p.id === plantId)
    if (plant) {
      plant.fertilizingHistory.push({
        date: new Date().toISOString(),
        note: '施肥记录'
      })
      savePlants()
    }
  }

  const getPlantById = (plantId) => {
    return plants.value.find(p => p.id === plantId)
  }

  const plantsNeedingWater = computed(() => {
    const now = new Date()
    return plants.value.filter(plant => {
      if (plant.wateringInterval) {
        const lastWatering = plant.wateringHistory.length > 0
          ? new Date(plant.wateringHistory[plant.wateringHistory.length - 1].date)
          : new Date(plant.createdAt)
        const daysSince = Math.floor((now - lastWatering) / (1000 * 60 * 60 * 24))
        return daysSince >= plant.wateringInterval
      }
      return false
    })
  })

  const plantsNeedingFertilizer = computed(() => {
    const now = new Date()
    return plants.value.filter(plant => {
      if (plant.fertilizingInterval) {
        const lastFertilizing = plant.fertilizingHistory.length > 0
          ? new Date(plant.fertilizingHistory[plant.fertilizingHistory.length - 1].date)
          : new Date(plant.createdAt)
        const daysSince = Math.floor((now - lastFertilizing) / (1000 * 60 * 60 * 24))
        return daysSince >= plant.fertilizingInterval
      }
      return false
    })
  })

  const getDaysUntilNextWatering = (plant) => {
    if (!plant.wateringInterval) return null
    const now = new Date()
    const lastWatering = plant.wateringHistory.length > 0
      ? new Date(plant.wateringHistory[plant.wateringHistory.length - 1].date)
      : new Date(plant.createdAt)
    const daysSince = Math.floor((now - lastWatering) / (1000 * 60 * 60 * 24))
    return Math.max(0, plant.wateringInterval - daysSince)
  }

  const getDaysUntilNextFertilizing = (plant) => {
    if (!plant.fertilizingInterval) return null
    const now = new Date()
    const lastFertilizing = plant.fertilizingHistory.length > 0
      ? new Date(plant.fertilizingHistory[plant.fertilizingHistory.length - 1].date)
      : new Date(plant.createdAt)
    const daysSince = Math.floor((now - lastFertilizing) / (1000 * 60 * 60 * 24))
    return Math.max(0, plant.fertilizingInterval - daysSince)
  }

  return {
    plants,
    loadPlants,
    addPlant,
    deletePlant,
    recordWatering,
    recordFertilizing,
    getPlantById,
    plantsNeedingWater,
    plantsNeedingFertilizer,
    getDaysUntilNextWatering,
    getDaysUntilNextFertilizing
  }
}
