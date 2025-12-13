<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">대시보드</h1>
      <p class="text-xs sm:text-sm lg:text-base text-gray-600">실습생 관리 현황을 한눈에 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">전체 실습생</p>
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
            <p class="text-xs sm:text-sm text-yellow-600 mb-1">출석 승인 대기</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{{ stats.pendingAttendance }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">건</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-blue-600 mb-1">일지 승인 대기</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{{ stats.pendingJournals }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">건</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-green-600 mb-1">이번 달 승인</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{{ stats.monthlyApproved }}<span class="text-sm sm:text-base lg:text-lg font-normal text-gray-600 ml-1">건</span></p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- 최근 출석 승인 요청 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">최근 출석 승인 요청</h3>
          <Button
            variant="ghost"
            size="sm"
            @click="router.push('/institution/attendance')"
            class="text-xs sm:text-sm"
          >
            전체 보기
          </Button>
        </div>

        <div v-if="recentAttendance.length === 0" class="text-center py-6 sm:py-8 text-gray-500">
          <ClipboardDocumentCheckIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
          <p class="text-xs sm:text-sm">승인 대기 중인 출석이 없습니다</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in recentAttendance"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="router.push('/institution/attendance')"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ item.studentName }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ item.date }} · {{ item.hours }}시간</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">대기중</span>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      <!-- 최근 일지 승인 요청 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">최근 일지 승인 요청</h3>
          <Button
            variant="ghost"
            size="sm"
            @click="router.push('/institution/journal-approval')"
            class="text-xs sm:text-sm"
          >
            전체 보기
          </Button>
        </div>

        <div v-if="recentJournals.length === 0" class="text-center py-6 sm:py-8 text-gray-500">
          <DocumentTextIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
          <p class="text-xs sm:text-sm">승인 대기 중인 일지가 없습니다</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in recentJournals"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="router.push('/institution/journal-approval')"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ item.studentName }}</p>
              <p class="text-xs text-gray-600 mt-0.5 line-clamp-1">{{ item.content }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.date }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">대기중</span>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>
    </div>
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
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 통계 데이터 (Mock)
const stats = ref({
  totalStudents: 12,
  pendingAttendance: 5,
  pendingJournals: 3,
  monthlyApproved: 48
})

// 최근 출석 승인 요청 (Mock)
const recentAttendance = ref([
  {
    id: '1',
    studentName: '홍길동',
    date: '2024-12-13',
    hours: 8
  },
  {
    id: '2',
    studentName: '김영희',
    date: '2024-12-13',
    hours: 7.5
  },
  {
    id: '3',
    studentName: '이철수',
    date: '2024-12-12',
    hours: 8
  },
  {
    id: '4',
    studentName: '박민수',
    date: '2024-12-12',
    hours: 6
  },
  {
    id: '5',
    studentName: '정수진',
    date: '2024-12-11',
    hours: 8
  }
])

// 최근 일지 승인 요청 (Mock)
const recentJournals = ref([
  {
    id: '1',
    studentName: '홍길동',
    content: '오늘은 사회복지사 선생님과 함께 노인 복지 프로그램 기획 회의에 참여했습니다...',
    date: '2024-12-13'
  },
  {
    id: '2',
    studentName: '김영희',
    content: '복지관 이용자 상담 과정을 관찰하고, 상담 기록지 작성 방법을 학습했습니다...',
    date: '2024-12-12'
  },
  {
    id: '3',
    studentName: '이철수',
    content: '아동 복지 프로그램 진행을 보조하며 아이들과 함께 활동했습니다...',
    date: '2024-12-11'
  }
])
</script>
