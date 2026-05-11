<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
              ☁️
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Word Cloud Studio</h1>
              <p class="text-xs text-gray-500">在线词云生成器</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span class="text-xl">📦</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside class="lg:col-span-4 space-y-6">
          <TextProcessor
            :text="text"
            @update:text="updateText"
            @append:text="appendText"
            @clear="clearText"
          />
          
          <StyleConfig
            :selectedScheme="colorScheme"
            :selectedFont="fontFamily"
            :density="density"
            :backgroundColor="backgroundColor"
            :minFontSize="config.minFontSize"
            :maxFontSize="config.maxFontSize"
            @update:scheme="setColorScheme"
            @update:font="setFontFamily"
            @update:density="setDensity"
            @update:backgroundColor="setBackgroundColor"
            @update:fontSizeRange="setFontSizeRange"
          />
          
          <ShapeSelector
            :selectedShape="shape"
            :width="config.width"
            :height="config.height"
            @update:shape="setShape"
            @update:size="setSize"
          />
          
          <ImageExporter
            :width="config.width"
            :height="config.height"
            @export="handleExport"
          />
        </aside>

        <section class="lg:col-span-8">
          <div class="sticky top-24">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span class="text-2xl">🖼️</span>
                  词云预览
                </h2>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  实时渲染
                </div>
              </div>
              
              <WordCloudCanvas
                ref="cloudCanvasRef"
                :word-list="wordList"
                :width="config.width"
                :height="config.height"
                :color-scheme="colorScheme"
                :shape="shape"
                :font-family="fontFamily"
                :background-color="backgroundColor"
                :density="density"
                :min-font-size="config.minFontSize"
                :max-font-size="config.maxFontSize"
                :rotation-range="config.rotationRange"
              />
            </div>
            
            <div class="mt-4 grid grid-cols-4 gap-4">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <div class="text-2xl mb-1">📝</div>
                <div class="text-2xl font-bold text-gray-900">{{ wordList.length }}</div>
                <div class="text-xs text-gray-500">关键词数</div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <div class="text-2xl mb-1">🎨</div>
                <div class="text-2xl font-bold text-gray-900">{{ colorScheme.colors.length }}</div>
                <div class="text-xs text-gray-500">配色数</div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <div class="text-2xl mb-1">✨</div>
                <div class="text-2xl font-bold text-gray-900">{{ shape.name }}</div>
                <div class="text-xs text-gray-500">当前形状</div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <div class="text-2xl mb-1">🔤</div>
                <div class="text-xl font-bold text-gray-900 truncate">{{ fontFamily.name }}</div>
                <div class="text-xs text-gray-500">当前字体</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="mt-16 py-8 border-t border-gray-200 bg-white/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>Word Cloud Studio - 轻松创建精美的文字云</p>
        <p class="mt-1">支持多种形状、配色方案和自定义字体</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const cloudCanvasRef = ref<InstanceType<typeof WordCloudCanvas> | null>(null)

const {
  config,
  text,
  colorScheme,
  shape,
  fontFamily,
  density,
  backgroundColor,
  wordList,
  updateText,
  appendText,
  clearText,
  setColorScheme,
  setShape,
  setFontFamily,
  setDensity,
  setBackgroundColor,
  setFontSizeRange,
  setSize
} = useWordCloud()

function handleExport(format: 'png' | 'jpeg', quality: number, scale: number) {
  if (cloudCanvasRef.value) {
    cloudCanvasRef.value.downloadImage(format, quality, scale)
  }
}
</script>
