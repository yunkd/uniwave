<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">대시보드</h1>
      <p class="text-xs sm:text-sm lg:text-base text-gray-600">대학 실습 관리 현황</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">전체 학생</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-1">명</p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UsersIcon class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">승인 대기</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-1">명</p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">실습 중</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-1">명</p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-1">제본 신청</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-1">건</p>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">학생 승인 대기</h3>

        <div class="text-center py-6 sm:py-8 lg:py-12 text-gray-500">
          <UserGroupIcon class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
          <p class="text-xs sm:text-sm">승인 대기 중인 학생이 없습니다</p>
        </div>
      </Card>

      <Card class="p-3 sm:p-4 lg:p-6">
        <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">제본 신청 현황</h3>

        <div class="text-center py-6 sm:py-8 lg:py-12 text-gray-500">
          <DocumentDuplicateIcon class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
          <p class="text-xs sm:text-sm">제본 신청이 없습니다</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'
</script>
