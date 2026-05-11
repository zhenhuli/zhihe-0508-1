<template>
  <button
    @click="$emit('click')"
    class="group fixed bottom-6 right-6 z-50"
  >
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-300"></div>
      <div class="relative w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-xl shadow-purple-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/40">
        <svg class="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>
