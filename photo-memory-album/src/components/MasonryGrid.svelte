<script>
  import { fade } from 'svelte/transition';
  import LazyImage from './LazyImage.svelte';

  export let photos = [];
  export let onPhotoClick;

  function getColumnClass(index) {
    const column = index % 3;
    if (column === 0) return 'col-span-1';
    if (column === 1) return 'col-span-1';
    return 'col-span-1';
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
  {#each photos as photo, index (photo.id)}
    <div 
      class="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1"
      role="button"
      tabindex="0"
      on:click={() => onPhotoClick(photo)}
      on:keydown={(e) => e.key === 'Enter' && onPhotoClick(photo)}
      transition:fade={{ duration: 500, delay: index * 50 }}
    >
      <div class="relative" style="height: {photo.height}px;">
        <LazyImage 
          src={photo.thumbnail} 
          alt={photo.title}
          className="w-full h-full rounded-xl"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 class="font-bold text-lg">{photo.title}</h3>
            <p class="text-sm text-gray-200">{photo.description}</p>
            <p class="text-xs text-gray-300 mt-1">{photo.date}</p>
          </div>
        </div>
        <div class="absolute top-3 right-3">
          <div class="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
