<script setup lang="ts">
import { courses } from '~/data/courses'

const route = useRoute()
const courseId = route.params.id as string
const course = courses.find(c => c.id === courseId)

const { getCourseCompletion, getChapterProgress, getLastPlayedChapter } = useProgress()

if (!course) {
  throw createError({
    statusCode: 404,
    message: '课程不存在'
  })
}

const startLearning = () => {
  const lastChapterId = getLastPlayedChapter(course.id)
  const targetChapterId = lastChapterId || course.chapters[0].id
  navigateTo(`/play/${course.id}/chapter/${targetChapterId}`)
}

const isChapterCompleted = (chapterId: string): boolean => {
  const progress = getChapterProgress(course.id, chapterId)
  return progress?.completed || false
}

const getChapterProgressPercent = (chapterId: string, duration: number): number => {
  const progress = getChapterProgress(course.id, chapterId)
  if (!progress) return 0
  return Math.min(Math.round((progress.currentTime / duration) * 100), 100)
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const completionPercent = getCourseCompletion(course.id, course.chapters.length)
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
            ← 返回列表
          </NuxtLink>
          <div class="text-gray-300">|</div>
          <h1 class="text-lg font-semibold text-gray-900">{{ course.title }}</h1>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="card overflow-hidden">
            <div class="relative h-64 md:h-80">
              <img
                :src="course.cover"
                :alt="course.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  @click="startLearning"
                  class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <svg class="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}</h2>
              <p class="text-gray-600 mb-4">{{ course.description }}</p>
              <div class="flex items-center gap-6 text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">
                      {{ course.instructor.charAt(0) }}
                    </span>
                  </div>
                  <span>{{ course.instructor }}</span>
                </div>
                <div>{{ course.chapters.length }} 节课程</div>
                <div>{{ formatDuration(course.totalDuration) }}</div>
              </div>
            </div>
          </div>

          <div class="mt-8 card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">课程简介</h3>
            <p class="text-gray-600 leading-relaxed">
              本课程将带你从零开始学习 {{ course.title }}，通过实战项目帮助你掌握核心概念和最佳实践。
              课程内容循序渐进，适合初学者和有一定基础的开发者。
            </p>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card sticky top-8">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">学习进度</span>
                <span class="text-sm text-gray-500">{{ completionPercent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${completionPercent}%` }"
                ></div>
              </div>
            </div>

            <div class="p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3 px-2">课程目录</h4>
              <div class="space-y-1">
                <NuxtLink
                  v-for="(chapter, index) in course.chapters"
                  :key="chapter.id"
                  :to="`/play/${course.id}/chapter/${chapter.id}`"
                  class="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      :class="isChapterCompleted(chapter.id) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'"
                    >
                      <svg v-if="isChapterCompleted(chapter.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else class="text-xs font-medium">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5 class="text-sm font-medium text-gray-900 line-clamp-2">{{ chapter.title }}</h5>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">{{ formatDuration(chapter.duration) }}</span>
                        <span v-if="getChapterProgressPercent(chapter.id, chapter.duration) > 0" class="text-xs text-blue-600">
                          {{ getChapterProgressPercent(chapter.id, chapter.duration) }}%
                        </span>
                      </div>
                      <div v-if="getChapterProgressPercent(chapter.id, chapter.duration) > 0 && getChapterProgressPercent(chapter.id, chapter.duration) < 100" class="mt-2">
                        <div class="w-full bg-gray-100 rounded-full h-1">
                          <div
                            class="bg-blue-500 h-1 rounded-full"
                            :style="{ width: `${getChapterProgressPercent(chapter.id, chapter.duration)}%` }"
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
    </main>
  </div>
</template>
