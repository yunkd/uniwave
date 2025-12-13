<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- 헤더 -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
      <p class="text-sm sm:text-base text-gray-600">대학에서 발송한 공지사항을 확인하세요</p>
    </div>

    <!-- 필터 및 검색 -->
    <div class="mb-6 space-y-4">
      <!-- 대상 필터 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="target in targets"
          :key="target.value"
          @click="selectedTarget = target.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedTarget === target.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          {{ target.label }}
        </button>
      </div>
      
      <!-- 카테고리 필터 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedCategory === category.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- 검색 -->
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="제목 또는 내용으로 검색..."
          class="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- 중요 공지사항 (상단 고정) -->
    <div v-if="pinnedNotices.length > 0" class="mb-6">
      <div class="flex items-center gap-2 mb-4">
        <BellAlertIcon class="w-5 h-5 text-red-600" />
        <h2 class="text-lg font-bold text-gray-900">중요 공지</h2>
      </div>
      <div class="space-y-3">
        <div
          v-for="notice in pinnedNotices"
          :key="notice.id"
          @click="goToDetail(notice.id)"
          class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', categoryConfig[notice.category].color]">
                  {{ categoryConfig[notice.category].label }}
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                  <BellIcon class="w-3 h-3 mr-1" />
                  필독
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                {{ notice.title }}
              </h3>
              <div class="text-sm text-gray-600 mb-3 line-clamp-2" v-html="getContentPreview(notice.content)"></div>
              <div class="flex items-center gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                <span class="flex items-center gap-1">
                  <CalendarIcon class="w-4 h-4" />
                  {{ formatDate(notice.created_at) }}
                </span>
                <span class="flex items-center gap-1">
                  <EyeIcon class="w-4 h-4" />
                  {{ notice.views }}
                </span>
                <span v-if="notice.attachments && notice.attachments.length > 0" class="flex items-center gap-1">
                  <PaperClipIcon class="w-4 h-4" />
                  {{ notice.attachments.length }}
                </span>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- 일반 공지사항 -->
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-4">전체 공지</h2>
      <div v-if="filteredNotices.length === 0" class="bg-white rounded-lg p-8 sm:p-12 text-center">
        <BellSlashIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-sm sm:text-base">공지사항이 없습니다</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="notice in paginatedNotices"
          :key="notice.id"
          @click="goToDetail(notice.id)"
          class="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', categoryConfig[notice.category].color]">
                  {{ categoryConfig[notice.category].label }}
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {{ notice.title }}
              </h3>
              <div class="text-sm text-gray-600 mb-3 line-clamp-2" v-html="getContentPreview(notice.content)"></div>
              <div class="flex items-center gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                <span class="flex items-center gap-1">
                  <CalendarIcon class="w-4 h-4" />
                  {{ formatDate(notice.created_at) }}
                </span>
                <span class="flex items-center gap-1">
                  <EyeIcon class="w-4 h-4" />
                  {{ notice.views }}
                </span>
                <span v-if="notice.attachments && notice.attachments.length > 0" class="flex items-center gap-1">
                  <PaperClipIcon class="w-4 h-4" />
                  {{ notice.attachments.length }}
                </span>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            이전
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellAlertIcon,
  BellIcon,
  BellSlashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  EyeIcon,
  PaperClipIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { mockNotices, categoryConfig } from '@/data/mockNotices'

const router = useRouter()

// 상태
const selectedTarget = ref<string>('ALL')
const selectedCategory = ref<string>('ALL')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 대상 옵션
const targets = [
  { label: '전체', value: 'ALL' },
  { label: '기관 대상', value: 'INSTITUTION' },
  { label: '전체 대상', value: 'ALL_TARGET' }
]

// 카테고리 옵션
const categories = [
  { label: '전체', value: 'ALL' },
  { label: 'OT', value: 'OT' },
  { label: '세미나', value: 'SEMINAR' },
  { label: '서류', value: 'DOCUMENT' },
  { label: '일정', value: 'SCHEDULE' },
  { label: '기타', value: 'ETC' }
]

// 중요 공지 (상단 고정)
const pinnedNotices = computed(() => {
  return mockNotices
    .filter(notice => !notice.is_deleted && notice.is_pinned)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// 일반 공지 (필터링)
const filteredNotices = computed(() => {
  let notices = mockNotices.filter(notice => !notice.is_deleted && !notice.is_pinned)

  // 대상 필터 (기관은 INSTITUTION 또는 ALL 대상 공지만 보기)
  if (selectedTarget.value === 'INSTITUTION') {
    notices = notices.filter(notice => notice.target === 'INSTITUTION' || notice.target === 'ALL')
  } else if (selectedTarget.value === 'ALL_TARGET') {
    notices = notices.filter(notice => notice.target === 'ALL')
  }
  // 'ALL' 선택 시 모든 공지 표시

  // 카테고리 필터
  if (selectedCategory.value !== 'ALL') {
    notices = notices.filter(notice => notice.category === selectedCategory.value)
  }

  // 검색
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notices = notices.filter(notice =>
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query)
    )
  }

  // 최신순 정렬
  return notices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// 페이지네이션
const totalPages = computed(() => Math.ceil(filteredNotices.value.length / itemsPerPage))

const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNotices.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1)

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// 함수
const getContentPreview = (content: string): string => {
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const goToDetail = (id: string) => {
  router.push(`/institution/notices/${id}`)
}
</script>
