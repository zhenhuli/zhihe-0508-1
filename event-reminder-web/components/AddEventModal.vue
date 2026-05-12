<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="card w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ isEditing ? '编辑提醒' : '添加新提醒' }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input v-model="form.title" type="text" class="input-field" placeholder="请输入事件标题" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea v-model="form.description" class="input-field" rows="3" placeholder="请输入事件描述"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input v-model="form.date" type="date" class="input-field" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">时间</label>
              <input v-model="form.time" type="time" class="input-field" required>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">重复周期</label>
            <select v-model="form.repeat" class="input-field">
              <option value="none">不重复</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
              <option value="yearly">每年</option>
            </select>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">取消</button>
          <button type="submit" class="btn-primary flex-1">{{ isEditing ? '保存修改' : '添加提醒' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RepeatType, Event } from '~/types'

const props = defineProps<{
  show: boolean
  editEvent?: Event | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', event: { title: string; description: string; date: string; time: string; repeat: RepeatType }): void
  (e: 'update', id: string, event: { title: string; description: string; date: string; time: string; repeat: RepeatType }): void
}>()

const isEditing = computed(() => !!props.editEvent)

const defaultForm = () => ({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  repeat: 'none' as RepeatType
})

const form = ref(defaultForm())

watch(() => props.editEvent, (newEvent) => {
  if (newEvent) {
    form.value = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      repeat: newEvent.repeat
    }
  } else {
    form.value = defaultForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (isEditing.value && props.editEvent) {
    emit('update', props.editEvent.id, { ...form.value })
  } else {
    emit('add', { ...form.value })
  }
  form.value = defaultForm()
}
</script>
