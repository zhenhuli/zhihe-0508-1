<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">✨</span>
      形状选择
    </h3>
    
    <div class="grid grid-cols-4 gap-3">
      <button
        v-for="shape in shapes"
        :key="shape.id"
        @click="selectShape(shape)"
        class="aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md"
        :class="selectedShape?.id === shape.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
        :title="shape.description"
      >
        <span class="text-2xl">{{ getShapeIcon(shape.type) }}</span>
        <span class="text-xs text-gray-600 font-medium">{{ shape.name }}</span>
      </button>
    </div>
    
    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="text-sm text-gray-600">
        当前: <span class="font-semibold text-gray-800">{{ selectedShape?.name }}</span>
        <span class="text-gray-400 ml-2">- {{ selectedShape?.description }}</span>
      </div>
    </div>
    
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">画布尺寸</label>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500">宽度 (px)</label>
          <input
            type="number"
            :value="width"
            @input="onWidthChange"
            min="400"
            max="2000"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500">高度 (px)</label>
          <input
            type="number"
            :value="height"
            @input="onHeightChange"
            min="300"
            max="2000"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <div class="mt-3 flex gap-2 flex-wrap">
        <button
          v-for="preset in presets"
          :key="preset.name"
          @click="applyPreset(preset)"
          class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition-colors"
        >
          {{ preset.name }} ({{ preset.width }}×{{ preset.height }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shapes, type Shape } from '~/data/shapes'

const props = defineProps<{
  selectedShape: Shape
  width: number
  height: number
}>()

const emit = defineEmits<{
  (e: 'update:shape', value: Shape): void
  (e: 'update:size', width: number, height: number): void
}>()

const presets = [
  { name: '方形', width: 800, height: 800 },
  { name: '宽屏', width: 1200, height: 600 },
  { name: '竖屏', width: 600, height: 900 },
  { name: '4K', width: 1920, height: 1080 },
  { name: '高清', width: 1200, height: 800 }
]

const shapeIcons: Record<string, string> = {
  'circle': '⭕',
  'cardioid': '💗',
  'diamond': '🔷',
  'square': '⬜',
  'triangle-forward': '🔼',
  'triangle': '🔽',
  'pentagon': '⬟',
  'star': '⭐'
}

function getShapeIcon(type: string) {
  return shapeIcons[type] || '⭕'
}

function selectShape(shape: Shape) {
  emit('update:shape', shape)
}

function onWidthChange(event: Event) {
  const target = event.target as HTMLInputElement
  const width = parseInt(target.value) || props.width
  emit('update:size', width, props.height)
}

function onHeightChange(event: Event) {
  const target = event.target as HTMLInputElement
  const height = parseInt(target.value) || props.height
  emit('update:size', props.width, height)
}

function applyPreset(preset: typeof presets[0]) {
  emit('update:size', preset.width, preset.height)
}
</script>
