<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let photo;
  export let photos = [];
  export let onClose;

  let currentIndex = 0;

  $: if (photo && photos.length > 0) {
    currentIndex = photos.findIndex(p => p.id === photo.id);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    }
  }

  function prevPhoto() {
    if (currentIndex > 0) {
      currentIndex--;
      photo = photos[currentIndex];
    }
  }

  function nextPhoto() {
    if (currentIndex < photos.length - 1) {
      currentIndex++;
      photo = photos[currentIndex];
    }
  }

  function handleBackgroundClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  });
</script>

<div 
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  on:click={handleBackgroundClick}
  transition:fade={{ duration: 300 }}
>
  <button 
    class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
    aria-label="关闭预览"
    on:click={onClose}
  >
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>

  {#if currentIndex > 0}
    <button 
      class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/30 rounded-full p-2 hover:bg-black/50"
      aria-label="上一张"
      on:click={prevPhoto}
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
  {/if}

  {#if currentIndex < photos.length - 1}
    <button 
      class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/30 rounded-full p-2 hover:bg-black/50"
      aria-label="下一张"
      on:click={nextPhoto}
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  {/if}

  <div class="max-w-5xl max-h-[90vh] mx-4" transition:slide={{ duration: 300 }}>
    <div class="relative">
      <img 
        src={photo.url} 
        alt={photo.title}
        class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
    <div class="mt-4 text-white text-center">
      <h3 class="text-2xl font-bold">{photo.title}</h3>
      <p class="text-gray-300 mt-2">{photo.description}</p>
      <p class="text-gray-400 text-sm mt-1">{photo.date}</p>
      <p class="text-gray-500 text-xs mt-2">{currentIndex + 1} / {photos.length}</p>
    </div>
  </div>
</div>
