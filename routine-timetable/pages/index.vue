<script setup lang="ts">
import html2canvas from 'html2canvas'
import type { TimeSlot } from '~/types'

const { data, addSlot, updateSlot, deleteSlot, resetToDefault, defaultColors, lastError, clearError } = useTimetable()

const activeTab = ref<'edit' | 'preview'>('edit')
const previewRef = ref<InstanceType<typeof TimetablePreview> | null>(null)
const showAddModal = ref(false)

const exportImage = async () => {
  if (!previewRef.value?.timetableRef) return

  try {
    const canvas = await html2canvas(previewRef.value.timetableRef, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const link = document.createElement('a')
    link.download = `${data.value.title || '作息时间表'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('导出失败:', error)
  }
}

const handleUpdateSlot = (id: string, updates: Partial<TimeSlot>) => {
  updateSlot(id, updates)
}

const handleDeleteSlot = (id: string) => {
  deleteSlot(id)
}

const handleAddSlot = () => {
  showAddModal.value = true
}

const handleModalConfirm = (slotData: Omit<TimeSlot, 'id'>) => {
  addSlot(slotData)
  showAddModal.value = false
}

const handleModalClose = () => {
  showAddModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">作息时间表编辑器</h1>
            <p class="text-sm text-gray-500 mt-1">创建你的专属作息计划</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="resetToDefault"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              重置默认
            </button>
            <button
              v-if="activeTab === 'preview'"
              @click="exportImage"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出图片
            </button>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="activeTab = 'edit'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            编辑模式
          </button>
          <button
            @click="activeTab = 'preview'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            预览模式
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <div v-if="activeTab === 'edit'">
        <div class="mb-6">
          <label class="text-sm font-medium text-gray-700 mb-2 block">时间表标题</label>
          <input
            v-model="data.title"
            type="text"
            placeholder="输入时间表标题"
            class="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>

        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-700">时段列表</h2>
          <span class="text-sm text-gray-500">{{ data.slots.length }} 个时段</span>
        </div>

        <div
          v-if="lastError"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ lastError }}
        </div>

        <div class="space-y-2">
          <TimeSlotEditor
            v-for="slot in data.slots"
            :key="slot.id"
            :slot="slot"
            :colors="defaultColors"
            @update="handleUpdateSlot"
            @delete="handleDeleteSlot"
          />
        </div>

        <button
          @click="handleAddSlot"
          class="mt-4 w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加新时段
        </button>
      </div>

      <div v-else>
        <TimetablePreview ref="previewRef" :data="data" />
      </div>
    </main>

    <AddSlotModal
      :show="showAddModal"
      :colors="defaultColors"
      @close="handleModalClose"
      @confirm="handleModalConfirm"
    />
  </div>
</template>
