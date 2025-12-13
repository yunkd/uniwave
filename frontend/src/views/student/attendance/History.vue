<template>
  <div class="max-w-6xl mx-auto">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">출석 기록</h1>
      <p class="text-gray-600">실습 기간 동안의 출석 현황을 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">총 출석일</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalDays }}일</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <CalendarIcon class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">출석</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.present }}일</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">지각</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.late }}일</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">결석</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.absent }}일</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircleIcon class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 출석률 -->
    <Card class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">출석률</h3>
        <span class="text-2xl font-bold text-primary-600">{{ attendanceRate }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-primary-600 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${attendanceRate}%` }"
        ></div>
      </div>
    </Card>

    <!-- 출석 기록 테이블 -->
    <Card>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">상세 기록</h3>
        <select
          v-model="selectedMonth"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="2025-01">2025년 1월</option>
          <option value="2024-12">2024년 12월</option>
          <option value="2024-11">2024년 11월</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">날짜</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">출석 시간</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">퇴실 시간</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">실습 시간</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">상태</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in attendanceRecords"
              :key="record.date"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-4 px-4 text-sm text-gray-900">{{ record.date }}</td>
              <td class="py-4 px-4 text-sm text-gray-600">{{ record.checkIn }}</td>
              <td class="py-4 px-4 text-sm text-gray-600">{{ record.checkOut }}</td>
              <td class="py-4 px-4 text-sm text-gray-600">{{ record.hours }}</td>
              <td class="py-4 px-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusClass(record.status)
                  ]"
                >
                  {{ record.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="attendanceRecords.length === 0" class="text-center py-12">
        <CalendarIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-600">출석 기록이 없습니다</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/common/Card.vue'
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const selectedMonth = ref('2025-01')

// 임시 통계 데이터
const stats = ref({
  totalDays: 45,
  present: 40,
  late: 3,
  absent: 2
})

const attendanceRate = computed(() => {
  const rate = (stats.value.present / stats.value.totalDays) * 100
  return Math.round(rate * 10) / 10
})

// 임시 출석 기록
const attendanceRecords = ref([
  {
    date: '2025-01-13 (월)',
    checkIn: '09:00',
    checkOut: '18:00',
    hours: '8시간',
    status: '출석'
  },
  {
    date: '2025-01-10 (금)',
    checkIn: '09:15',
    checkOut: '18:00',
    hours: '7.75시간',
    status: '지각'
  },
  {
    date: '2025-01-09 (목)',
    checkIn: '09:00',
    checkOut: '18:00',
    hours: '8시간',
    status: '출석'
  },
  {
    date: '2025-01-08 (수)',
    checkIn: '-',
    checkOut: '-',
    hours: '-',
    status: '결석'
  },
  {
    date: '2025-01-07 (화)',
    checkIn: '09:00',
    checkOut: '18:00',
    hours: '8시간',
    status: '출석'
  }
])

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    '출석': 'bg-green-100 text-green-800',
    '지각': 'bg-yellow-100 text-yellow-800',
    '결석': 'bg-red-100 text-red-800',
    '조퇴': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
