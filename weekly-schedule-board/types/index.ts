export interface ScheduleItem {
  id: string
  title: string
  description?: string
  day: number
  startTime: string
  endTime: string
  priority: 'high' | 'medium' | 'low'
  color: string
  tags: string[]
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ScheduleState {
  items: ScheduleItem[]
  draggedItem: ScheduleItem | null
}
