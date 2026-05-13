<script>
  import { onMount, onDestroy } from 'svelte';

  export let src;
  export let alt = '';
  export let className = '';

  let loaded = false;
  let error = false;
  let imgRef;
  let observer;

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loaded = true;
          };
          img.onerror = () => {
            error = true;
          };
          observer.unobserve(imgRef);
        }
      });
    }, {
      rootMargin: '100px'
    });

    if (imgRef) {
      observer.observe(imgRef);
    }
  });

  onDestroy(() => {
    if (observer && imgRef) {
      observer.unobserve(imgRef);
    }
  });
</script>

<div class={`relative overflow-hidden ${className}`} bind:this={imgRef}>
  {#if !loaded && !error}
    <div class="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  {/if}
  
  {#if error}
    <div class="absolute inset-0 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-500 text-sm">加载失败</span>
    </div>
  {/if}

  {#if loaded}
    <img 
      {src} 
      {alt}
      class="w-full h-full object-cover transition-opacity duration-500"
      class:opacity-100={loaded}
      class:opacity-0={!loaded}
    />
  {/if}
</div>
