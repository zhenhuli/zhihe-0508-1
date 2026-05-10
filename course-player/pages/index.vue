<script setup lang="ts">
import { courses } from '~/data/courses'
import type { Course } from '~/types'

const { getCourseCompletion, getLastPlayedChapter } = useProgress()

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const navigateToCourse = (course: Course) => {
  const lastChapterId = getLastPlayedChapter(course.id)
  if (lastChapterId) {
    navigateTo(`/play/${course.id}/chapter/${lastChapterId}`)
  } else {
    navigateTo(`/play/${course.id}/chapter/${course.chapters[0].id}`)
  }
}
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">迷你课程平台</h1>
            <p class="mt-1 text-sm text-gray-500">精选技术课程，随时开始学习</p>
          </div>
          <div class="text-sm text-gray-500">
            共 {{ courses.length }} 门课程
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course.id"
          class="card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          @click="navigateToCourse(course)"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="course.cover"
              :alt="course.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {{ formatDuration(course.totalDuration) }}
            </div>
          </div>
          
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {{ course.chapters.length }} 节
              </span>
              <span class="text-xs text-gray-500">
                {{ getCourseCompletion(course.id, course.chapters.length) }}% 已完成
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {{ course.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ course.description }}
            </p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-gray-600">
                    {{ course.instructor.charAt(0) }}
                  </span>
                </div>
                <span class="text-sm text-gray-600">{{ course.instructor }}</span>
              </div>
              <span class="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                开始学习 →
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-gray-100 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-500">
          学习进度自动保存到本地
        </p>
      </div>
    </footer>
  </div>
</template>
