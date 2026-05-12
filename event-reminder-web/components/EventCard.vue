<template>
  <div class="card hover:shadow-xl transition-shadow duration-300">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3 flex-1">
        <button 
          @click="$emit('toggle', event.id)"
          class="mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
          :class="event.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-500'"
        >
          <svg v-if="event.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
        <div class="flex-1">
          <h3 :class="['font-semibold text-lg', event.completed ? 'text-gray-400 line-through' : 'text-gray-800']">
            {{ event.title }}
          </h3>
          <p v-if="event.description" class="text-gray-500 text-sm mt-1">{{ event.description }}</p>
          <div class="flex items-center gap-4 mt-3">
            <div class="flex items-center gap-1 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ formatDate(event.date) }}</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ event.time }}</span>
            </div>
            <div v-if="event.repeat !== 'none'" class="flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ getRepeatLabel(event.repeat) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button 
          @click="$emit('edit', event)"
          class="text-indigo-500 hover:text-indigo-700 p-1"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button 
          @click="$emit('delete', event.id)"
          class="text-red-500 hover:text-red-700 p-1"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

const props = defineProps<{
  event: Event
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
  (e: 'edit', event: Event): void
}>()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })
}

const getRepeatLabel = (repeat: string) => {
  const labels: Record<string, string> = {
    daily: '每天',
    weekly: '每周',
    monthly: '每月',
    yearly: '每年'
  }
  return labels[repeat] || repeat
}
</script>
