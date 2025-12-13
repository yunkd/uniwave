<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm sm:text-base"
      >
        <ChevronLeftIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="font-medium">목록으로</span>
      </button>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">실습 일지 상세</h1>
          <p class="text-xs sm:text-sm text-gray-600">{{ journal.date }}</p>
        </div>
        <div class="flex gap-2">
          <Button
            v-if="journal.status === 'DRAFT' || journal.status === 'REJECTED'"
            variant="outline"
            @click="handleEdit"
            class="text-xs sm:text-sm"
          >
            수정하기
          </Button>
        </div>
      </div>
    </div>

    <!-- 상태 카드 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4" :class="getStatusBgColor(journal.status)">
      <div class="flex items-start gap-3">
        <component
          :is="getStatusIcon(journal.status)"
          :class="getStatusIconColor(journal.status)"
          class="w-6 h-6 flex-shrink-0"
        />
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(journal.status)
              ]"
            >
              {{ getStatusLabel(journal.status) }}
            </span>
            <span v-if="journal.approvedAt" class="text-xs text-gray-500">
              승인일: {{ journal.approvedAt }}
            </span>
          </div>
          <p :class="getStatusTextColor(journal.status)" class="text-sm">
            {{ getStatusMessage(journal.status) }}
          </p>
        </div>
      </div>
    </Card>

    <!-- 기관 피드백 (있을 경우) -->
    <Card v-if="journal.feedback" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-blue-200">
      <div class="flex items-start gap-3">
        <ChatBubbleLeftIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="text-sm font-medium text-blue-900 mb-1">기관 담당자 피드백</p>
          <p class="text-sm text-blue-800">{{ journal.feedback }}</p>
        </div>
      </div>
    </Card>

    <!-- 일지 내용 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">실습 내용</h3>
      <div class="prose prose-sm sm:prose max-w-none">
        <p class="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{{ journal.content }}</p>
      </div>
    </Card>

    <!-- 첨부파일 (있을 경우) -->
    <Card v-if="journal.attachments && journal.attachments.length > 0" class="mb-4 sm:mb-6 p-3 sm:p-4">
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">첨부파일</h3>
      <div class="space-y-2">
        <div
          v-for="(file, index) in journal.attachments"
          :key="index"
          class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
          @click="handleDownload(file)"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <DocumentArrowDownIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            <span class="text-xs sm:text-sm text-gray-700 truncate">{{ file.name }}</span>
          </div>
          <span class="text-xs text-gray-500 ml-2">{{ file.size }}</span>
        </div>
      </div>
    </Card>

    <!-- 작성 정보 -->
    <Card class="p-3 sm:p-4">
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">작성 정보</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p class="text-xs text-gray-600 mb-0.5">작성일</p>
          <p class="text-sm font-medium text-gray-900">{{ journal.createdAt }}</p>
        </div>
        <div v-if="journal.updatedAt">
          <p class="text-xs text-gray-600 mb-0.5">수정일</p>
          <p class="text-sm font-medium text-gray-900">{{ journal.updatedAt }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-0.5">실습 기관</p>
          <p class="text-sm font-medium text-gray-900">{{ journal.institutionName }}</p>
        </div>
        <div v-if="journal.supervisorName">
          <p class="text-xs text-gray-600 mb-0.5">실습 지도자</p>
          <p class="text-sm font-medium text-gray-900">{{ journal.supervisorName }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// 임시 데이터: 일지 상세 (추후 API 연동)
const journal = ref({
  id: route.params.id,
  date: '2024-12-10',
  content: `오늘은 사회복지사 선생님과 함께 노인 복지 프로그램 기획 회의에 참여했습니다.

프로그램의 목적과 대상자를 명확히 하는 것이 중요하다는 것을 배웠습니다. 또한 예산 계획과 일정 관리의 중요성에 대해서도 이해하게 되었습니다.

회의 후에는 프로그램 기획안 초안을 작성하는 실습을 진행했습니다. 선생님의 피드백을 통해 기획안 작성 시 고려해야 할 사항들을 구체적으로 배울 수 있었습니다.`,
  status: 'APPROVED',
  feedback: '적극적인 참여 태도가 좋았습니다. 프로그램 기획안 작성도 잘 해주셨습니다.',
  attachments: [
    { name: '프로그램_기획안_초안.pdf', size: '245 KB', url: '/files/plan.pdf' },
    { name: '회의록.docx', size: '128 KB', url: '/files/meeting.docx' }
  ],
  institutionName: '사회복지법인 희망나눔',
  supervisorName: '김지도 사회복지사',
  createdAt: '2024-12-10 18:30',
  updatedAt: '2024-12-10 19:15',
  approvedAt: '2024-12-11 10:20'
})

onMounted(() => {
  // 추후 API 연동: GET /api/student/journal/:id
})

const handleEdit = () => {
  router.push(`/student/journal/write?id=${journal.value.id}`)
}

const handleDownload = (file: any) => {
  alert(`파일 다운로드 (추후 구현)\n${file.name}`)
  // 추후 구현:
  // const link = document.createElement('a')
  // link.href = file.url
  // link.download = file.name
  // link.click()
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    DRAFT: '임시저장',
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

const getStatusMessage = (status: string) => {
  const messages: Record<string, string> = {
    DRAFT: '임시저장된 일지입니다. 수정 후 제출하세요.',
    PENDING: '기관 담당자의 승인을 기다리는 중입니다.',
    APPROVED: '기관 담당자가 승인한 일지입니다.',
    REJECTED: '기관 담당자가 반려한 일지입니다. 피드백을 확인하고 수정 후 다시 제출하세요.'
  }
  return messages[status] || ''
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

const getStatusBgColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-50 border-gray-200',
    PENDING: 'bg-yellow-50 border-yellow-200',
    APPROVED: 'bg-green-50 border-green-200',
    REJECTED: 'bg-red-50 border-red-200'
  }
  return colors[status] || 'bg-gray-50 border-gray-200'
}

const getStatusTextColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: 'text-gray-700',
    PENDING: 'text-yellow-700',
    APPROVED: 'text-green-700',
    REJECTED: 'text-red-700'
  }
  return colors[status] || 'text-gray-700'
}

const getStatusIconColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: 'text-gray-600',
    PENDING: 'text-yellow-600',
    APPROVED: 'text-green-600',
    REJECTED: 'text-red-600'
  }
  return colors[status] || 'text-gray-600'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    DRAFT: DocumentIcon,
    PENDING: ClockIcon,
    APPROVED: CheckCircleIcon,
    REJECTED: XCircleIcon
  }
  return icons[status] || DocumentIcon
}
</script>
