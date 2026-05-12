<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">周计划看板</h1>
            <p class="text-sm text-gray-500">拖拽日程卡片来调整安排</p>
          </div>
        </div>
        <button
          @click="openAddModal()"
          class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          添加日程
        </button>
      </div>
    </header>

    <main 
      ref="scrollContainerRef"
      class="max-w-full mx-auto px-4 py-6 overflow-x-auto"
      @dragover="handleGlobalDragOver"
    >
      <div class="grid grid-cols-7 gap-4 min-w-[1000px]">
        <div
          v-for="(day, dayIndex) in dayNames"
          :key="dayIndex"
          class="bg-white rounded-xl shadow-sm overflow-hidden"
          @dragover.prevent="handleDragOver($event, dayIndex)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(dayIndex)"
          :class="{ 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50': dragOverDay === dayIndex }"
        >
          <div class="p-3 border-b bg-gradient-to-r from-gray-50 to-white">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-700">{{ day }}</h3>
              <button
                @click="openAddModal(dayIndex)"
                class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ getItemsByDay(dayIndex).length }} 个日程</p>
          </div>
          
          <div class="p-2 min-h-[400px]">
            <ScheduleCard
              v-for="item in getSortedItems(dayIndex)"
              :key="item.id"
              :item="item"
              @delete="deleteItem"
              @edit="openEditModal"
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
            />
            
            <div v-if="getItemsByDay(dayIndex).length === 0" class="text-center py-8">
              <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-400">暂无日程</p>
              <p class="text-xs text-gray-300 mt-1">点击 + 添加</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AddScheduleModal
      :show="showModal"
      :default-day="modalDefaultDay"
      :edit-item="editingItem"
      @close="closeModal"
      @submit="handleAddItem"
      @update="handleUpdateItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const {
  loadFromStorage,
  addItem,
  updateItem,
  deleteItem,
  getItemsByDay,
  setDraggedItem,
  moveItem,
  draggedItem
} = useSchedule()

const showModal = ref(false)
const modalDefaultDay = ref<number | undefined>(undefined)
const editingItem = ref<ScheduleItem | null>(null)
const dragOverDay = ref<number | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const autoScrollInterval = ref<number | null>(null)
const EDGE_THRESHOLD = 100
const SCROLL_SPEED = 15

onMounted(() => {
  loadFromStorage()
})

const openAddModal = (dayIndex?: number) => {
  editingItem.value = null
  modalDefaultDay.value = dayIndex
  showModal.value = true
}

const openEditModal = (item: ScheduleItem) => {
  editingItem.value = item
  modalDefaultDay.value = undefined
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  modalDefaultDay.value = undefined
}

const handleAddItem = (data: Omit<ScheduleItem, 'id'>) => {
  addItem(data)
  closeModal()
}

const handleUpdateItem = (id: string, data: Partial<ScheduleItem>) => {
  updateItem(id, data)
  closeModal()
}

const handleDragStart = (item: ScheduleItem) => {
  setDraggedItem(item)
}

const handleDragEnd = () => {
  setDraggedItem(null)
  dragOverDay.value = null
  stopAutoScroll()
}

const handleGlobalDragOver = (e: DragEvent) => {
  if (!scrollContainerRef.value) return
  
  const container = scrollContainerRef.value
  const rect = container.getBoundingClientRect()
  const mouseX = e.clientX
  
  const distanceToLeftEdge = mouseX - rect.left
  const distanceToRightEdge = rect.right - mouseX
  
  if (distanceToLeftEdge < EDGE_THRESHOLD) {
    const scrollSpeed = Math.min(SCROLL_SPEED, (EDGE_THRESHOLD - distanceToLeftEdge) / 5)
    startAutoScroll(-scrollSpeed)
  } else if (distanceToRightEdge < EDGE_THRESHOLD) {
    const scrollSpeed = Math.min(SCROLL_SPEED, (EDGE_THRESHOLD - distanceToRightEdge) / 5)
    startAutoScroll(scrollSpeed)
  } else {
    stopAutoScroll()
  }
}

const startAutoScroll = (speed: number) => {
  if (autoScrollInterval.value !== null) return
  
  autoScrollInterval.value = window.setInterval(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollLeft += speed
    }
  }, 16)
}

const stopAutoScroll = () => {
  if (autoScrollInterval.value !== null) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}

const handleDragOver = (e: DragEvent, dayIndex: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverDay.value = dayIndex
}

const handleDragLeave = () => {
  dragOverDay.value = null
  stopAutoScroll()
}

const handleDrop = (dayIndex: number) => {
  if (draggedItem.value && draggedItem.value.day !== dayIndex) {
    moveItem(draggedItem.value.id, dayIndex)
  }
  dragOverDay.value = null
  stopAutoScroll()
}

const getSortedItems = (dayIndex: number) => {
  return getItemsByDay(dayIndex).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return a.startTime.localeCompare(b.startTime)
  })
}
</script>
