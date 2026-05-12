import type { ScheduleItem, ScheduleState } from '~/types'

const STORAGE_KEY = 'weekly-schedule-data'

const colorOptions = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
]

export const useSchedule = () => {
  const state = useState<ScheduleState>('schedule', () => ({
    items: [],
    draggedItem: null
  }))

  const loadFromStorage = () => {
    if (process.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          state.value.items = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse schedule data')
        }
      }
    }
  }

  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value.items))
    }
  }

  const addItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString()
    }
    state.value.items.push(newItem)
    saveToStorage()
  }

  const updateItem = (id: string, updates: Partial<ScheduleItem>) => {
    const index = state.value.items.findIndex(item => item.id === id)
    if (index !== -1) {
      state.value.items[index] = { ...state.value.items[index], ...updates }
      saveToStorage()
    }
  }

  const deleteItem = (id: string) => {
    state.value.items = state.value.items.filter(item => item.id !== id)
    saveToStorage()
  }

  const getItemsByDay = (day: number) => {
    return state.value.items.filter(item => item.day === day)
  }

  const setDraggedItem = (item: ScheduleItem | null) => {
    state.value.draggedItem = item
  }

  const moveItem = (itemId: string, newDay: number) => {
    updateItem(itemId, { day: newDay })
  }

  return {
    items: computed(() => state.value.items),
    draggedItem: computed(() => state.value.draggedItem),
    loadFromStorage,
    addItem,
    updateItem,
    deleteItem,
    getItemsByDay,
    setDraggedItem,
    moveItem,
    colorOptions
  }
}
