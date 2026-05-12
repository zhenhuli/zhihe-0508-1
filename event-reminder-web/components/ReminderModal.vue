<template>
  <Transition name="modal">
    <div v-if="events.length > 0" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="card w-full max-w-md mx-4">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">提醒时间到！</h2>
          <p class="text-gray-500 mt-2">你有 {{ events.length }} 个事项需要处理</p>
        </div>
        
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-for="event in events" :key="event.id" class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-800">{{ event.title }}</h3>
            <p v-if="event.description" class="text-gray-500 text-sm mt-1">{{ event.description }}</p>
            <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span>{{ formatDateTime(event.date, event.time) }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button @click="handleDismiss" class="btn-secondary flex-1">稍后提醒</button>
          <button @click="handleComplete" class="btn-primary flex-1">全部完成</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

const props = defineProps<{
  events: Event[]
}>()

const emit = defineEmits<{
  (e: 'dismiss'): void
  (e: 'complete', ids: string[]): void
}>()

const formatDateTime = (dateStr: string, timeStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) + ' ' + timeStr
}

const handleDismiss = () => {
  emit('dismiss')
}

const handleComplete = () => {
  emit('complete', props.events.map(e => e.id))
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
