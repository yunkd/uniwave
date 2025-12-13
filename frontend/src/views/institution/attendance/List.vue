<template>
  <div class="p-4 md:p-6">
    <!-- 페이지 헤더 -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">출석 승인 관리</h1>
      <p class="text-gray-600">실습생들의 출석을 검토하고 승인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">전체 출석</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalAttendances }}</p>
          </div>
          <CalendarIcon class="w-10 h-10 text-blue-500 opacity-20" />
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 대기</p>
            <p class="text-2xl font-bold text-yellow-600">{{ pendingAttendances }}</p>
          </div>
          <ClockIcon class="w-10 h-10 text-yellow-500 opacity-20" />
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 완료</p>
            <p class="text-2xl font-bold text-green-600">{{ approvedAttendances }}</p>
          </div>
          <CheckCircleIcon class="w-10 h-10 text-green-500 opacity-20" />
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">반려</p>
            <p class="text-2xl font-bold text-red-600">{{ rejectedAttendances }}</p>
          </div>
          <XCircleIcon class="w-10 h-10 text-red-500 opacity-20" />
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 상태 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <select 
            v-model="filters.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체</option>
            <option value="PENDING">승인 대기</option>
            <option value="APPROVED">승인 완료</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>

        <!-- 실습생 검색 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">실습생</label>
          <input
            v-model="filters.studentName"
            type="text"
            placeholder="이름 검색"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- 날짜 범위 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">시작일</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">종료일</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- 필터 버튼 -->
      <div class="flex gap-2 mt-4">
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          초기화
        </button>
      </div>
    </div>

    <!-- 출석 목록 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- 데스크톱 테이블 -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                실습생
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석 시간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                퇴근 시간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                실습 시간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="attendance in filteredAttendances" :key="attendance.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ attendance.studentName }}</div>
                    <div class="text-sm text-gray-500">{{ attendance.studentId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(attendance.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ attendance.checkIn }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ attendance.checkOut }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ attendance.hours }}시간
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(attendance.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(attendance.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="attendance.status === 'PENDING'"
                  @click="openApprovalModal(attendance)"
                  class="text-blue-600 hover:text-blue-800 font-medium mr-3"
                >
                  검토
                </button>
                <button
                  @click="viewAttendance(attendance)"
                  class="text-gray-600 hover:text-gray-800"
                >
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 빈 상태 -->
        <div v-if="filteredAttendances.length === 0" class="text-center py-12">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">출석 기록이 없습니다</h3>
          <p class="mt-1 text-sm text-gray-500">조건에 맞는 출석 기록이 없습니다.</p>
        </div>
      </div>

      <!-- 모바일 카드 -->
      <div class="md:hidden">
        <div v-for="attendance in filteredAttendances" :key="attendance.id" class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-medium text-gray-900">{{ attendance.studentName }}</div>
              <div class="text-sm text-gray-500">{{ attendance.studentId }}</div>
            </div>
            <span :class="getStatusClass(attendance.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ getStatusLabel(attendance.status) }}
            </span>
          </div>
          <div class="text-sm text-gray-600 mb-2">{{ formatDate(attendance.date) }}</div>
          <div class="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span class="text-gray-500">출석:</span> {{ attendance.checkIn }}
            </div>
            <div>
              <span class="text-gray-500">퇴근:</span> {{ attendance.checkOut }}
            </div>
            <div>
              <span class="text-gray-500">실습시간:</span> {{ attendance.hours }}시간
            </div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="attendance.status === 'PENDING'"
              @click="openApprovalModal(attendance)"
              class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              style="min-height: 44px;"
            >
              검토
            </button>
            <button
              @click="viewAttendance(attendance)"
              class="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
              style="min-height: 44px;"
            >
              상세보기
            </button>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div v-if="filteredAttendances.length === 0" class="text-center py-12">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">출석 기록이 없습니다</h3>
          <p class="mt-1 text-sm text-gray-500">조건에 맞는 출석 기록이 없습니다.</p>
        </div>
      </div>
    </div>

    <!-- 승인/반려 모달 -->
    <div v-if="showApprovalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">출석 검토</h3>
          
          <!-- 출석 정보 -->
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">실습생</span>
                <p class="font-medium">{{ selectedAttendance?.studentName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">출석일</span>
                <p class="font-medium">{{ formatDate(selectedAttendance?.date) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">출석 시간</span>
                <p class="font-medium">{{ selectedAttendance?.checkIn }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">퇴근 시간</span>
                <p class="font-medium">{{ selectedAttendance?.checkOut }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">실습 시간</span>
                <p class="font-medium">{{ selectedAttendance?.hours }}시간</p>
              </div>
            </div>
          </div>

          <!-- 피드백 입력 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">피드백</label>
            <textarea
              v-model="approvalFeedback"
              rows="4"
              placeholder="피드백을 입력하세요 (선택사항)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- 버튼 -->
          <div class="flex gap-3">
            <button
              @click="approveAttendance"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              style="min-height: 44px;"
            >
              <CheckCircleIcon class="w-5 h-5 inline mr-1" />
              승인
            </button>
            <button
              @click="rejectAttendance"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              style="min-height: 44px;"
            >
              <XCircleIcon class="w-5 h-5 inline mr-1" />
              반려
            </button>
            <button
              @click="closeApprovalModal"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              style="min-height: 44px;"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세보기 모달 -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900">출석 상세보기</h3>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <!-- 출석 정보 -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">실습생</span>
                <p class="font-medium">{{ selectedAttendance?.studentName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">학번</span>
                <p class="font-medium">{{ selectedAttendance?.studentId }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">출석일</span>
                <p class="font-medium">{{ formatDate(selectedAttendance?.date) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">상태</span>
                <span :class="getStatusClass(selectedAttendance?.status || '')" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(selectedAttendance?.status || '') }}
                </span>
              </div>
              <div>
                <span class="text-sm text-gray-600">출석 시간</span>
                <p class="font-medium">{{ selectedAttendance?.checkIn }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">퇴근 시간</span>
                <p class="font-medium">{{ selectedAttendance?.checkOut }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">실습 시간</span>
                <p class="font-medium">{{ selectedAttendance?.hours }}시간</p>
              </div>
            </div>

            <div v-if="selectedAttendance?.feedback">
              <span class="text-sm text-gray-600">피드백</span>
              <div class="mt-1 p-4 bg-blue-50 rounded-lg">
                <p class="text-gray-800">{{ selectedAttendance.feedback }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              style="min-height: 44px;"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// 타입 정의
interface Attendance {
  id: number
  studentName: string
  studentId: string
  date: string
  checkIn: string
  checkOut: string
  hours: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  feedback?: string
}

// 상태
const filters = ref({
  status: '',
  studentName: '',
  startDate: '',
  endDate: ''
})

const showApprovalModal = ref(false)
const showDetailModal = ref(false)
const selectedAttendance = ref<Attendance | null>(null)
const approvalFeedback = ref('')

// Mock 데이터
const attendances = ref<Attendance[]>([
  {
    id: 1,
    studentName: '김민준',
    studentId: '2021001',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '17:00',
    hours: 8,
    status: 'PENDING'
  },
  {
    id: 2,
    studentName: '이서연',
    studentId: '2021002',
    date: '2024-01-15',
    checkIn: '09:30',
    checkOut: '17:30',
    hours: 8,
    status: 'PENDING'
  },
  {
    id: 3,
    studentName: '박지우',
    studentId: '2021003',
    date: '2024-01-14',
    checkIn: '09:00',
    checkOut: '18:00',
    hours: 9,
    status: 'APPROVED',
    feedback: '정상 출석 확인되었습니다.'
  },
  {
    id: 4,
    studentName: '최서준',
    studentId: '2021004',
    date: '2024-01-14',
    checkIn: '10:30',
    checkOut: '15:00',
    hours: 4.5,
    status: 'REJECTED',
    feedback: '실습 시간이 부족합니다. 최소 6시간 이상 필요합니다.'
  }
])

// 통계 계산
const totalAttendances = computed(() => attendances.value.length)
const pendingAttendances = computed(() => attendances.value.filter(a => a.status === 'PENDING').length)
const approvedAttendances = computed(() => attendances.value.filter(a => a.status === 'APPROVED').length)
const rejectedAttendances = computed(() => attendances.value.filter(a => a.status === 'REJECTED').length)

// 필터링된 출석
const filteredAttendances = computed(() => {
  return attendances.value.filter(attendance => {
    if (filters.value.status && attendance.status !== filters.value.status) return false
    if (filters.value.studentName && !attendance.studentName.includes(filters.value.studentName)) return false
    if (filters.value.startDate && attendance.date < filters.value.startDate) return false
    if (filters.value.endDate && attendance.date > filters.value.endDate) return false
    return true
  })
})

// 함수들
const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인 대기',
    APPROVED: '승인 완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return classes[status] || ''
}

const resetFilters = () => {
  filters.value = {
    status: '',
    studentName: '',
    startDate: '',
    endDate: ''
  }
}

const openApprovalModal = (attendance: Attendance) => {
  selectedAttendance.value = attendance
  approvalFeedback.value = ''
  showApprovalModal.value = true
}

const closeApprovalModal = () => {
  showApprovalModal.value = false
  selectedAttendance.value = null
  approvalFeedback.value = ''
}

const approveAttendance = () => {
  if (selectedAttendance.value) {
    const attendance = attendances.value.find(a => a.id === selectedAttendance.value!.id)
    if (attendance) {
      attendance.status = 'APPROVED'
      attendance.feedback = approvalFeedback.value || '출석이 승인되었습니다.'
    }
    alert('출석이 승인되었습니다.')
    closeApprovalModal()
  }
}

const rejectAttendance = () => {
  if (!approvalFeedback.value.trim()) {
    alert('반려 사유를 입력해주세요.')
    return
  }
  
  if (selectedAttendance.value) {
    const attendance = attendances.value.find(a => a.id === selectedAttendance.value!.id)
    if (attendance) {
      attendance.status = 'REJECTED'
      attendance.feedback = approvalFeedback.value
    }
    alert('출석이 반려되었습니다.')
    closeApprovalModal()
  }
}

const viewAttendance = (attendance: Attendance) => {
  selectedAttendance.value = attendance
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedAttendance.value = null
}
</script>

<style scoped>
/* iOS 자동 줌 방지 */
input[type="text"],
input[type="date"],
select,
textarea {
  font-size: 16px;
}

/* 터치 영역 최소 44px */
button,
a {
  min-height: 44px;
  min-width: 44px;
}
</style>
