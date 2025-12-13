<template>
  <div class="max-w-4xl mx-auto">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">출석 체크</h1>
      <p class="text-gray-600">QR 코드를 스캔하여 출석을 완료하세요</p>
    </div>

    <!-- QR 스캔 카드 -->
    <Card class="mb-6">
      <div class="text-center py-12">
        <div class="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          <QrCodeIcon class="w-32 h-32 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          QR 코드 스캔
        </h3>
        <p class="text-sm text-gray-600 mb-6">
          기관에서 제공한 QR 코드를 스캔하세요
        </p>
        <Button variant="primary" size="lg" @click="handleScanQR">
          <QrCodeIcon class="w-5 h-5 mr-2" />
          QR 스캔하기
        </Button>
      </div>
    </Card>

    <!-- 수동 입력 -->
    <Card class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        출석 코드 수동 입력
      </h3>
      <form @submit.prevent="handleManualCheck" class="space-y-4">
        <Input
          v-model="attendanceCode"
          label="출석 코드"
          placeholder="6자리 출석 코드 입력"
          :error="error"
          maxlength="6"
        />
        <Button type="submit" variant="primary" :loading="isLoading" full-width>
          출석 확인
        </Button>
      </form>
    </Card>

    <!-- 오늘의 출석 현황 -->
    <Card>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">오늘의 출석</h3>
        <span class="text-sm text-gray-500">{{ today }}</span>
      </div>

      <div v-if="todayAttendance" class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-green-900">출석 완료</p>
            <p class="text-sm text-green-700">{{ todayAttendance.checkInTime }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">실습 기관</p>
            <p class="text-base font-medium text-gray-900">{{ todayAttendance.institution }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">실습 지도자</p>
            <p class="text-base font-medium text-gray-900">{{ todayAttendance.supervisor }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-600">아직 출석하지 않았습니다</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Card from '@/components/common/Card.vue'
import {
  QrCodeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const attendanceCode = ref('')
const isLoading = ref(false)
const error = ref('')

// 오늘 날짜
const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

// 임시 데이터
const todayAttendance = ref<any>(null)

const handleScanQR = () => {
  alert('QR 스캔 기능은 백엔드 연동 후 구현됩니다')
  // 임시: 출석 완료 처리
  todayAttendance.value = {
    checkInTime: '09:30',
    institution: '사회복지법인 희망나눔',
    supervisor: '김지도 사회복지사'
  }
}

const handleManualCheck = () => {
  if (attendanceCode.value.length !== 6) {
    error.value = '6자리 출석 코드를 입력하세요'
    return
  }

  isLoading.value = true
  error.value = ''

  // 임시: 1초 후 출석 완료
  setTimeout(() => {
    todayAttendance.value = {
      checkInTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      institution: '사회복지법인 희망나눔',
      supervisor: '김지도 사회복지사'
    }
    isLoading.value = false
    attendanceCode.value = ''
  }, 1000)
}
</script>
