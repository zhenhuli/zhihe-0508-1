<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">🎨</span>
      样式配置
    </h3>
    
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">配色方案</label>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.id"
          @click="selectScheme(scheme)"
          class="h-10 rounded-lg border-2 transition-all hover:scale-105"
          :class="selectedScheme?.id === scheme.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'"
          :style="{
            background: `linear-gradient(135deg, ${scheme.colors.slice(0, 5).join(', ')})`
          }"
          :title="scheme.name"
        ></button>
      </div>
      <div class="mt-2 text-xs text-gray-500">
        已选择: <span class="font-medium text-gray-700">{{ selectedScheme?.name }}</span>
      </div>
    </div>
    
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">背景颜色</label>
      <div class="flex items-center gap-3">
        <input
          type="color"
          :value="backgroundColor"
          @input="onBgColorChange"
          class="w-12 h-10 rounded cursor-pointer border border-gray-300"
        />
        <input
          type="text"
          :value="backgroundColor"
          @input="onBgColorInput"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="#ffffff"
        />
        <button
          v-for="(color, idx) in presetBgColors"
          :key="idx"
          @click="onBgColorSelect(color)"
          class="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all"
          :style="{ backgroundColor: color }"
        ></button>
      </div>
    </div>
    
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        字体: <span class="text-gray-500 font-normal">{{ selectedFont?.name }}</span>
      </label>
      <select
        :value="selectedFont?.id"
        @change="onFontChange"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option v-for="font in fonts" :key="font.id" :value="font.id">
          {{ font.name }}
        </option>
      </select>
    </div>
    
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <label class="text-sm font-medium text-gray-700">词云密度</label>
        <span class="text-xs text-gray-500">{{ Math.round(density * 100) }}%</span>
      </div>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        :value="density"
        @input="onDensityChange"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>稀疏</span>
        <span>适中</span>
        <span>密集</span>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">最小字号</label>
        <input
          type="number"
          :value="minFontSize"
          @input="onMinFontSizeChange"
          min="6"
          max="50"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">最大字号</label>
        <input
          type="number"
          :value="maxFontSize"
          @input="onMaxFontSizeChange"
          min="30"
          max="300"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colorSchemes, type ColorScheme } from '~/data/colorSchemes'
import { fonts, type Font } from '~/data/fonts'

const props = defineProps<{
  selectedScheme: ColorScheme
  selectedFont: Font
  density: number
  backgroundColor: string
  minFontSize: number
  maxFontSize: number
}>()

const emit = defineEmits<{
  (e: 'update:scheme', value: ColorScheme): void
  (e: 'update:font', value: Font): void
  (e: 'update:density', value: number): void
  (e: 'update:backgroundColor', value: string): void
  (e: 'update:fontSizeRange', min: number, max: number): void
}>()

const presetBgColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#0f172a', '#1e1b4b', '#0c4a6e']

function selectScheme(scheme: ColorScheme) {
  emit('update:scheme', scheme)
}

function onFontChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const font = fonts.find(f => f.id === target.value)
  if (font) {
    emit('update:font', font)
  }
}

function onDensityChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:density', parseFloat(target.value))
}

function onBgColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:backgroundColor', target.value)
}

function onBgColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:backgroundColor', target.value)
}

function onBgColorSelect(color: string) {
  emit('update:backgroundColor', color)
}

function onMinFontSizeChange(event: Event) {
  const target = event.target as HTMLInputElement
  const min = parseInt(target.value) || props.minFontSize
  emit('update:fontSizeRange', min, props.maxFontSize)
}

function onMaxFontSizeChange(event: Event) {
  const target = event.target as HTMLInputElement
  const max = parseInt(target.value) || props.maxFontSize
  emit('update:fontSizeRange', props.minFontSize, max)
}
</script>
