import type { TimeSlot, TimetableData } from '~/types'
import { onMounted, ref, watch } from '#imports'

const STORAGE_KEY = 'routine-timetable-data'

const defaultColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16'
]

const defaultSlots: TimeSlot[] = [
  { id: '1', startTime: '06:00', endTime: '07:00', label: '早起运动', color: defaultColors[0] },
  { id: '2', startTime: '07:00', endTime: '08:00', label: '早餐', color: defaultColors[1] },
  { id: '3', startTime: '08:00', endTime: '12:00', label: '工作', color: defaultColors[2] },
  { id: '4', startTime: '12:00', endTime: '13:00', label: '午餐', color: defaultColors[3] },
  { id: '5', startTime: '13:00', endTime: '18:00', label: '工作', color: defaultColors[2] },
  { id: '6', startTime: '18:00', endTime: '19:00', label: '晚餐', color: defaultColors[4] },
  { id: '7', startTime: '19:00', endTime: '21:00', label: '学习', color: defaultColors[5] },
  { id: '8', startTime: '21:00', endTime: '23:00', label: '休息', color: defaultColors[6] }
]

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const checkOverlap = (
  slots: TimeSlot[],
  excludeId: string | null,
  startTime: string,
  endTime: string
): boolean => {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  if (start >= end) return true

  for (const slot of slots) {
    if (excludeId && slot.id === excludeId) continue

    const slotStart = timeToMinutes(slot.startTime)
    const slotEnd = timeToMinutes(slot.endTime)

    if (start < slotEnd && end > slotStart) {
      return true
    }
  }

  return false
}

const sortSlotsByTime = (slots: TimeSlot[]): TimeSlot[] => {
  return [...slots].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
}

export function useTimetable() {
  const data = ref<TimetableData>({
    title: '我的作息时间表',
    slots: sortSlotsByTime([...defaultSlots])
  })

  const lastError = ref<string | null>(null)
  const isHydrated = ref(false)

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      data.value = {
        ...parsed,
        slots: sortSlotsByTime(parsed.slots)
      }
    }
    isHydrated.value = true
  })

  watch(data, (newData) => {
    if (isHydrated.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    }
  }, { deep: true })

  const addSlot = (slotData?: Omit<TimeSlot, 'id'>) => {
    const nextId = Date.now().toString()
    const newSlot: TimeSlot = slotData ? {
      id: nextId,
      ...slotData
    } : {
      id: nextId,
      startTime: '09:00',
      endTime: '10:00',
      label: '新时段',
      color: defaultColors[data.value.slots.length % defaultColors.length]
    }

    const newSlots = [...data.value.slots, newSlot]
    data.value.slots = sortSlotsByTime(newSlots)
    lastError.value = null
    return true
  }

  const updateSlot = (id: string, updates: Partial<TimeSlot>): boolean => {
    const index = data.value.slots.findIndex(s => s.id === id)
    if (index === -1) return false

    const currentSlot = data.value.slots[index]
    const updatedSlot = { ...currentSlot, ...updates }

    const startTime = updates.startTime ?? currentSlot.startTime
    const endTime = updates.endTime ?? currentSlot.endTime

    const newSlots = [...data.value.slots]
    newSlots[index] = updatedSlot
    data.value.slots = sortSlotsByTime(newSlots)

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      lastError.value = '结束时间必须晚于开始时间'
    } else {
      lastError.value = null
    }

    return true
  }

  const deleteSlot = (id: string) => {
    data.value.slots = data.value.slots.filter(s => s.id !== id)
  }

  const resetToDefault = () => {
    data.value = {
      title: '我的作息时间表',
      slots: sortSlotsByTime([...defaultSlots])
    }
    lastError.value = null
  }

  const clearError = () => {
    lastError.value = null
  }

  return {
    data,
    addSlot,
    updateSlot,
    deleteSlot,
    resetToDefault,
    defaultColors,
    lastError,
    clearError
  }
}
