<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">📝</span>
      文本输入
    </h3>
    
    <div class="mb-4">
      <textarea
        :value="text"
        @input="onInput"
        class="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
        placeholder="请输入或粘贴文本内容，支持中英文混合..."
      ></textarea>
      <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
        <span>字数统计: {{ wordCount }} 个词</span>
        <span>字符数: {{ charCount }}</span>
      </div>
    </div>
    
    <div class="flex gap-3 mb-4">
      <button
        @click="triggerFileInput"
        class="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
      >
        <span>📁</span>
        批量导入文本
      </button>
      <button
        @click="clearAll"
        class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
      >
        <span>🗑️</span>
        清空
      </button>
      <input
        ref="fileInput"
        type="file"
        accept=".txt,.md,.json"
        multiple
        @change="handleFileUpload"
        class="hidden"
      />
    </div>
    
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-500 mb-1">示例文本</div>
        <button
          @click="loadSample(0)"
          class="w-full text-left text-sm text-gray-700 hover:text-blue-600 truncate"
        >
          🔥 技术关键词
        </button>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-500 mb-1">示例文本</div>
        <button
          @click="loadSample(1)"
          class="w-full text-left text-sm text-gray-700 hover:text-blue-600 truncate"
        >
          💼 商业词汇
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'update:text', value: string): void
  (e: 'append:text', value: string): void
  (e: 'clear'): void
}>()

const wordCount = computed(() => {
  const text = props.text
  const words = text
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
  return words.length
})

const charCount = computed(() => props.text.length)

const samples = [
  `人工智能 机器学习 深度学习 神经网络 数据科学
大模型 ChatGPT 自然语言处理 计算机视觉 语音识别
云计算 大数据 物联网 区块链 量子计算
前端开发 后端开发 全栈开发 DevOps 微服务
React Vue Angular Node.js Python Java`,
  `创新 团队 领导力 策略 市场
产品 客户 服务 质量 效率
增长 营收 利润 投资 融资
营销 品牌 用户 体验 设计
敏捷 迭代 优化 转型 数字化`
]

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:text', target.value)
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  
  if (!files || files.length === 0) return
  
  for (const file of files) {
    const content = await readFile(file)
    emit('append:text', content)
  }
  
  input.value = ''
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function clearAll() {
  emit('clear')
}

function loadSample(index: number) {
  emit('update:text', samples[index])
}
</script>
