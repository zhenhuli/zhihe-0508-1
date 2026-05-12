import type { Event, RepeatType, TimeCategory } from '~/types'

export const useEventReminder = () => {
  const events = useState<Event[]>('events', () => [])
  const notifiedEvents = useState<Set<string>>('notifiedEvents', () => new Set())

  if (process.client) {
    const stored = localStorage.getItem('event-reminder-events')
    if (stored) {
      events.value = JSON.parse(stored)
    }
  }

  watch(events, (newEvents) => {
    if (process.client) {
      localStorage.setItem('event-reminder-events', JSON.stringify(newEvents))
    }
  }, { deep: true })

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'completed'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false
    }
    events.value.push(newEvent)
    return newEvent
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates }
    }
  }

  const deleteEvent = (id: string) => {
    events.value = events.value.filter(e => e.id !== id)
  }

  const toggleComplete = (id: string) => {
    const event = events.value.find(e => e.id === id)
    if (event) {
      event.completed = !event.completed
    }
  }

  const getTimeCategory = (eventDate: string, eventTime: string): TimeCategory => {
    const now = new Date()
    const eventDateTime = new Date(`${eventDate}T${eventTime}`)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    if (eventDateTime < today) {
      return 'today'
    } else if (eventDateTime < tomorrow) {
      return 'today'
    } else if (eventDateTime < new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)) {
      return 'tomorrow'
    } else if (eventDateTime < nextWeek) {
      return 'thisWeek'
    } else if (eventDateTime < nextMonth) {
      return 'thisMonth'
    } else {
      return 'later'
    }
  }

  const getEventsByCategory = () => {
    const categories: Record<TimeCategory, Event[]> = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      thisMonth: [],
      later: [],
      completed: []
    }

    events.value.forEach(event => {
      if (event.completed) {
        categories.completed.push(event)
      } else {
        const category = getTimeCategory(event.date, event.time)
        categories[category].push(event)
      }
    })

    return categories
  }

  const checkDueEvents = () => {
    const now = new Date()
    const dueEvents: Event[] = []

    events.value.forEach(event => {
      if (event.completed || notifiedEvents.value.has(event.id)) return

      const eventDateTime = new Date(`${event.date}T${event.time}`)
      const diff = eventDateTime.getTime() - now.getTime()

      if (diff <= 0 && diff > -60000) {
        dueEvents.push(event)
        notifiedEvents.value.add(event.id)
      }
    })

    return dueEvents
  }

  const clearNotification = (eventId: string) => {
    notifiedEvents.value.delete(eventId)
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
    getEventsByCategory,
    checkDueEvents,
    clearNotification
  }
}
