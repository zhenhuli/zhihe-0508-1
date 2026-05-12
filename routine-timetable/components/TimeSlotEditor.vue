<script setup lang="ts">
import type { TimeSlot } from '~/types'

interface Props {
  slot: TimeSlot
  colors: string[]
}

interface Emits {
  (e: 'update', id: string, updates: Partial<TimeSlot>): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showColorPicker = ref(false)

const selectColor = (color: string) => {
  emit('update', props.slot.id, { color })
  showColorPicker.value = false
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 mb-3 border border-gray-100">
    <div class="flex items-center gap-4">
      <div class="relative">
        <button
          @click="showColorPicker = !showColorPicker"
          class="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
          :style="{ backgroundColor: slot.color }"
        />
        <div
          v-if="showColorPicker"
          class="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border z-10 grid grid-cols-4 gap-1"
        >
          <button
            v-for="color in colors"
            :key="color"
            @click="selectColor(color)"
            class="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform"
            :style="{ backgroundColor: color }"
          />
        </div>
      </div>

      <div class="flex-1 grid grid-cols-12 gap-3">
        <div class="col-span-5">
          <label class="text-xs text-gray-500 mb-1 block">时段</label>
          <div class="flex items-center gap-2">
            <input
              type="time"
              :value="slot.startTime"
              @input="emit('update', slot.id, { startTime: ($event.target as HTMLInputElement).value })"
              class="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="text-gray-400">-</span>
            <input
              type="time"
              :value="slot.endTime"
              @input="emit('update', slot.id, { endTime: ($event.target as HTMLInputElement).value })"
              class="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="col-span-6">
          <label class="text-xs text-gray-500 mb-1 block">日程标签</label>
          <input
            type="text"
            :value="slot.label"
            @input="emit('update', slot.id, { label: ($event.target as HTMLInputElement).value })"
            placeholder="输入日程内容"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        @click="emit('delete', slot.id)"
        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="删除时段"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
