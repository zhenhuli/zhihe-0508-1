<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          事件提醒备忘录
        </h1>
        <p class="text-gray-600">管理你的时间，不错过任何重要事项</p>
      </div>

      <div class="flex justify-center mb-8">
        <button @click="showAddModal = true" class="btn-primary flex items-center gap-2 text-lg px-6 py-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          添加新提醒
        </button>
      </div>

      <div v-if="sortedEvents.length === 0" class="card text-center py-12 text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="text-lg">暂无提醒事项</p>
        <p class="text-sm mt-2">点击上方按钮添加你的第一个提醒</p>
      </div>

      <div v-else class="space-y-4">
        <EventCard
          v-for="event in sortedEvents"
          :key="event.id"
          :event="event"
          @toggle="toggleEvent"
          @delete="deleteEvent"
          @edit="editEvent"
        />
      </div>
    </div>

    <AddEventModal
      :show="showAddModal"
      :edit-event="editingEvent"
      @close="() => { showAddModal = false; editingEvent = null; }"
      @add="handleAddEvent"
      @update="handleUpdateEvent"
    />

    <ReminderModal
      :events="dueEvents"
      @dismiss="dismissReminders"
      @complete="completeReminders"
    />
  </div>
</template>

<script setup lang="ts">
import type { RepeatType, Event } from '~/types'

const { events, addEvent, updateEvent, toggleComplete, deleteEvent: removeEvent, checkDueEvents, clearNotification } = useEventReminder()

const showAddModal = ref(false)
const editingEvent = ref<Event | null>(null)
const dueEvents = ref<typeof events.value>([])

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
})

const handleAddEvent = (eventData: { title: string; description: string; date: string; time: string; repeat: RepeatType }) => {
  addEvent(eventData)
  showAddModal.value = false
}

const handleUpdateEvent = (id: string, eventData: { title: string; description: string; date: string; time: string; repeat: RepeatType }) => {
  updateEvent(id, eventData)
  showAddModal.value = false
  editingEvent.value = null
}

const toggleEvent = (id: string) => {
  toggleComplete(id)
}

const deleteEvent = (id: string) => {
  removeEvent(id)
}

const editEvent = (event: Event) => {
  editingEvent.value = event
  showAddModal.value = true
}

const dismissReminders = () => {
  dueEvents.value = []
}

const completeReminders = (ids: string[]) => {
  ids.forEach(id => {
    toggleComplete(id)
    clearNotification(id)
  })
  dueEvents.value = []
}

onMounted(() => {
  setInterval(() => {
    const newDueEvents = checkDueEvents()
    if (newDueEvents.length > 0) {
      dueEvents.value = [...dueEvents.value, ...newDueEvents]
    }
  }, 1000)
})
</script>
