<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 뒤로 가기 -->
    <Button
      variant="ghost"
      size="sm"
      @click="router.back()"
      class="mb-4 text-xs sm:text-sm"
    >
      <ChevronLeftIcon class="w-4 h-4 mr-1" />
      목록으로
    </Button>

    <!-- 학생 기본 정보 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl flex-shrink-0">
          {{ studentInfo.name[0] }}
        </div>
        <div class="flex-1">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{{ studentInfo.name }}</h1>
          <p class="text-sm text-gray-600">{{ studentInfo.studentId }} · {{ studentInfo.department }}</p>
        </div>
        <span
          :class="getStatusColor(studentInfo.status)"
          class="px-3 py-1.5 text-sm font-medium rounded-lg"
        >
          {{ getStatusLabel(studentInfo.status) }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-gray-500 mb-1">이메일</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.email }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">연락처</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.phone }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">학년</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.grade }}학년</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">등록일</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.registeredAt }}</p>
        </div>
      </div>
    </Card>

    <!-- 실습 정보 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">실습 정보</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500 mb-1">배정 기관</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.institution || '미배정' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">실습 기간</p>
          <p class="text-sm font-medium text-gray-900">{{ studentInfo.internshipPeriod }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">누적 시간</p>
          <p class="text-sm font-medium text-primary-600">{{ studentInfo.completedHours }} / {{ studentInfo.requiredHours }}시간</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">달성률</p>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-600 rounded-full transition-all"
                :style="{ width: `${studentInfo.progress}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ studentInfo.progress }}%</span>
          </div>
        </div>
      </div>
    </Card>

    <!-- 출석 및 일지 현황 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card class="p-4 sm:p-6">
        <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-4">출석 현황</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">승인</p>
            <p class="text-lg font-bold text-green-600">{{ studentInfo.attendance.approved }}</p>
          </div>
          <div class="text-center p-3 bg-yellow-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">대기</p>
            <p class="text-lg font-bold text-yellow-600">{{ studentInfo.attendance.pending }}</p>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">반려</p>
            <p class="text-lg font-bold text-red-600">{{ studentInfo.attendance.rejected }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4 sm:p-6">
        <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-4">일지 현황</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">승인</p>
            <p class="text-lg font-bold text-green-600">{{ studentInfo.journals.approved }}</p>
          </div>
          <div class="text-center p-3 bg-yellow-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">대기</p>
            <p class="text-lg font-bold text-yellow-600">{{ studentInfo.journals.pending }}</p>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">반려</p>
            <p class="text-lg font-bold text-red-600">{{ studentInfo.journals.rejected }}</p>
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
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// 학생 정보 (Mock)
const studentInfo = ref({
  name: '홍길동',
  studentId: '2021012345',
  department: '사회복지학과',
  email: 'hong@example.com',
  phone: '010-1234-5678',
  grade: 3,
  registeredAt: '2021-03-01',
  institution: '서울사회복지관',
  internshipPeriod: '2024-09-01 ~ 2024-12-31',
  completedHours: 144,
  requiredHours: 200,
  progress: 72,
  status: 'ACTIVE',
  attendance: {
    approved: 18,
    pending: 2,
    rejected: 0
  },
  journals: {
    approved: 15,
    pending: 1,
    rejected: 0
  }
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인대기',
    ACTIVE: '실습중',
    COMPLETED: '완료'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
