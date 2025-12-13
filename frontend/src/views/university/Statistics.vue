<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">전체 통계</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습 관리 통계를 상세하게 확인하세요</p>
    </div>

    <!-- 기간 선택 -->
    <Card class="p-3 sm:p-4 mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label class="text-xs sm:text-sm font-medium text-gray-700">기간 선택</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="period in periods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors',
              selectedPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </Card>

    <!-- 주요 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">전체 학생</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ overallStats.totalStudents }}<span class="text-sm sm:text-base font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UserGroupIcon class="w-5 h-5 text-primary-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-green-600 mb-1">실습 중</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{{ overallStats.activeStudents }}<span class="text-sm sm:text-base font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-blue-600 mb-1">실습 완료</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{{ overallStats.completedStudents }}<span class="text-sm sm:text-base font-normal text-gray-600 ml-1">명</span></p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentCheckIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-purple-600 mb-1">협력 기관</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{{ overallStats.totalInstitutions }}<span class="text-sm sm:text-base font-normal text-gray-600 ml-1">개</span></p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 2열 레이아웃 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <!-- 학과별 실습 현황 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">학과별 실습 현황</h3>
        <div class="space-y-3">
          <div v-for="dept in departmentStats" :key="dept.name" class="space-y-2">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="font-medium text-gray-900">{{ dept.name }}</span>
              <span class="text-gray-600">{{ dept.active }} / {{ dept.total }}명</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-600 rounded-full transition-all"
                :style="{ width: `${(dept.active / dept.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 기관별 매칭 현황 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">기관별 매칭 현황 Top 5</h3>
        <div class="space-y-3">
          <div
            v-for="(institution, index) in topInstitutions"
            :key="institution.id"
            class="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-200 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ institution.name }}</p>
              <p class="text-xs text-gray-500">{{ institution.type }}</p>
            </div>
            <span class="text-sm sm:text-base font-bold text-primary-600">{{ institution.studentCount }}명</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- 출석 및 일지 통계 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- 출석 승인 통계 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">출석 승인 통계</h3>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">승인</p>
            <p class="text-lg sm:text-xl font-bold text-green-600">{{ attendanceStats.approved }}</p>
          </div>
          <div class="text-center p-3 bg-yellow-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">대기</p>
            <p class="text-lg sm:text-xl font-bold text-yellow-600">{{ attendanceStats.pending }}</p>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">반려</p>
            <p class="text-lg sm:text-xl font-bold text-red-600">{{ attendanceStats.rejected }}</p>
          </div>
        </div>
        <div class="pt-3 border-t border-gray-200">
          <div class="flex justify-between text-xs sm:text-sm">
            <span class="text-gray-600">평균 승인율</span>
            <span class="font-bold text-green-600">{{ attendanceStats.approvalRate }}%</span>
          </div>
        </div>
      </Card>

      <!-- 일지 승인 통계 -->
      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">일지 승인 통계</h3>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">승인</p>
            <p class="text-lg sm:text-xl font-bold text-green-600">{{ journalStats.approved }}</p>
          </div>
          <div class="text-center p-3 bg-yellow-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">대기</p>
            <p class="text-lg sm:text-xl font-bold text-yellow-600">{{ journalStats.pending }}</p>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">반려</p>
            <p class="text-lg sm:text-xl font-bold text-red-600">{{ journalStats.rejected }}</p>
          </div>
        </div>
        <div class="pt-3 border-t border-gray-200">
          <div class="flex justify-between text-xs sm:text-sm">
            <span class="text-gray-600">평균 승인율</span>
            <span class="font-bold text-green-600">{{ journalStats.approvalRate }}%</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/common/Card.vue'
import {
  UserGroupIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

// 기간 선택
const periods = [
  { label: '이번 주', value: 'week' },
  { label: '이번 달', value: 'month' },
  { label: '이번 학기', value: 'semester' },
  { label: '올해', value: 'year' }
]
const selectedPeriod = ref('semester')

// 전체 통계 (Mock)
const overallStats = ref({
  totalStudents: 145,
  activeStudents: 98,
  completedStudents: 39,
  totalInstitutions: 24
})

// 학과별 통계 (Mock)
const departmentStats = ref([
  { name: '사회복지학과', total: 85, active: 62 },
  { name: '아동복지학과', total: 45, active: 28 },
  { name: '노인복지학과', total: 15, active: 8 }
])

// 기관별 매칭 현황 Top 5 (Mock)
const topInstitutions = ref([
  { id: '1', name: '서울사회복지관', type: '사회복지관', studentCount: 18 },
  { id: '2', name: '강남노인복지센터', type: '노인복지시설', studentCount: 15 },
  { id: '3', name: '아이사랑어린이집', type: '아동복지시설', studentCount: 12 },
  { id: '4', name: '희망재활센터', type: '장애인복지시설', studentCount: 10 },
  { id: '5', name: '행복지역아동센터', type: '아동복지시설', studentCount: 9 }
])

// 출석 승인 통계 (Mock)
const attendanceStats = ref({
  approved: 1245,
  pending: 28,
  rejected: 15,
  approvalRate: 97.8
})

// 일지 승인 통계 (Mock)
const journalStats = ref({
  approved: 982,
  pending: 15,
  rejected: 8,
  approvalRate: 97.7
})
</script>
