<template>
  <div
    :draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    class="p-3 rounded-lg shadow-sm cursor-move mb-2 border-l-4 transition-all hover:shadow-md hover:translate-y-[-2px]"
    :style="{ borderLeftColor: item.color, backgroundColor: `${item.color}10` }"
  >
    <div class="space-y-2">
      <div class="flex items-start justify-between gap-2">
        <h4 class="font-medium text-gray-800 text-sm line-clamp-2">{{ item.title }}</h4>
        <div class="flex gap-1 flex-shrink-0">
          <button @click="handleEdit" class="text-gray-400 hover:text-blue-500 p-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button @click="handleDelete" class="text-gray-400 hover:text-red-500 p-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      <p v-if="item.description" class="text-xs text-gray-500 line-clamp-2">{{ item.description }}</p>
      <div class="space-y-1">
        <span class="text-xs text-gray-400 flex items-center gap-1">
          <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="line-clamp-2">{{ item.startTime }} - {{ item.endTime }}</span>
        </span>
        <span
          class="text-xs px-2 py-0.5 rounded-full font-medium inline-block w-fit"
          :class="priorityClass"
        >
          {{ priorityText }}优先级
        </span>
      </div>
      <div v-if="item.tags.length > 0" class="flex flex-wrap gap-1">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded-full bg-white text-gray-600 border line-clamp-2"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  item: ScheduleItem
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', item: ScheduleItem): void
  (e: 'dragstart', item: ScheduleItem): void
  (e: 'dragend'): void
}>()

const priorityClass = computed(() => {
  const classes = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  }
  return classes[props.item.priority]
})

const priorityText = computed(() => {
  const texts = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[props.item.priority]
})

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item.id)
}

const handleDragStart = (e: DragEvent) => {
  emit('dragstart', props.item)
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragEnd = () => {
  emit('dragend')
}
</script>
