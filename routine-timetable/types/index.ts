export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  label: string
  color: string
}

export interface TimetableData {
  title: string
  slots: TimeSlot[]
}
