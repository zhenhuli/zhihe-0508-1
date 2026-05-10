import type { CourseProgress, ProgressRecord } from '~/types'

const STORAGE_KEY = 'course-player-progress'

export function useProgress() {
  const getProgressData = (): Record<string, CourseProgress> => {
    if (typeof window === 'undefined') return {}
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  }

  const setProgressData = (data: Record<string, CourseProgress>) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    const allProgress = getProgressData()
    return allProgress[courseId] || null
  }

  const getChapterProgress = (courseId: string, chapterId: string): ProgressRecord | null => {
    const courseProgress = getCourseProgress(courseId)
    if (!courseProgress) return null
    return courseProgress.progress[chapterId] || null
  }

  const saveChapterProgress = (
    courseId: string,
    chapterId: string,
    currentTime: number,
    duration: number,
    autoCompleteThreshold: number = 0.95
  ) => {
    const allProgress = getProgressData()
    
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
        courseId,
        lastChapterId: chapterId,
        progress: {}
      }
    }

    const isCompleted = currentTime >= duration * autoCompleteThreshold
    
    allProgress[courseId].lastChapterId = chapterId
    allProgress[courseId].progress[chapterId] = {
      chapterId,
      currentTime,
      completed: isCompleted || (allProgress[courseId].progress[chapterId]?.completed || false),
      updatedAt: Date.now()
    }

    setProgressData(allProgress)
  }

  const markChapterCompleted = (courseId: string, chapterId: string) => {
    const allProgress = getProgressData()
    
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
        courseId,
        lastChapterId: chapterId,
        progress: {}
      }
    }

    if (!allProgress[courseId].progress[chapterId]) {
      allProgress[courseId].progress[chapterId] = {
        chapterId,
        currentTime: 0,
        completed: false,
        updatedAt: Date.now()
      }
    }

    allProgress[courseId].progress[chapterId].completed = true
    allProgress[courseId].progress[chapterId].updatedAt = Date.now()
    
    setProgressData(allProgress)
  }

  const getLastPlayedChapter = (courseId: string): string | null => {
    const courseProgress = getCourseProgress(courseId)
    return courseProgress?.lastChapterId || null
  }

  const getCourseCompletion = (courseId: string, totalChapters: number): number => {
    const courseProgress = getCourseProgress(courseId)
    if (!courseProgress) return 0
    
    const completedCount = Object.values(courseProgress.progress).filter(p => p.completed).length
    return Math.round((completedCount / totalChapters) * 100)
  }

  const getChapterCount = (courseId: string): number => {
    const courseProgress = getCourseProgress(courseId)
    if (!courseProgress) return 0
    return Object.keys(courseProgress.progress).length
  }

  return {
    getCourseProgress,
    getChapterProgress,
    saveChapterProgress,
    markChapterCompleted,
    getLastPlayedChapter,
    getCourseCompletion,
    getChapterCount
  }
}
