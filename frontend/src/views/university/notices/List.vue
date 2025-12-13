<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- 헤더 -->
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
        <p class="text-sm sm:text-base text-gray-600">학생과 기관에게 공지사항을 작성하고 관리하세요</p>
      </div>
      <button
        @click="router.push('/university/notices/create')"
        class="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        <span>공지사항 작성</span>
      </button>
    </div>

    <!-- 필터 및 검색 -->
    <div class="mb-6 space-y-4">
      <!-- 필터 옵션 -->
      <div class="flex flex-wrap gap-2">
        <!-- 카테고리 필터 -->
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="ALL">전체 카테고리</option>
          <option value="OT">OT</option>
          <option value="SEMINAR">세미나</option>
          <option value="DOCUMENT">서류</option>
          <option value="SCHEDULE">일정</option>
          <option value="ETC">기타</option>
        </select>

        <!-- 상태 필터 -->
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="ACTIVE">게시중</option>
          <option value="EXPIRED">종료</option>
        </select>

        <!-- 고정 필터 -->
        <label class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            v-model="showPinnedOnly"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="text-sm text-gray-700">중요 공지만</span>
        </label>
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

    <!-- 공지사항 목록 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="filteredNotices.length === 0" class="p-8 sm:p-12 text-center">
        <BellSlashIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-sm sm:text-base">공지사항이 없습니다</p>
      </div>

      <!-- 테이블 (데스크톱) -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                고정
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                카테고리
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                게시 기간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                조회수
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                작성일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="notice in paginatedNotices"
              :key="notice.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="goToDetail(notice.id)"
            >
              <td class="px-6 py-4">
                <BellIcon v-if="notice.is_pinned" class="w-5 h-5 text-red-500" />
              </td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', categoryConfig[notice.category].color]">
                  {{ categoryConfig[notice.category].label }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">{{ notice.title }}</span>
                  <PaperClipIcon v-if="notice.attachments && notice.attachments.length > 0" class="w-4 h-4 text-gray-400" />
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDateRange(notice.start_date, notice.end_date) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ notice.views }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(notice.created_at) }}
              </td>
              <td class="px-6 py-4" @click.stop>
                <div class="flex items-center gap-2">
                  <button
                    @click="editNotice(notice.id)"
                    class="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                    title="수정"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteNotice(notice.id)"
                    class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="삭제"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 카드 (모바일/태블릿) -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="notice in paginatedNotices"
          :key="notice.id"
          @click="goToDetail(notice.id)"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', categoryConfig[notice.category].color]">
                {{ categoryConfig[notice.category].label }}
              </span>
              <span v-if="notice.is_pinned" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                <BellIcon class="w-3 h-3 mr-1" />
                중요
              </span>
            </div>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">{{ notice.title }}</h3>
          <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <CalendarIcon class="w-4 h-4" />
              {{ formatDate(notice.created_at) }}
            </span>
            <span class="flex items-center gap-1">
              <EyeIcon class="w-4 h-4" />
              {{ notice.views }}
            </span>
          </div>
          <div class="flex items-center gap-2" @click.stop>
            <button
              @click="editNotice(notice.id)"
              class="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              수정
            </button>
            <button
              @click="deleteNotice(notice.id)"
              class="flex-1 px-3 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="border-t border-gray-200 p-4 flex justify-center">
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
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  BellSlashIcon,
  PaperClipIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { mockNotices, categoryConfig } from '@/data/mockNotices'

const router = useRouter()

// 상태
const selectedCategory = ref<string>('ALL')
const selectedStatus = ref<string>('ALL')
const showPinnedOnly = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

// 필터링된 공지사항
const filteredNotices = computed(() => {
  let notices = mockNotices.filter(notice => !notice.is_deleted)

  // 카테고리 필터
  if (selectedCategory.value !== 'ALL') {
    notices = notices.filter(notice => notice.category === selectedCategory.value)
  }

  // 상태 필터
  if (selectedStatus.value !== 'ALL') {
    const now = new Date()
    notices = notices.filter(notice => {
      const isActive = !notice.end_date || new Date(notice.end_date) >= now
      return selectedStatus.value === 'ACTIVE' ? isActive : !isActive
    })
  }

  // 고정 필터
  if (showPinnedOnly.value) {
    notices = notices.filter(notice => notice.is_pinned)
  }

  // 검색
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notices = notices.filter(notice =>
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query)
    )
  }

  // 고정 공지 우선, 최신순 정렬
  return notices.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
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
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (!startDate && !endDate) return '-'
  
  const formatShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
  }
  
  if (startDate && endDate) {
    return `${formatShort(startDate)} ~ ${formatShort(endDate)}`
  } else if (startDate) {
    return `${formatShort(startDate)}부터`
  } else {
    return `${formatShort(endDate!)}까지`
  }
}

const goToDetail = (id: string) => {
  router.push(`/university/notices/${id}`)
}

const editNotice = (id: string) => {
  router.push(`/university/notices/${id}/edit`)
}

const deleteNotice = (id: string) => {
  if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
    // 실제로는 API 호출
    const notice = mockNotices.find(n => n.id === id)
    if (notice) {
      notice.is_deleted = true
      alert('공지사항이 삭제되었습니다')
    }
  }
}
</script>
