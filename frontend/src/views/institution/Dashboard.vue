<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">대시보드</h1>
      <p class="text-gray-600">실습생 관리 현황</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">전체 실습생</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">명</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-primary-600" />
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
            <ClockIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">완료된 승인</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">승인 대기 목록</h3>
      </template>

      <div class="text-center py-12 text-gray-500">
        <ClipboardDocumentCheckIcon class="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p class="text-sm">승인 대기 중인 항목이 없습니다</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'
</script>
