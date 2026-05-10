<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { courses } from '~/data/courses'
import type { Chapter } from '~/types'

const route = useRoute()
const courseId = route.params.courseId as string
const chapterId = route.params.chapterId as string

const course = courses.find(c => c.id === courseId)
const chapter = course?.chapters.find(ch => ch.id === chapterId)

const { getChapterProgress, saveChapterProgress, markChapterCompleted, getCourseCompletion } = useProgress()

if (!course || !chapter) {
  throw createError({
    statusCode: 404,
    message: '课程或章节不存在'
  })
}

const videoRef = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)
const duration = ref(chapter.duration)
const isPlaying = ref(false)
const progress = ref(0)
const isMuted = ref(false)
const isLoaded = ref(false)
let progressSaveInterval: ReturnType<typeof setInterval> | null = null

const chapterIndex = course.chapters.findIndex(ch => ch.id === chapterId)
const prevChapter = chapterIndex > 0 ? course.chapters[chapterIndex - 1] : null
const nextChapter = chapterIndex < course.chapters.length - 1 ? course.chapters[chapterIndex + 1] : null

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const updateProgress = () => {
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100
  }
}

const handleTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    updateProgress()
  }
}

const handleLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration || chapter.duration
    isLoaded.value = true
    
    const savedProgress = getChapterProgress(course.id, chapter.id)
    if (savedProgress && savedProgress.currentTime > 0 && !savedProgress.completed) {
      videoRef.value.currentTime = savedProgress.currentTime
      currentTime.value = savedProgress.currentTime
    }
  }
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  markChapterCompleted(course.id, chapter.id)
  if (nextChapter) {
    navigateTo(`/play/${course.id}/chapter/${nextChapter.id}`)
  }
}

const goToPrevChapter = () => {
  if (prevChapter) {
    navigateTo(`/play/${course.id}/chapter/${prevChapter.id}`)
  }
}

const goToNextChapter = () => {
  if (nextChapter) {
    navigateTo(`/play/${course.id}/chapter/${nextChapter.id}`)
  }
}

const isChapterCompleted = (ch: Chapter): boolean => {
  const p = getChapterProgress(course.id, ch.id)
  return p?.completed || false
}

const getChapterProgressPercent = (ch: Chapter): number => {
  const p = getChapterProgress(course.id, ch.id)
  if (!p) return 0
  return Math.min(Math.round((p.currentTime / ch.duration) * 100), 100)
}

const saveProgressPeriodically = () => {
  progressSaveInterval = setInterval(() => {
    if (videoRef.value && currentTime.value > 0) {
      saveChapterProgress(course.id, chapter.id, currentTime.value, duration.value)
    }
  }, 5000)
}

onMounted(() => {
  saveProgressPeriodically()
})

onUnmounted(() => {
  if (videoRef.value && currentTime.value > 0) {
    saveChapterProgress(course.id, chapter.id, currentTime.value, duration.value)
  }
  if (progressSaveInterval) {
    clearInterval(progressSaveInterval)
  }
})

watch(chapterId, () => {
  if (videoRef.value && currentTime.value > 0) {
    saveChapterProgress(course.id, chapter.id, currentTime.value, duration.value)
  }
})

const completionPercent = getCourseCompletion(course.id, course.chapters.length)
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <header class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <NuxtLink :to="`/course/${course.id}`" class="text-gray-400 hover:text-white text-sm">
            ← 返回课程
          </NuxtLink>
          <div class="text-gray-600">|</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-400">{{ course.title }}</span>
              <span class="text-gray-600">·</span>
              <span class="text-sm text-white truncate">{{ chapter.title }}</span>
            </div>
          </div>
          <div class="text-sm text-gray-400">
            {{ chapterIndex + 1 }} / {{ course.chapters.length }}
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3">
          <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref="videoRef"
              :src="chapter.videoUrl"
              class="w-full h-full"
              controls
              preload="metadata"
              playsinline
              @timeupdate="handleTimeUpdate"
              @loadedmetadata="handleLoadedMetadata"
              @play="handlePlay"
              @pause="handlePause"
              @ended="handleEnded"
            ></video>
          </div>

          <div class="mt-6 card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    第 {{ chapterIndex + 1 }} 节
                  </span>
                  <span v-if="isChapterCompleted(chapter)" class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    已完成
                  </span>
                </div>
                <h2 class="text-xl font-semibold text-gray-900">{{ chapter.title }}</h2>
              </div>
              <span class="text-sm text-gray-500">{{ formatDuration(chapter.duration) }}</span>
            </div>
            <p class="text-gray-600 leading-relaxed">{{ chapter.description }}</p>
          </div>

          <div class="mt-6 flex items-center gap-4">
            <button
              @click="goToPrevChapter"
              :disabled="!prevChapter"
              class="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              上一节
            </button>
            <button
              @click="goToNextChapter"
              :disabled="!nextChapter"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {{ nextChapter ? '下一节' : '完成学习' }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card sticky top-6">
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">课程进度</span>
                <span class="text-sm text-gray-500">{{ completionPercent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${completionPercent}%` }"
                ></div>
              </div>
            </div>

            <div class="p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              <div class="space-y-1">
                <NuxtLink
                  v-for="(ch, index) in course.chapters"
                  :key="ch.id"
                  :to="`/play/${course.id}/chapter/${ch.id}`"
                  class="block p-3 rounded-lg transition-colors"
                  :class="ch.id === chapterId ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      :class="isChapterCompleted(ch) ? 'bg-green-100 text-green-600' : ch.id === chapterId ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'"
                    >
                      <svg v-if="isChapterCompleted(ch)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else class="text-xs font-medium">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5
                        class="text-sm font-medium line-clamp-2"
                        :class="ch.id === chapterId ? 'text-blue-700' : 'text-gray-900'"
                      >
                        {{ ch.title }}
                      </h5>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">{{ formatDuration(ch.duration) }}</span>
                        <span
                          v-if="getChapterProgressPercent(ch) > 0 && !isChapterCompleted(ch)"
                          class="text-xs text-blue-600"
                        >
                          {{ getChapterProgressPercent(ch) }}%
                        </span>
                      </div>
                      <div v-if="getChapterProgressPercent(ch) > 0 && !isChapterCompleted(ch)" class="mt-2">
                        <div class="w-full bg-gray-100 rounded-full h-1">
                          <div
                            class="bg-blue-500 h-1 rounded-full"
                            :style="{ width: `${getChapterProgressPercent(ch)}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
