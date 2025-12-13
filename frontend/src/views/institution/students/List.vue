<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">실습생 관리</h1>
      <p class="text-xs sm:text-sm text-gray-600">매칭된 실습생을 관리하고 진행 상황을 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">전체 실습생</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.total }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-green-600">진행중</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ stats.active }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-blue-600">완료</p>
          <p class="text-lg sm:text-2xl font-bold text-blue-600">{{ stats.completed }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">평균 달성률</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.avgProgress }}%</p>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedUniversity"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 대학</option>
          <option value="서울대학교">서울대학교</option>
          <option value="연세대학교">연세대학교</option>
          <option value="고려대학교">고려대학교</option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="ACTIVE">진행중</option>
          <option value="COMPLETED">완료</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="학생 이름으로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 실습생 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredStudents.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <UserGroupIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600">매칭된 실습생이 없습니다</p>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소속 대학
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석 현황
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                일지 현황
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                실습 시간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                달성률
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {{ student.name[0] }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                    <p class="text-xs text-gray-500">{{ student.studentId }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ student.university }}</p>
                <p class="text-xs text-gray-500">{{ student.major }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <span class="text-green-600 font-medium">{{ student.attendance.approved }}</span>
                  <span class="text-gray-400 mx-1">/</span>
                  <span class="text-yellow-600">{{ student.attendance.pending }}</span>
                  <span class="text-gray-400 mx-1">/</span>
                  <span class="text-red-600">{{ student.attendance.rejected }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">승인/대기/반려</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <span class="text-green-600 font-medium">{{ student.journals.approved }}</span>
                  <span class="text-gray-400 mx-1">/</span>
                  <span class="text-yellow-600">{{ student.journals.pending }}</span>
                  <span class="text-gray-400 mx-1">/</span>
                  <span class="text-red-600">{{ student.journals.rejected }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">승인/대기/반려</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-medium text-gray-900">{{ student.totalHours }}시간</p>
                <p class="text-xs text-gray-500">/ {{ student.requiredHours }}시간</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-600 rounded-full transition-all"
                      :style="{ width: `${student.progress}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-10 text-right">{{ student.progress }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusColor(student.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(student.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleViewDetail(student)"
                >
                  상세 보기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 뷰 -->
      <div v-if="filteredStudents.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="p-4 hover:bg-gray-50 transition-colors"
          @click="handleViewDetail(student)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                {{ student.name[0] }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                <p class="text-xs text-gray-500">{{ student.university }}</p>
              </div>
            </div>
            <span
              :class="getStatusColor(student.status)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ getStatusLabel(student.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p class="text-xs text-gray-500 mb-1">출석 현황</p>
              <p class="text-sm">
                <span class="text-green-600 font-medium">{{ student.attendance.approved }}</span>
                <span class="text-gray-400 mx-1">/</span>
                <span class="text-yellow-600">{{ student.attendance.pending }}</span>
                <span class="text-gray-400 mx-1">/</span>
                <span class="text-red-600">{{ student.attendance.rejected }}</span>
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">일지 현황</p>
              <p class="text-sm">
                <span class="text-green-600 font-medium">{{ student.journals.approved }}</span>
                <span class="text-gray-400 mx-1">/</span>
                <span class="text-yellow-600">{{ student.journals.pending }}</span>
                <span class="text-gray-400 mx-1">/</span>
                <span class="text-red-600">{{ student.journals.rejected }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">실습 시간</p>
              <p class="text-sm font-medium text-gray-900">{{ student.totalHours }} / {{ student.requiredHours }}시간</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 mb-1">달성률</p>
              <p class="text-sm font-medium text-primary-600">{{ student.progress }}%</p>
            </div>
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
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 필터 상태
const selectedUniversity = ref('ALL')
const selectedStatus = ref('ALL')
const searchQuery = ref('')

// 통계 데이터 (Mock)
const stats = ref({
  total: 12,
  active: 10,
  completed: 2,
  avgProgress: 67
})

// 실습생 목록 (Mock)
const students = ref([
  {
    id: '1',
    name: '홍길동',
    studentId: '2021012345',
    university: '서울대학교',
    major: '사회복지학과',
    attendance: { approved: 18, pending: 2, rejected: 0 },
    journals: { approved: 15, pending: 1, rejected: 0 },
    totalHours: 144,
    requiredHours: 200,
    progress: 72,
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: '김영희',
    studentId: '2021023456',
    university: '서울대학교',
    major: '사회복지학과',
    attendance: { approved: 15, pending: 1, rejected: 1 },
    journals: { approved: 12, pending: 2, rejected: 0 },
    totalHours: 120,
    requiredHours: 200,
    progress: 60,
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: '이철수',
    studentId: '2021034567',
    university: '연세대학교',
    major: '사회복지학과',
    attendance: { approved: 25, pending: 0, rejected: 0 },
    journals: { approved: 20, pending: 0, rejected: 0 },
    totalHours: 200,
    requiredHours: 200,
    progress: 100,
    status: 'COMPLETED'
  },
  {
    id: '4',
    name: '박민수',
    studentId: '2021045678',
    university: '고려대학교',
    major: '사회복지학과',
    attendance: { approved: 12, pending: 3, rejected: 0 },
    journals: { approved: 10, pending: 1, rejected: 1 },
    totalHours: 96,
    requiredHours: 200,
    progress: 48,
    status: 'ACTIVE'
  }
])

// 필터링된 실습생 목록
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesUniversity = selectedUniversity.value === 'ALL' || student.university === selectedUniversity.value
    const matchesStatus = selectedStatus.value === 'ALL' || student.status === selectedStatus.value
    const matchesSearch = !searchQuery.value || student.name.includes(searchQuery.value)
    return matchesUniversity && matchesStatus && matchesSearch
  })
})

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACTIVE: '진행중',
    COMPLETED: '완료'
  }
  return labels[status] || status
}

// 상태 색상
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// 상세 보기
const handleViewDetail = (student: any) => {
  router.push(`/institution/students/${student.id}`)
}
</script>
