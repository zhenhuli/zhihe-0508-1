<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ isEditMode ? '编辑日程' : '添加日程' }}</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入日程标题"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="form.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="2"
            placeholder="输入日程描述（可选）"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">星期</label>
          <select
            v-model="form.day"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="(day, index) in dayNames" :key="index" :value="index">
              {{ day }}
            </option>
          </select>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
            <input
              v-model="form.startTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
            <input
              v-model="form.endTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <div class="flex gap-3">
            <button
              v-for="priority in priorities"
              :key="priority.value"
              @click="form.priority = priority.value"
              class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border-2"
              :class="form.priority === priority.value ? priority.activeClass : priority.inactiveClass"
            >
              {{ priority.label }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
          <div class="flex gap-3 flex-wrap">
            <button
              v-for="color in colorOptions"
              :key="color"
              @click="form.color = color"
              class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
              :class="{ 'ring-4 ring-offset-2 ring-gray-300': form.color === color }"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
          <input
            v-model="tagsInput"
            @keydown.enter.prevent="addTag"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入标签后按回车添加"
          />
          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="hover:text-blue-900">×</button>
            </span>
          </div>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          @click="handleCancel"
          class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {{ isEditMode ? '保存' : '添加' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  show: boolean
  defaultDay?: number
  editItem?: ScheduleItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: Omit<ScheduleItem, 'id'>): void
  (e: 'update', id: string, data: Partial<ScheduleItem>): void
}>()

const isEditMode = computed(() => !!props.editItem)

const { colorOptions } = useSchedule()

const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const priorities = [
  { value: 'high', label: '高', activeClass: 'bg-red-500 text-white border-red-500', inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:border-red-300' },
  { value: 'medium', label: '中', activeClass: 'bg-yellow-500 text-white border-yellow-500', inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300' },
  { value: 'low', label: '低', activeClass: 'bg-green-500 text-white border-green-500', inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:border-green-300' }
]

const tagsInput = ref('')

const form = ref({
  title: '',
  description: '',
  day: props.defaultDay || 0,
  startTime: '09:00',
  endTime: '10:00',
  priority: 'medium' as 'high' | 'medium' | 'low',
  color: colorOptions[0],
  tags: [] as string[]
})

watch(() => props.defaultDay, (newDay) => {
  if (newDay !== undefined && !isEditMode.value) {
    form.value.day = newDay
  }
})

watch(() => props.editItem, (item) => {
  if (item) {
    form.value = {
      title: item.title,
      description: item.description || '',
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      priority: item.priority,
      color: item.color,
      tags: [...item.tags]
    }
  }
}, { immediate: true })

const addTag = () => {
  const tag = tagsInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    tagsInput.value = ''
  }
}

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  if (!form.value.title.trim()) {
    alert('请输入日程标题')
    return
  }
  if (isEditMode.value && props.editItem) {
    emit('update', props.editItem.id, { ...form.value })
  } else {
    emit('submit', { ...form.value })
  }
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    day: props.defaultDay || 0,
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
    color: colorOptions[0],
    tags: []
  }
  tagsInput.value = ''
}
</script>
