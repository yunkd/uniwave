<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">대시보드</h1>
      <p class="text-xs sm:text-sm text-gray-600">전체 실습 관리 현황을 한눈에 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">전체 학생</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ stats.totalStudents }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UserGroupIcon class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-yellow-600 mb-1">승인 대기</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{{ stats.pendingStudents }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-green-600 mb-1">실습 중</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{{ stats.activeStudents }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-blue-600 mb-1">협력 기관</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{{ stats.totalInstitutions }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">개</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 2열 레이아웃 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <!-- 최근 학생 승인 요청 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">최근 학생 승인 요청</h3>
          <Button
            variant="ghost"
            size="sm"
            @click="router.push('/university/students?status=PENDING')"
            class="text-xs sm:text-sm"
          >
            전체 보기
          </Button>
        </div>

        <div v-if="pendingStudents.length === 0" class="text-center py-6 sm:py-8 text-gray-500">
          <UserGroupIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
          <p class="text-xs sm:text-sm">승인 대기 중인 학생이 없습니다</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="student in pendingStudents"
            :key="student.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="router.push(`/university/students/${student.id}`)"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ student.major }} · {{ student.studentId }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">승인대기</span>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      <!-- 최근 매칭 승인 요청 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">최근 매칭 승인 요청</h3>
          <Button
            variant="ghost"
            size="sm"
            @click="router.push('/university/matching-approval')"
            class="text-xs sm:text-sm"
          >
            전체 보기
          </Button>
        </div>

        <div v-if="recentMatchingRequests.length === 0" class="text-center py-6 sm:py-8 text-gray-500">
          <BuildingOfficeIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
          <p class="text-xs sm:text-sm">매칭 승인 요청이 없습니다</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="request in recentMatchingRequests"
            :key="request.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="router.push('/university/matching-approval')"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ request.studentName }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ request.institutionName }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ request.requestDate }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ getMatchingStatusLabel(request.status) }}
              </span>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 최근 공지사항 -->
    <Card class="p-3 sm:p-4 lg:p-6">
      <div class="flex items-center justify-between mb-3 sm:mb-4">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">최근 공지사항</h3>
        <Button
          variant="ghost"
          size="sm"
          @click="router.push('/university/notices')"
          class="text-xs sm:text-sm"
        >
          전체 보기
        </Button>
      </div>

      <div v-if="recentNotices.length === 0" class="text-center py-6 sm:py-8 text-gray-500">
        <BellAlertIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
        <p class="text-xs sm:text-sm">공지사항이 없습니다</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="notice in recentNotices"
          :key="notice.id"
          class="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          @click="router.push(`/university/notices/${notice.id}`)"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getCategoryColor(notice.category)]">
                {{ getCategoryLabel(notice.category) }}
              </span>
              <span v-if="notice.is_pinned" class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                중요
              </span>
            </div>
            <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ notice.title }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(notice.created_at) }}</p>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  BellAlertIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 통계 데이터 (Mock)
const stats = ref({
  totalStudents: 145,
  pendingStudents: 8,
  activeStudents: 98,
  totalInstitutions: 24
})

// 승인 대기 학생 (Mock)
const pendingStudents = ref([
  {
    id: '1',
    name: '홍길동',
    studentId: '2021012345',
    major: '사회복지학과'
  },
  {
    id: '2',
    name: '김영희',
    studentId: '2021023456',
    major: '사회복지학과'
  },
  {
    id: '3',
    name: '이철수',
    studentId: '2021034567',
    major: '아동복지학과'
  }
])

// 최근 매칭 승인 요청 (Mock)
const recentMatchingRequests = ref([
  {
    id: '1',
    studentName: '박민수',
    institutionName: '서울사회복지관',
    requestDate: '2024-12-13',
    status: 'PENDING'
  },
  {
    id: '2',
    studentName: '정수진',
    institutionName: '강남노인복지센터',
    requestDate: '2024-12-12',
    status: 'PENDING'
  },
  {
    id: '3',
    studentName: '최영수',
    institutionName: '서초종합사회복지관',
    requestDate: '2024-12-11',
    status: 'APPROVED'
  }
])

// 최근 공지사항 (Mock)
const recentNotices = ref([
  {
    id: '1',
    title: '2025년 1학기 실습 오리엔테이션 안내',
    category: 'OT',
    is_pinned: true,
    created_at: '2024-12-10'
  },
  {
    id: '2',
    title: '실습 서류 제출 기한 안내',
    category: 'DOCUMENT',
    is_pinned: false,
    created_at: '2024-12-09'
  },
  {
    id: '3',
    title: '중간 평가 일정 안내',
    category: 'SCHEDULE',
    is_pinned: false,
    created_at: '2024-12-08'
  }
])

// 매칭 상태 라벨
const getMatchingStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

// 카테고리 라벨
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    OT: 'OT',
    SEMINAR: '세미나',
    DOCUMENT: '서류',
    SCHEDULE: '일정',
    ETC: '기타'
  }
  return labels[category] || category
}

// 카테고리 색상
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    OT: 'bg-purple-100 text-purple-800',
    SEMINAR: 'bg-blue-100 text-blue-800',
    DOCUMENT: 'bg-green-100 text-green-800',
    SCHEDULE: 'bg-orange-100 text-orange-800',
    ETC: 'bg-gray-100 text-gray-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}월 ${day}일`
}
</script>
