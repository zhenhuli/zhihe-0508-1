export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  repeat: RepeatType
  completed: boolean
  createdAt: string
}

export type TimeCategory = 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'later' | 'completed'
