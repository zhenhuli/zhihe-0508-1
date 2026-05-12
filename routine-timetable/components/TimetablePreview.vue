<script setup lang="ts">
import type { TimetableData } from '~/types'

interface Props {
  data: TimetableData
}

const props = defineProps<Props>()
const timetableRef = ref<HTMLDivElement | null>(null)

const sortedSlots = computed(() => {
  return [...props.data.slots].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  )
})

defineExpose({
  timetableRef
})
</script>

<template>
  <div ref="timetableRef" class="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">{{ data.title }}</h1>
    
    <div class="space-y-2">
      <div
        v-for="slot in sortedSlots"
        :key="slot.id"
        class="flex items-center rounded-lg overflow-hidden shadow-sm"
      >
        <div
          class="w-3 h-full min-h-[60px]"
          :style="{ backgroundColor: slot.color }"
        />
        <div class="flex-1 px-4 py-3 bg-gray-50">
          <div class="font-semibold text-gray-800">{{ slot.label }}</div>
          <div class="text-sm text-gray-500">
            {{ slot.startTime }} - {{ slot.endTime }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 text-center text-sm text-gray-400">
      生成时间: {{ new Date().toLocaleDateString() }}
    </div>
  </div>
</template>
