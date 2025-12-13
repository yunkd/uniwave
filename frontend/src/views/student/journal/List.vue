<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">실습 일지</h1>
        <p class="text-xs sm:text-sm text-gray-600">작성한 실습 일지를 확인하고 관리하세요</p>
      </div>
      <Button
        variant="primary"
        @click="router.push('/student/journal/write')"
        class="text-xs sm:text-sm"
      >
        <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
        일지 작성
      </Button>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">전체</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ totalCount }}개</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-yellow-600">승인대기</p>
          <p class="text-lg sm:text-2xl font-bold text-yellow-600">{{ pendingCount }}개</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-green-600">승인완료</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ approvedCount }}개</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-red-600">반려</p>
          <p class="text-lg sm:text-2xl font-bold text-red-600">{{ rejectedCount }}개</p>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="DRAFT">임시저장</option>
          <option value="PENDING">승인대기</option>
          <option value="APPROVED">승인완료</option>
          <option value="REJECTED">반려</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="일지 내용으로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 일지 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredJournals.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <DocumentTextIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600 mb-4">작성된 실습 일지가 없습니다</p>
        <Button
          variant="primary"
          @click="router.push('/student/journal/write')"
          class="text-xs sm:text-sm"
        >
          <PlusIcon class="w-4 h-4 mr-1.5" />
          첫 일지 작성하기
        </Button>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                실습 내용
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관 피드백
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="journal in filteredJournals" :key="journal.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ journal.date }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <p class="line-clamp-2">{{ journal.content }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(journal.status)
                  ]"
                >
                  {{ getStatusLabel(journal.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <p v-if="journal.feedback" class="line-clamp-1">{{ journal.feedback }}</p>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="handleView(journal)"
                    class="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    보기
                  </button>
                  <button
                    v-if="journal.status === 'DRAFT' || journal.status === 'REJECTED'"
                    @click="handleEdit(journal)"
                    class="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    수정
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 -->
      <div v-if="filteredJournals.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="journal in filteredJournals"
          :key="journal.id"
          class="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer"
          @click="handleView(journal)"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs text-gray-500">{{ journal.date }}</span>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(journal.status)
              ]"
            >
              {{ getStatusLabel(journal.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-900 mb-2 line-clamp-2">{{ journal.content }}</p>
          <div v-if="journal.feedback" class="text-xs text-gray-600 mb-2 flex items-start gap-1">
            <ChatBubbleLeftIcon class="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span class="line-clamp-1">{{ journal.feedback }}</span>
          </div>
          <div class="flex items-center justify-end gap-2 text-xs">
            <button
              v-if="journal.status === 'DRAFT' || journal.status === 'REJECTED'"
              @click.stop="handleEdit(journal)"
              class="text-primary-600 font-medium"
            >
              수정
            </button>
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const selectedStatus = ref('ALL')
const searchQuery = ref('')

// 임시 데이터: 실습 일지 목록 (추후 API 연동)
const journals = ref([
  {
    id: '1',
    date: '2024-12-10',
    content: '오늘은 사회복지사 선생님과 함께 노인 복지 프로그램 기획 회의에 참여했습니다. 프로그램의 목적과 대상자를 명확히 하는 것이 중요하다는 것을 배웠습니다.',
    status: 'APPROVED',
    feedback: '적극적인 참여 태도가 좋았습니다.'
  },
  {
    id: '2',
    date: '2024-12-11',
    content: '복지관 이용자 상담 과정을 관찰하고, 상담 기록지 작성 방법을 학습했습니다.',
    status: 'PENDING',
    feedback: null
  },
  {
    id: '3',
    date: '2024-12-12',
    content: '아동 복지 프로그램 진행을 보조하며 아이들과 함께 활동했습니다.',
    status: 'APPROVED',
    feedback: '아이들과의 소통 능력이 뛰어납니다.'
  },
  {
    id: '4',
    date: '2024-12-13',
    content: '임시 저장된 일지입니다.',
    status: 'DRAFT',
    feedback: null
  },
  {
    id: '5',
    date: '2024-12-09',
    content: '일지 내용이 부족합니다. 좀 더 구체적으로 작성해주세요.',
    status: 'REJECTED',
    feedback: '실습 내용을 더 구체적으로 작성해주세요.'
  }
])

const filteredJournals = computed(() => {
  return journals.value.filter(journal => {
    const matchesStatus = selectedStatus.value === 'ALL' || journal.status === selectedStatus.value
    const matchesSearch = !searchQuery.value || journal.content.includes(searchQuery.value)
    return matchesStatus && matchesSearch
  })
})

const totalCount = computed(() => journals.value.length)
const pendingCount = computed(() => journals.value.filter(j => j.status === 'PENDING').length)
const approvedCount = computed(() => journals.value.filter(j => j.status === 'APPROVED').length)
const rejectedCount = computed(() => journals.value.filter(j => j.status === 'REJECTED').length)

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    DRAFT: '임시저장',
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const handleView = (journal: any) => {
  router.push(`/student/journal/${journal.id}`)
}

const handleEdit = (journal: any) => {
  // 수정 페이지로 이동 (추후 구현: query 파라미터로 ID 전달)
  router.push(`/student/journal/write?id=${journal.id}`)
}
</script>
