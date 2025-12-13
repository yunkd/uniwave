<template>
  <div class="max-w-7xl mx-auto">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">대시보드</h1>
      <p class="text-sm sm:text-base text-gray-600">실습 현황을 한눈에 확인하세요</p>
    </div>

    <!-- 기관 매칭 상태 -->
    <Card class="mb-6 sm:mb-8 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">실습 기관 매칭</h3>
          <p class="text-sm text-gray-600 mb-3">
            아직 실습 기관이 매칭되지 않았습니다
          </p>
          <router-link to="/student/institution-search">
            <Button variant="primary" size="sm">
              <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
              기관 찾기
            </Button>
          </router-link>
        </div>
      </div>
    </Card>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">총 실습 시간</p>
            <p class="text-3xl font-bold text-gray-900">0h</p>
            <p class="text-xs text-gray-500 mt-1">/ 160h 필요</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full" style="width: 0%"></div>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 대기</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ExclamationCircleIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 완료</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">제본 신청</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 위젯 그리드 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- 캘린더 -->
      <CalendarWidget />

      <!-- 메모 -->
      <MemoWidget />

      <!-- 최근 출석 기록 -->
      <Card>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">최근 출석 기록</h3>
          <router-link
            to="/student/attendance/history"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체보기
          </router-link>
        </div>

        <div class="text-center py-8 sm:py-12 text-gray-500">
          <ClipboardDocumentListIcon class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-sm">출석 기록이 없습니다</p>
          <p class="text-xs mt-1">출석 체크를 시작해보세요</p>
        </div>
      </Card>

      <!-- 실습 일지 -->
      <Card>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">실습 일지</h3>
          <router-link
            to="/student/journal/list"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체보기
          </router-link>
        </div>

        <div class="text-center py-8 sm:py-12 text-gray-500">
          <DocumentTextIcon class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-sm">실습 일지가 없습니다</p>
          <p class="text-xs mt-1">일지를 작성해보세요</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import CalendarWidget from '@/components/student/CalendarWidget.vue'
import MemoWidget from '@/components/student/MemoWidget.vue'
import {
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
</script>
