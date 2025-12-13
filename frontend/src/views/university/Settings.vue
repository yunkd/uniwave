<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">시스템 설정</h1>
      <p class="text-xs sm:text-sm text-gray-600">시스템 설정을 관리하세요</p>
    </div>

    <!-- 학기 설정 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">학기 설정</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">현재 학기</label>
          <select
            v-model="settings.currentSemester"
            class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          >
            <option value="2024-1">2024학년도 1학기</option>
            <option value="2024-2">2024학년도 2학기</option>
            <option value="2025-1">2025학년도 1학기</option>
            <option value="2025-2">2025학년도 2학기</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">학기 시작일</label>
            <input
              v-model="settings.semesterStartDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">학기 종료일</label>
            <input
              v-model="settings.semesterEndDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>
    </Card>

    <!-- 실습 설정 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">실습 설정</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">필수 실습 시간</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="settings.requiredHours"
              type="number"
              min="0"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
            <span class="text-sm text-gray-600">시간</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">출석 인정 기준</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="settings.attendanceThreshold"
              type="number"
              min="0"
              max="24"
              step="0.5"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
            <span class="text-sm text-gray-600">시간 이상</span>
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="settings.autoApproval"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="text-sm text-gray-700">학생 자동 승인 (기관 배정 시)</span>
          </label>
        </div>
      </div>
    </Card>

    <!-- 알림 설정 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">알림 설정</h2>
      <div class="space-y-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="settings.notifications.newStudent"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="text-sm text-gray-700">신규 학생 등록 시 알림</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="settings.notifications.documentSubmit"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="text-sm text-gray-700">서류 제출 시 알림</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="settings.notifications.bindingRequest"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="text-sm text-gray-700">제본 신청 시 알림</span>
        </label>
      </div>
    </Card>

    <!-- 저장 버튼 -->
    <div class="flex justify-end gap-2">
      <Button variant="outline" @click="handleReset">
        초기화
      </Button>
      <Button variant="primary" @click="handleSave">
        저장하기
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'

// 설정 데이터 (Mock)
const settings = ref({
  currentSemester: '2024-2',
  semesterStartDate: '2024-09-01',
  semesterEndDate: '2024-12-31',
  requiredHours: 200,
  attendanceThreshold: 4,
  autoApproval: false,
  notifications: {
    newStudent: true,
    documentSubmit: true,
    bindingRequest: true
  }
})

// 저장
const handleSave = () => {
  console.log('설정 저장:', settings.value)
  alert('설정이 저장되었습니다')
  // TODO: API 호출
}

// 초기화
const handleReset = () => {
  if (confirm('설정을 초기화하시겠습니까?')) {
    settings.value = {
      currentSemester: '2024-2',
      semesterStartDate: '2024-09-01',
      semesterEndDate: '2024-12-31',
      requiredHours: 200,
      attendanceThreshold: 4,
      autoApproval: false,
      notifications: {
        newStudent: true,
        documentSubmit: true,
        bindingRequest: true
      }
    }
  }
}
</script>
