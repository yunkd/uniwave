<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">출석 체크</h1>
      <p class="text-xs sm:text-sm lg:text-base text-gray-600">출퇴근 시간을 입력하고 기관 승인을 요청하세요</p>
    </div>

    <!-- 출석 입력 폼 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">출석 정보 입력</h3>
      <form @submit.prevent="handleSubmitAttendance" class="space-y-3 sm:space-y-4">
        <!-- 날짜 -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            실습 날짜 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.date"
            type="date"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            required
          />
        </div>

        <!-- 출근/퇴근 시간 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              출근 시간 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.checkIn"
              type="time"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              required
            />
          </div>

          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              퇴근 시간 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.checkOut"
              type="time"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              required
            />
          </div>
        </div>

        <!-- 휴게시간 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              휴게시간 (시간) <span class="text-gray-500">*</span>
            </label>
            <input
              v-model.number="form.breakHours"
              type="number"
              min="0"
              max="8"
              step="0.5"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              placeholder="0.5"
              required
            />
          </div>
          <div class="flex items-end pb-2.5">
            <p class="text-xs text-gray-500">
              <span class="font-medium">※ 식사시간 미포함</span><br/>
              휴게시간을 입력하면 실습시간에서 자동 차감됩니다
            </p>
          </div>
        </div>

        <!-- 총 실습 시간 (자동 계산) -->
        <div class="p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-medium text-gray-700">총 실습 시간</span>
            <span class="text-base sm:text-lg font-bold text-primary-600">{{ calculatedHours }}시간</span>
          </div>
        </div>

        <!-- 메모 (선택사항) -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            메모 (선택사항)
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-xs sm:text-sm"
            placeholder="특이사항이 있다면 입력하세요"
          ></textarea>
        </div>

        <!-- 제출 버튼 -->
        <Button type="submit" variant="primary" :loading="isLoading" full-width size="lg" class="text-sm sm:text-base">
          출석 승인 요청
        </Button>
      </form>
    </Card>

    <!-- 오늘의 출석 현황 -->
    <Card class="p-3 sm:p-4 lg:p-6">
      <div class="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">오늘의 출석</h3>
        <span class="text-xs sm:text-sm text-gray-500 flex-shrink-0">{{ today }}</span>
      </div>

      <div v-if="todayAttendance" class="space-y-3 sm:space-y-4">
        <!-- 승인 상태 -->
        <div 
          :class="[
            'flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg',
            getStatusColor(todayAttendance.status)
          ]"
        >
          <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
            :class="getStatusIconBg(todayAttendance.status)"
          >
            <component :is="getStatusIcon(todayAttendance.status)" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium mb-1" :class="getStatusTextColor(todayAttendance.status)">
              {{ getStatusLabel(todayAttendance.status) }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600">
              {{ todayAttendance.checkIn }} ~ {{ todayAttendance.checkOut }}
              ({{ todayAttendance.hours }}시간)
            </p>
            <p v-if="todayAttendance.feedback" class="text-xs sm:text-sm text-gray-700 mt-2">
              <span class="font-medium">피드백:</span> {{ todayAttendance.feedback }}
            </p>
          </div>
        </div>

        <!-- 기관 정보 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div class="p-2.5 sm:p-3 lg:p-4 bg-gray-50 rounded-lg">
            <p class="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">실습 기관</p>
            <p class="text-xs sm:text-sm lg:text-base font-medium text-gray-900 break-words">{{ todayAttendance.institution }}</p>
          </div>
          <div class="p-2.5 sm:p-3 lg:p-4 bg-gray-50 rounded-lg">
            <p class="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">실습 지도자</p>
            <p class="text-xs sm:text-sm lg:text-base font-medium text-gray-900 break-words">{{ todayAttendance.supervisor }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 sm:py-8 lg:py-12">
        <ClockIcon class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
        <p class="text-xs sm:text-sm text-gray-600">아직 출석을 입력하지 않았습니다</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const isLoading = ref(false)

const form = ref({
  date: new Date().toISOString().split('T')[0],
  checkIn: '09:00',
  checkOut: '18:00',
  breakHours: 1,
  notes: ''
})

// 오늘 날짜
const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

// 임시 데이터
const todayAttendance = ref<any>(null)

// 실습 시간 자동 계산 (휴게시간 차감)
const calculatedHours = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0
  
  const [inHour, inMin] = form.value.checkIn.split(':').map(Number)
  const [outHour, outMin] = form.value.checkOut.split(':').map(Number)
  
  const inMinutes = inHour * 60 + inMin
  const outMinutes = outHour * 60 + outMin
  
  const diffMinutes = outMinutes - inMinutes
  const totalHours = diffMinutes / 60
  const breakHours = form.value.breakHours || 0
  const actualHours = totalHours - breakHours
  
  return actualHours > 0 ? actualHours.toFixed(1) : '0.0'
})

const handleSubmitAttendance = () => {
  if (!form.value.checkIn || !form.value.checkOut) {
    alert('출근/퇴근 시간을 모두 입력하세요')
    return
  }

  isLoading.value = true

  // 임시: 1초 후 승인 대기 상태로 전환
  setTimeout(() => {
    todayAttendance.value = {
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
      hours: calculatedHours.value,
      status: 'PENDING',
      institution: '사회복지법인 희망나눔',
      supervisor: '김지도 사회복지사',
      feedback: null
    }
    isLoading.value = false
    
    // 폼 초기화
    form.value.checkIn = '09:00'
    form.value.checkOut = '18:00'
    form.value.breakHours = 1
    form.value.notes = ''
    
    alert('출석 승인 요청이 제출되었습니다. 기관 담당자의 승인을 기다려주세요.')
  }, 1000)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-50 border-yellow-200',
    'APPROVED': 'bg-green-50 border-green-200',
    'REJECTED': 'bg-red-50 border-red-200'
  }
  return colors[status] || 'bg-gray-50 border-gray-200'
}

const getStatusIconBg = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100',
    'APPROVED': 'bg-green-100',
    'REJECTED': 'bg-red-100'
  }
  return colors[status] || 'bg-gray-100'
}

const getStatusTextColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'text-yellow-900',
    'APPROVED': 'text-green-900',
    'REJECTED': 'text-red-900'
  }
  return colors[status] || 'text-gray-900'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    'PENDING': ClockIcon,
    'APPROVED': CheckCircleIcon,
    'REJECTED': XCircleIcon
  }
  return icons[status] || ClockIcon
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'PENDING': '승인 대기 중',
    'APPROVED': '출석 승인 완료',
    'REJECTED': '출석 반려'
  }
  return labels[status] || '알 수 없음'
}
</script>

<style scoped>
/* 날짜/시간 input 텍스트 오른쪽 정렬 */
input[type="date"],
input[type="time"] {
  text-align: right;
  direction: ltr;
}

/* 날짜/시간 선택기 아이콘 오른쪽 배치 */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  margin-left: auto;
  margin-right: 8px;
}

/* 휴게시간 입력 필드 스타일 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
