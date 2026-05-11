<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">💾</span>
      导出图片
    </h3>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
      <div class="flex gap-2">
        <button
          v-for="fmt in formats"
          :key="fmt.value"
          @click="selectedFormat = fmt.value"
          class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
          :class="selectedFormat === fmt.value 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ fmt.label }}
        </button>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-medium text-gray-700">导出质量</label>
        <span class="text-xs text-gray-500">{{ selectedFormat === 'png' ? '无损' : `${quality * 100}%` }}</span>
      </div>
      <input
        v-if="selectedFormat === 'jpeg'"
        type="range"
        min="0.6"
        max="1"
        step="0.1"
        v-model="quality"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div v-else class="h-2 bg-gray-100 rounded-lg"></div>
    </div>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">输出分辨率倍率</label>
      <div class="flex gap-2">
        <button
          v-for="scale in scales"
          :key="scale"
          @click="selectedScale = scale"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
          :class="selectedScale === scale 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ scale }}x
        </button>
      </div>
      <div class="mt-2 text-xs text-gray-500">
        输出尺寸: {{ Math.round(width * selectedScale) }} × {{ Math.round(height * selectedScale) }}
      </div>
    </div>
    
    <div class="space-y-3">
      <button
        @click="exportImage"
        :disabled="isExporting"
        class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="isExporting" class="animate-spin">⏳</span>
        <span v-else>⬇️</span>
        {{ isExporting ? '生成中...' : '导出高清图片' }}
      </button>
      
      <div class="text-center text-xs text-gray-400">
        提示: 高倍率导出可用于打印或大型展示
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  width: number
  height: number
}>()

const emit = defineEmits<{
  (e: 'export', format: 'png' | 'jpeg', quality: number, scale: number): void
}>()

const formats = [
  { label: 'PNG (透明)', value: 'png' as const },
  { label: 'JPEG', value: 'jpeg' as const }
]

const scales = [1, 2, 3, 4]

const selectedFormat = ref<'png' | 'jpeg'>('png')
const quality = ref(0.92)
const selectedScale = ref(2)
const isExporting = ref(false)

async function exportImage() {
  isExporting.value = true
  try {
    emit('export', selectedFormat.value, quality.value, selectedScale.value)
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isExporting.value = false
  }
}
</script>
