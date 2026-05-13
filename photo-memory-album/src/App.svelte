<script>
  import { fly, fade } from 'svelte/transition';
  import MasonryGrid from './components/MasonryGrid.svelte';
  import PhotoModal from './components/PhotoModal.svelte';
  import { getPhotosByYearMonth, getMonthName, getAllPhotos } from './data/photos.js';

  const groupedPhotos = getPhotosByYearMonth();
  const allPhotos = getAllPhotos();
  
  let selectedPhoto = null;
  let selectedYear = null;
  let selectedMonth = null;

  function openPhotoModal(photo) {
    selectedPhoto = photo;
  }

  function closePhotoModal() {
    selectedPhoto = null;
  }

  function getFilteredPhotos() {
    if (selectedYear && selectedMonth) {
      const group = groupedPhotos.find(g => g.year === selectedYear && g.month === selectedMonth);
      return group ? group.photos : [];
    }
    return allPhotos;
  }

  function clearFilter() {
    selectedYear = null;
    selectedMonth = null;
  }
</script>

<div class="min-h-screen">
  <header class="bg-white/10 backdrop-blur-md shadow-lg sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-white/20 p-3 rounded-xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">时光相册</h1>
            <p class="text-white/70 text-sm">记录每一个美好瞬间</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-white/80 text-sm">共 {allPhotos.length} 张照片</p>
          <p class="text-white/60 text-xs">{groupedPhotos.length} 个月份</p>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <section class="mb-8" transition:fly={{ y: -50, duration: 500 }}>
      <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        时间轴
      </h2>
      <div class="flex flex-wrap gap-3">
        <button 
          on:click={clearFilter}
          class="px-4 py-2 rounded-full text-white font-medium transition-all duration-300 {!selectedYear && !selectedMonth ? 'bg-white/30 shadow-lg' : 'bg-white/10 hover:bg-white/20'}"
        >
          全部照片
        </button>
        {#each groupedPhotos as group}
          <button 
            on:click={() => { selectedYear = group.year; selectedMonth = group.month; }}
            class="px-4 py-2 rounded-full text-white font-medium transition-all duration-300 {selectedYear === group.year && selectedMonth === group.month ? 'bg-white/30 shadow-lg' : 'bg-white/10 hover:bg-white/20'}"
          >
            {group.year}年 {getMonthName(group.month)}
            <span class="ml-2 text-sm opacity-70">({group.photos.length})</span>
          </button>
        {/each}
      </div>
    </section>

    {#if selectedYear && selectedMonth}
      <div class="mb-6 flex items-center" transition:fade={{ duration: 300 }}>
        <div class="bg-white/10 rounded-xl px-4 py-2 flex items-center">
          <span class="text-white mr-2">
            当前显示: {selectedYear}年 {getMonthName(selectedMonth)}
          </span>
          <button 
            on:click={clearFilter}
            class="text-white/70 hover:text-white transition-colors"
            aria-label="清除筛选"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    {/if}

    <section transition:fade={{ duration: 500 }}>
      <MasonryGrid 
        photos={getFilteredPhotos()} 
        onPhotoClick={openPhotoModal}
      />
    </section>

    {#if getFilteredPhotos().length === 0}
      <div class="text-center py-20" transition:fade={{ duration: 300 }}>
        <svg class="w-20 h-20 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-white/50 text-xl">暂无照片</p>
      </div>
    {/if}
  </main>

  <footer class="bg-white/5 backdrop-blur-md mt-12 py-6">
    <div class="max-w-7xl mx-auto px-4 text-center text-white/50 text-sm">
      <p>© 2024 时光相册 - 珍藏每一个美好瞬间</p>
    </div>
  </footer>
</div>

{#if selectedPhoto}
  <PhotoModal 
    photo={selectedPhoto} 
    photos={getFilteredPhotos()}
    onClose={closePhotoModal}
  />
{/if}
