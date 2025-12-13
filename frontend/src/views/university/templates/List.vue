<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">양식 관리</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습 관련 양식을 관리하고 학생/기관에 배포하세요</p>
    </div>

    <!-- 양식 카테고리 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <!-- 평가서 양식 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardDocumentCheckIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900">평가서 양식</h2>
            <p class="text-xs text-gray-500">{{ templates.evaluation.count }}개</p>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mb-4">기관에서 작성하는 실습생 평가서 양식</p>
        <div class="space-y-2">
          <Button
            variant="outline"
            class="w-full text-xs sm:text-sm"
            @click="handleViewTemplate('evaluation')"
          >
            <DocumentTextIcon class="w-4 h-4 mr-1" />
            양식 보기
          </Button>
          <Button
            variant="primary"
            class="w-full text-xs sm:text-sm"
            @click="handleEditTemplate('evaluation')"
          >
            <PencilIcon class="w-4 h-4 mr-1" />
            양식 수정
          </Button>
        </div>
      </Card>

      <!-- 확인서 양식 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentCheckIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900">확인서 양식</h2>
            <p class="text-xs text-gray-500">{{ templates.certificate.count }}개</p>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mb-4">기관에서 발급하는 실습 확인서 양식</p>
        <div class="space-y-2">
          <Button
            variant="outline"
            class="w-full text-xs sm:text-sm"
            @click="handleViewTemplate('certificate')"
          >
            <DocumentTextIcon class="w-4 h-4 mr-1" />
            양식 보기
          </Button>
          <Button
            variant="primary"
            class="w-full text-xs sm:text-sm"
            @click="handleEditTemplate('certificate')"
          >
            <PencilIcon class="w-4 h-4 mr-1" />
            양식 수정
          </Button>
        </div>
      </Card>

      <!-- 일지 양식 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpenIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900">일지 양식</h2>
            <p class="text-xs text-gray-500">{{ templates.journal.count }}개</p>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mb-4">학생이 작성하는 실습 일지 양식</p>
        <div class="space-y-2">
          <Button
            variant="outline"
            class="w-full text-xs sm:text-sm"
            @click="handleViewTemplate('journal')"
          >
            <DocumentTextIcon class="w-4 h-4 mr-1" />
            양식 보기
          </Button>
          <Button
            variant="primary"
            class="w-full text-xs sm:text-sm"
            @click="handleEditTemplate('journal')"
          >
            <PencilIcon class="w-4 h-4 mr-1" />
            양식 수정
          </Button>
        </div>
      </Card>
    </div>

    <!-- 사용 안내 -->
    <Card class="p-4 sm:p-6 mt-6">
      <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-3">양식 관리 안내</h3>
      <div class="space-y-2 text-xs sm:text-sm text-gray-600">
        <p>• <strong>평가서 양식</strong>: 기관에서 학생을 평가할 때 사용하는 양식입니다</p>
        <p>• <strong>확인서 양식</strong>: 실습 완료 후 기관에서 발급하는 확인서 양식입니다</p>
        <p>• <strong>일지 양식</strong>: 학생이 매일 작성하는 실습 일지 양식입니다</p>
        <p class="mt-3 text-yellow-700">
          <strong>※ 주의:</strong> 양식 수정 시 이미 작성 중인 서류에는 영향을 주지 않으며, 새로 작성되는 서류부터 적용됩니다
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'

// 양식 데이터 (Mock)
const templates = ref({
  evaluation: {
    count: 1,
    name: '실습생 평가서',
    lastUpdated: '2024-09-01'
  },
  certificate: {
    count: 1,
    name: '실습 확인서',
    lastUpdated: '2024-09-01'
  },
  journal: {
    count: 1,
    name: '실습 일지',
    lastUpdated: '2024-09-01'
  }
})

// 양식 보기
const handleViewTemplate = (type: string) => {
  console.log('양식 보기:', type)
  // TODO: 모달 또는 새 페이지로 양식 표시
}

// 양식 수정
const handleEditTemplate = (type: string) => {
  console.log('양식 수정:', type)
  // TODO: 양식 편집기 페이지로 이동
}
</script>
