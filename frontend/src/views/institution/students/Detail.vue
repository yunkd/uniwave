<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 헤더 -->
    <div class="mb-4 sm:mb-6">
      <div class="flex items-center gap-3 mb-4">
        <button
          @click="router.push('/institution/students')"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">목록으로</span>
        </button>
      </div>
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">실습생 상세 정보</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습생의 전체 활동 내역을 확인하세요</p>
    </div>

    <!-- 학생 기본 정보 -->
    <Card class="mb-4 sm:mb-6 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl flex-shrink-0">
          {{ student.name[0] }}
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-900 mb-1">{{ student.name }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span class="font-medium">학번:</span> {{ student.studentId }}
            </div>
            <div>
              <span class="font-medium">대학:</span> {{ student.university }}
            </div>
            <div>
              <span class="font-medium">학과:</span> {{ student.major }}
            </div>
            <div>
              <span class="font-medium">연락처:</span> {{ student.phone }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <Button
            variant="primary"
            @click="router.push(`/institution/evaluation/create?studentId=${student.id}`)"
            class="text-sm"
          >
            <ClipboardDocumentListIcon class="w-4 h-4 mr-2" />
            평가서 작성
          </Button>
          <Button
            variant="outline"
            @click="router.push(`/institution/certificate/create?studentId=${student.id}`)"
            class="text-sm"
          >
            <DocumentCheckIcon class="w-4 h-4 mr-2" />
            확인서 작성
          </Button>
        </div>
      </div>
    </Card>

    <!-- 실습 진행 상황 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <Card class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-900">출석 현황</h3>
          <ClipboardDocumentCheckIcon class="w-5 h-5 text-green-600" />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">승인</span>
            <span class="font-semibold text-green-600">{{ student.attendance.approved }}건</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">대기</span>
            <span class="font-semibold text-yellow-600">{{ student.attendance.pending }}건</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">반려</span>
            <span class="font-semibold text-red-600">{{ student.attendance.rejected }}건</span>
          </div>
        </div>
      </Card>

      <Card class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-900">일지 현황</h3>
          <DocumentTextIcon class="w-5 h-5 text-blue-600" />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">승인</span>
            <span class="font-semibold text-green-600">{{ student.journals.approved }}건</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">대기</span>
            <span class="font-semibold text-yellow-600">{{ student.journals.pending }}건</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">반려</span>
            <span class="font-semibold text-red-600">{{ student.journals.rejected }}건</span>
          </div>
        </div>
      </Card>

      <Card class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-900">실습 시간</h3>
          <ClockIcon class="w-5 h-5 text-primary-600" />
        </div>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">진행률</span>
              <span class="font-semibold text-gray-900">{{ student.progress }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-600 rounded-full transition-all"
                :style="{ width: `${student.progress}%` }"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">누적 시간</span>
            <span class="font-semibold text-gray-900">{{ student.totalHours }}시간</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">필수 시간</span>
            <span class="font-semibold text-gray-900">{{ student.requiredHours }}시간</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- 탭 메뉴 -->
    <div class="mb-4 sm:mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex gap-4 overflow-x-auto">
          <button
            @click="activeTab = 'attendance'"
            :class="[
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'attendance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            출석 기록
          </button>
          <button
            @click="activeTab = 'journals'"
            :class="[
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'journals'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            실습 일지
          </button>
        </nav>
      </div>
    </div>

    <!-- 출석 기록 -->
    <Card v-if="activeTab === 'attendance'" class="overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">출석 기록</h3>
      </div>
      
      <div v-if="attendanceRecords.length === 0" class="p-8 text-center text-gray-500">
        <ClipboardDocumentCheckIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p class="text-sm">출석 기록이 없습니다</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">출근</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">퇴근</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">실습시간</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="record in attendanceRecords"
              :key="record.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ record.date }}
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ record.checkIn }}
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ record.checkOut }}
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ record.hours }}시간
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusColor(record.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(record.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- 실습 일지 -->
    <Card v-if="activeTab === 'journals'" class="overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">실습 일지</h3>
      </div>

      <div v-if="journalRecords.length === 0" class="p-8 text-center text-gray-500">
        <DocumentTextIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p class="text-sm">작성된 일지가 없습니다</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="journal in journalRecords"
          :key="journal.id"
          class="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ journal.date }}</p>
              <span
                :class="getStatusColor(journal.status)"
                class="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ getStatusLabel(journal.status) }}
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ journal.content }}</p>
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
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const activeTab = ref('attendance')

// 학생 정보 (Mock)
const student = ref({
  id: route.params.id,
  name: '홍길동',
  studentId: '2021012345',
  university: '서울대학교',
  major: '사회복지학과',
  phone: '010-1234-5678',
  attendance: { approved: 18, pending: 2, rejected: 0 },
  journals: { approved: 15, pending: 1, rejected: 0 },
  totalHours: 144,
  requiredHours: 200,
  progress: 72
})

// 출석 기록 (Mock)
const attendanceRecords = ref([
  { id: '1', date: '2024-12-13', checkIn: '09:00', checkOut: '18:00', hours: 8, status: 'APPROVED' },
  { id: '2', date: '2024-12-12', checkIn: '09:00', checkOut: '17:30', hours: 7.5, status: 'APPROVED' },
  { id: '3', date: '2024-12-11', checkIn: '09:00', checkOut: '18:00', hours: 8, status: 'PENDING' },
  { id: '4', date: '2024-12-10', checkIn: '09:30', checkOut: '17:00', hours: 6.5, status: 'PENDING' }
])

// 일지 기록 (Mock)
const journalRecords = ref([
  {
    id: '1',
    date: '2024-12-13',
    content: '오늘은 사회복지사 선생님과 함께 노인 복지 프로그램 기획 회의에 참여했습니다.',
    status: 'APPROVED'
  },
  {
    id: '2',
    date: '2024-12-12',
    content: '복지관 이용자 상담 과정을 관찰하고, 상담 기록지 작성 방법을 학습했습니다.',
    status: 'APPROVED'
  },
  {
    id: '3',
    date: '2024-12-11',
    content: '아동 복지 프로그램 진행을 보조하며 아이들과 함께 활동했습니다.',
    status: 'PENDING'
  }
])

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

// 상태 색상
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
