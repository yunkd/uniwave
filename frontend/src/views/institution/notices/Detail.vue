<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div v-if="!notice" class="bg-white rounded-lg p-8 sm:p-12 text-center">
      <p class="text-gray-500">공지사항을 찾을 수 없습니다</p>
      <button
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        목록으로 돌아가기
      </button>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- 헤더 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">목록으로</span>
        </button>
      </div>

      <!-- 공지사항 상세 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- 헤더 -->
        <div class="border-b border-gray-200 p-6 sm:p-8">
          <!-- 카테고리 및 상태 -->
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', categoryConfig[notice.category].color]">
              {{ categoryConfig[notice.category].label }}
            </span>
            <span v-if="notice.is_pinned" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
              <BellIcon class="w-4 h-4 mr-1" />
              중요
            </span>
          </div>

          <!-- 제목 -->
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {{ notice.title }}
          </h1>

          <!-- 메타 정보 -->
          <div class="flex items-center gap-4 sm:gap-6 text-sm text-gray-500 flex-wrap">
            <span class="flex items-center gap-2">
              <CalendarIcon class="w-5 h-5" />
              {{ formatDate(notice.created_at) }}
            </span>
            <span class="flex items-center gap-2">
              <EyeIcon class="w-5 h-5" />
              조회 {{ notice.views }}
            </span>
          </div>

          <!-- 게시 기간 -->
          <div v-if="notice.start_date || notice.end_date" class="mt-4 p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-blue-800">
              <ClockIcon class="w-5 h-5" />
              <span class="font-medium">게시 기간:</span>
              <span>{{ formatDateRange(notice.start_date, notice.end_date) }}</span>
            </div>
          </div>
        </div>

        <!-- 내용 -->
        <div class="p-6 sm:p-8">
          <div 
            class="prose prose-sm sm:prose max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700"
            v-html="notice.content"
          ></div>
        </div>

        <!-- 첨부파일 -->
        <div v-if="notice.attachments && notice.attachments.length > 0" class="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PaperClipIcon class="w-5 h-5" />
            첨부파일
          </h3>
          <div class="space-y-2">
            <a
              v-for="(file, index) in notice.attachments"
              :key="index"
              :href="file.url"
              download
              class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <DocumentIcon class="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>
              <ArrowDownTrayIcon class="w-5 h-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
            </a>
          </div>
        </div>

        <!-- 하단 버튼 -->
        <div class="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
          <button
            @click="router.back()"
            class="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  CalendarIcon,
  EyeIcon,
  ClockIcon,
  BellIcon,
  PaperClipIcon,
  DocumentIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import { mockNotices, categoryConfig, formatFileSize } from '@/data/mockNotices'
import type { Notice } from '@/data/mockNotices'

const route = useRoute()
const router = useRouter()

const notice = ref<Notice | null>(null)

onMounted(() => {
  const id = route.params.id as string
  const found = mockNotices.find(n => n.id === id && !n.is_deleted)
  
  if (found) {
    notice.value = found
    // 조회수 증가 (실제로는 API 호출)
    found.views++
  }
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (!startDate && !endDate) return ''
  
  const formatShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  if (startDate && endDate) {
    return `${formatShort(startDate)} ~ ${formatShort(endDate)}`
  } else if (startDate) {
    return `${formatShort(startDate)}부터`
  } else {
    return `${formatShort(endDate!)}까지`
  }
}
</script>
