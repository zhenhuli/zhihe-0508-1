<template>
  <div class="fixed top-6 right-6 w-80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-7 shadow-2xl shadow-purple-500/5 z-50 overflow-y-auto max-h-[calc(100vh-3rem)]">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">控制面板</h2>
          <p class="text-xs text-slate-400 mt-1">调整立方体参数</p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="group p-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
      >
        <svg class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="space-y-7">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <label class="text-sm font-medium text-slate-300">材质切换</label>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="material in materialOptions"
            :key="material.id"
            @click="$emit('changeMaterial', material.id)"
            :class="[
              'relative px-4 py-3 rounded-xl text-xs font-medium transition-all duration-300 overflow-hidden',
              settings.currentMaterial === material.id
                ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105'
                : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:scale-102'
            ]"
          >
            <span v-if="settings.currentMaterial === material.id" class="absolute inset-0 bg-white/10 animate-pulse"></span>
            <span class="relative z-10">{{ material.name }}</span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <label class="text-sm font-medium text-slate-300">视角预设</label>
        </div>
        <div class="grid grid-cols-4 gap-2.5">
          <button
            v-for="preset in presetViews"
            :key="preset.id"
            @click="$emit('changeView', preset.id)"
            class="group px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all duration-200 hover:scale-105"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
          </div>
          <label class="text-sm font-medium text-slate-300">立方体颜色</label>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="color in cubeColors"
            :key="color.id"
            @click="$emit('changeColor', color.hex)"
            :class="[
              'relative w-10 h-10 rounded-full transition-all duration-300',
              settings.currentColor === color.hex
                ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-115 shadow-lg'
                : 'hover:scale-105 hover:shadow-md'
            ]"
            :style="{ backgroundColor: color.hex, boxShadow: settings.currentColor === color.hex ? `0 0 20px ${color.hex}40` : 'none' }"
            :title="color.name"
          >
            <span 
              v-if="settings.currentColor === color.hex" 
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <label class="text-sm font-medium text-slate-300">旋转速度</label>
          </div>
          <span class="text-sm font-mono bg-slate-700/50 px-3 py-1.5 rounded-lg text-primary">
            {{ settings.rotationSpeed.toFixed(1) }}x
          </span>
        </div>
        <div class="relative px-1">
          <input
            type="range"
            :value="settings.rotationSpeed"
            @input="$emit('changeSpeed', parseFloat($event.target.value))"
            min="0"
            max="5"
            step="0.1"
            class="w-full h-2.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer slider-thumb"
          />
          <div 
            class="absolute top-0 left-1 h-2.5 bg-gradient-to-r from-primary to-secondary rounded-l-full pointer-events-none"
            :style="{ width: `${(settings.rotationSpeed / 5) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <label class="text-sm font-medium text-slate-300">光照强度</label>
          </div>
          <span class="text-sm font-mono bg-slate-700/50 px-3 py-1.5 rounded-lg text-accent">
            {{ settings.lightIntensity.toFixed(1) }}x
          </span>
        </div>
        <div class="relative px-1">
          <input
            type="range"
            :value="settings.lightIntensity"
            @input="$emit('changeLight', parseFloat($event.target.value))"
            min="0.1"
            max="2"
            step="0.1"
            class="w-full h-2.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer slider-thumb"
          />
          <div 
            class="absolute top-0 left-1 h-2.5 bg-gradient-to-r from-accent to-cyan-300 rounded-l-full pointer-events-none"
            :style="{ width: `${((settings.lightIntensity - 0.1) / 1.9) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          @click="$emit('toggleRotation')"
          :class="[
            'flex-1 py-4 px-5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2',
            settings.isRotating
              ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30'
              : 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30'
          ]"
        >
          <svg v-if="settings.isRotating" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
          </svg>
          {{ settings.isRotating ? '暂停旋转' : '开始旋转' }}
        </button>
        <button
          @click="$emit('resetView')"
          class="flex-1 py-4 px-5 rounded-xl font-medium bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-slate-300 hover:from-slate-700/70 hover:to-slate-600/70 transition-all duration-300 border border-slate-600/30 flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重置视角
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { materialOptions, cubeColors, presetViews } from '@/modules/StyleConfig'

defineProps({
  settings: {
    type: Object,
    required: true
  }
})

defineEmits([
  'close',
  'changeMaterial',
  'changeView',
  'changeColor',
  'changeSpeed',
  'changeLight',
  'toggleRotation',
  'resetView'
])
</script>

<style scoped>
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.slider-thumb::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.6);
}

.slider-thumb::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}
</style>
