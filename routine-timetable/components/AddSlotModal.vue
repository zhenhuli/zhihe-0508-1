<script setup lang="ts">
import type { TimeSlot } from '~/types'

interface Props {
  show: boolean
  colors: string[]
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm', slot: Omit<TimeSlot, 'id'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const startTime = ref('09:00')
const endTime = ref('10:00')
const label = ref('新时段')
const selectedColor = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    startTime.value = '09:00'
    endTime.value = '10:00'
    label.value = '新时段'
    selectedColor.value = props.colors[0]
  }
}, { immediate: true })

const handleConfirm = () => {
  emit('confirm', {
    startTime: startTime.value,
    endTime: endTime.value,
    label: label.value,
    color: selectedColor.value
  })
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="handleClose" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">添加新时段</h3>
            <button
              @click="handleClose"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">时段标签</label>
              <input
                v-model="label"
                type="text"
                placeholder="例如：工作、休息、学习"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">时间</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="startTime"
                  type="time"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span class="text-gray-400 font-medium">至</span>
                <input
                  v-model="endTime"
                  type="time"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">选择颜色</label>
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  @click="selectedColor = color"
                  class="aspect-square rounded-lg border-2 transition-all hover:scale-110"
                  :class="selectedColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'"
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
