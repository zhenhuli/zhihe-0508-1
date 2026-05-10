export interface Chapter {
  id: string
  title: string
  duration: number
  videoUrl: string
  description: string
}

export interface Course {
  id: string
  title: string
  description: string
  cover: string
  instructor: string
  chapters: Chapter[]
  totalDuration: number
}

export interface ProgressRecord {
  chapterId: string
  currentTime: number
  completed: boolean
  updatedAt: number
}

export interface CourseProgress {
  courseId: string
  lastChapterId: string
  progress: Record<string, ProgressRecord>
}
