<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- 헤더 -->
    <div class="max-w-4xl mx-auto mb-6 sm:mb-8">
      <div class="flex items-center gap-3 mb-4">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">목록으로</span>
        </button>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">실습 일지 작성</h1>
      <p class="text-sm sm:text-base text-gray-600">대학 양식에 따라 오늘의 실습 내용을 작성하세요</p>
    </div>

    <!-- 작성 폼 -->
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 양식 정보 -->
        <Card class="p-4 sm:p-6 bg-blue-50 border-blue-200">
          <div class="flex items-start gap-3">
            <DocumentTextIcon class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-blue-900 mb-1">{{ template.file_name }}</h3>
              <p class="text-xs text-blue-700">버전: {{ template.version }}</p>
            </div>
          </div>
        </Card>

        <!-- 동적 필드 렌더링 -->
        <Card class="p-4 sm:p-6">
          <div class="space-y-6">
            <div
              v-for="field in template.fields"
              :key="field.name"
              class="relative"
            >
              <!-- 텍스트 입력 -->
              <div v-if="field.type === 'text'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="text"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :maxlength="field.maxLength"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 텍스트 영역 -->
              <div v-else-if="field.type === 'textarea'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData[field.name]"
                  :rows="field.rows || 5"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :maxlength="field.maxLength"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                ></textarea>
                <p v-if="field.maxLength" class="mt-1 text-xs text-gray-500 text-right">
                  {{ (formData[field.name] || '').length }} / {{ field.maxLength }}
                </p>
              </div>

              <!-- 날짜 입력 -->
              <div v-else-if="field.type === 'date'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="date"
                  :required="field.required"
                  :max="today"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 선택 입력 -->
              <div v-else-if="field.type === 'select'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData[field.name]"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option v-for="option in field.options" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- 숫자 입력 -->
              <div v-else-if="field.type === 'number'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData[field.name]"
                  type="number"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 시간 입력 -->
              <div v-else-if="field.type === 'time'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="time"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        <!-- 액션 버튼 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            @click="handleSaveDraft"
            :loading="isSavingDraft"
            class="flex-1"
          >
            <DocumentIcon class="w-5 h-5 mr-2" />
            임시저장
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="isSubmitting"
            class="flex-1"
          >
            <PaperAirplaneIcon class="w-5 h-5 mr-2" />
            제출 (승인 요청)
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  ChevronLeftIcon,
  DocumentTextIcon,
  DocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import { mockJournalTemplate } from '@/mocks/journalTemplates'

const router = useRouter()

// 양식 데이터
const template = ref(mockJournalTemplate)

// 폼 데이터
const formData = reactive<Record<string, any>>({})

// 로딩 상태
const isSavingDraft = ref(false)
const isSubmitting = ref(false)

// 오늘 날짜
const today = new Date().toISOString().split('T')[0]

// 로컬스토리지 키
const DRAFT_KEY = 'journal_draft'

// 컴포넌트 마운트 시 임시저장 데이터 복원
onMounted(() => {
  // 양식의 필드 초기화
  template.value.fields.forEach(field => {
    formData[field.name] = ''
  })

  // 로컬스토리지에서 임시저장 데이터 불러오기
  const savedDraft = localStorage.getItem(DRAFT_KEY)
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft)
      Object.assign(formData, draft)
      console.log('임시저장된 데이터를 불러왔습니다')
    } catch (error) {
      console.error('임시저장 데이터 로드 실패:', error)
    }
  }
})

// 페이지 이탈 전 확인
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  // 폼 데이터가 있으면 경고
  const hasData = Object.values(formData).some(value => value && value !== '')
  if (hasData) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 뒤로 가기
const handleBack = () => {
  const hasData = Object.values(formData).some(value => value && value !== '')
  if (hasData) {
    if (confirm('작성 중인 내용이 있습니다. 목록으로 돌아가시겠습니까?')) {
      router.push('/student/journal/list')
    }
  } else {
    router.push('/student/journal/list')
  }
}

// 임시저장
const handleSaveDraft = () => {
  isSavingDraft.value = true

  // 로컬스토리지에 저장
  localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))

  setTimeout(() => {
    isSavingDraft.value = false
    alert('임시저장되었습니다')
  }, 500)
}

// 제출
const handleSubmit = () => {
  // 필수 필드 검증
  const requiredFields = template.value.fields.filter(f => f.required)
  const emptyFields = requiredFields.filter(f => !formData[f.name] || formData[f.name] === '')

  if (emptyFields.length > 0) {
    alert(`다음 필수 항목을 입력해주세요:\n${emptyFields.map(f => f.label).join(', ')}`)
    return
  }

  if (!confirm('실습 일지를 제출하시겠습니까? 제출 후에는 기관의 승인을 기다려야 합니다.')) {
    return
  }

  isSubmitting.value = true

  // API 호출 (현재는 mock)
  setTimeout(() => {
    console.log('제출 데이터:', formData)

    // 로컬스토리지 임시저장 데이터 삭제
    localStorage.removeItem(DRAFT_KEY)

    isSubmitting.value = false
    alert('실습 일지가 제출되었습니다. 기관의 승인을 기다려주세요.')
    router.push('/student/journal/list')
  }, 1000)
}
</script>
